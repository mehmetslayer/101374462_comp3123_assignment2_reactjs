import { useEffect, useState } from 'react';
import { Alert, Button, ButtonGroup, Card, Col, Form, Row, Spinner, Table } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { deleteEmployee, getEmployees, searchEmployees } from '../api/employees';
import Avatar from '../components/Avatar';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import errorMessage from '../utils/errorMessage';
import { fullName } from '../utils/format';

export default function EmployeeList() {
  const location = useLocation();
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(location.state?.message ?? '');

  const [search, setSearch] = useState({ department: '', position: '' });
  const [searchError, setSearchError] = useState('');
  const [activeSearch, setActiveSearch] = useState(null);

  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async (params) => {
    setLoading(true);
    setError('');
    try {
      const { data } = params ? await searchEmployees(params) : await getEmployees();
      setEmployees(data);
      setActiveSearch(params ?? null);
    } catch (err) {
      setError(errorMessage(err, 'Could not load employees.'));
    } finally {
      setLoading(false);
    }
  };

  // first load; state is only set in the promise callbacks
  useEffect(() => {
    getEmployees()
      .then(({ data }) => setEmployees(data))
      .catch((err) => setError(errorMessage(err, 'Could not load employees.')))
      .finally(() => setLoading(false));
  }, []);

  // clear the success message from history so a refresh does not show it again
  useEffect(() => {
    if (location.state?.message) navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (search.department.trim()) params.department = search.department.trim();
    if (search.position.trim()) params.position = search.position.trim();

    if (!params.department && !params.position) {
      setSearchError('Enter a department or a position to search.');
      return;
    }
    setSearchError('');
    load(params);
  };

  const clearSearch = () => {
    setSearch({ department: '', position: '' });
    setSearchError('');
    load();
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteEmployee(toDelete._id);
      setEmployees((list) => list.filter((e) => e._id !== toDelete._id));
      setSuccess(`${fullName(toDelete)} was deleted.`);
      setToDelete(null);
    } catch (err) {
      setError(errorMessage(err, 'Could not delete the employee.'));
      setToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const searchLabel = activeSearch &&
    Object.entries(activeSearch).map(([key, value]) => `${key} "${value}"`).join(' and ');

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h1 className="h3 mb-0">Employees</h1>
        <Button as={Link} to="/employees/add">Add Employee</Button>
      </div>

      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

      <Card className="mb-3 shadow-sm">
        <Card.Body>
          <Form noValidate onSubmit={handleSearch}>
            <Row className="g-2 align-items-end">
              <Col md>
                <Form.Group controlId="search-department">
                  <Form.Label>Department</Form.Label>
                  <Form.Control
                    value={search.department}
                    onChange={(e) => setSearch({ ...search, department: e.target.value })}
                    placeholder="e.g. IT"
                    isInvalid={Boolean(searchError)}
                  />
                </Form.Group>
              </Col>
              <Col md>
                <Form.Group controlId="search-position">
                  <Form.Label>Position</Form.Label>
                  <Form.Control
                    value={search.position}
                    onChange={(e) => setSearch({ ...search, position: e.target.value })}
                    placeholder="e.g. Developer"
                    isInvalid={Boolean(searchError)}
                  />
                </Form.Group>
              </Col>
              <Col md="auto" className="d-flex gap-2">
                <Button type="submit" disabled={loading}>Search</Button>
                <Button variant="outline-secondary" onClick={clearSearch} disabled={loading}>
                  Clear
                </Button>
              </Col>
            </Row>
            {searchError && <div className="text-danger small mt-2">{searchError}</div>}
          </Form>
        </Card.Body>
      </Card>

      {activeSearch && !loading && (
        <p className="text-muted">
          {employees.length} result{employees.length === 1 ? '' : 's'} for {searchLabel}
        </p>
      )}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" />
          <div className="mt-2 text-muted">Loading employees...</div>
        </div>
      ) : employees.length === 0 ? (
        <Card body className="text-center text-muted py-4 shadow-sm">
          {activeSearch ? 'No employees match your search.' : 'No employees yet. Add your first employee.'}
        </Card>
      ) : (
        <Card className="shadow-sm">
          <Table responsive hover className="mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th scope="col">Employee</th>
                <th scope="col">Email</th>
                <th scope="col">Position</th>
                <th scope="col">Department</th>
                <th scope="col" className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp._id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <Avatar employee={emp} />
                      <span>{fullName(emp)}</span>
                    </div>
                  </td>
                  <td>{emp.email}</td>
                  <td>{emp.position}</td>
                  <td>{emp.department}</td>
                  <td className="text-end text-nowrap">
                    <ButtonGroup size="sm">
                      <Button as={Link} to={`/employees/${emp._id}`} variant="outline-primary">View</Button>
                      <Button as={Link} to={`/employees/${emp._id}/edit`} variant="outline-secondary">Edit</Button>
                      <Button variant="outline-danger" onClick={() => setToDelete(emp)}>Delete</Button>
                    </ButtonGroup>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}

      <ConfirmDeleteModal
        show={Boolean(toDelete)}
        name={toDelete ? fullName(toDelete) : ''}
        deleting={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}