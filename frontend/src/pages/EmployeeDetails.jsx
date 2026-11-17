import { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Row, Spinner } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteEmployee, getEmployee } from '../api/employees';
import Avatar from '../components/Avatar';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import errorMessage from '../utils/errorMessage';
import { formatDate, formatSalary, fullName } from '../utils/format';

export default function EmployeeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getEmployee(id)
      .then(({ data }) => setEmployee(data))
      .catch((err) => {
        const status = err.response?.status;
        setError(status === 404 || status === 400 ? 'Employee not found.' : errorMessage(err));
      })
      .finally(() => setLoading(false));
  }, [id]);

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteEmployee(id);
      navigate('/employees', { state: { message: `${fullName(employee)} was deleted.` } });
    } catch (err) {
      setError(errorMessage(err, 'Could not delete the employee.'));
      setShowDelete(false);
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  if (!employee) {
    return (
      <Alert variant="danger">
        {error} <Alert.Link as={Link} to="/employees">Back to employees</Alert.Link>
      </Alert>
    );
  }

  const rows = [
    ['Email', employee.email],
    ['Position', employee.position],
    ['Department', employee.department],
    ['Salary', formatSalary(employee.salary)],
    ['Date of joining', formatDate(employee.date_of_joining)],
  ];

  return (
    <Card className="mx-auto shadow-sm" style={{ maxWidth: 640 }}>
      <Card.Body className="p-4">
        {error && <Alert variant="danger">{error}</Alert>}

        <div className="d-flex align-items-center gap-3 mb-4">
          <Avatar employee={employee} size={96} />
          <div>
            <h1 className="h3 mb-1">{fullName(employee)}</h1>
            <div className="text-muted">{employee.position}</div>
          </div>
        </div>

        <dl className="mb-4">
          {rows.map(([label, value]) => (
            <Row key={label} className="py-2 border-bottom">
              <Col as="dt" sm={4} className="text-muted fw-normal">{label}</Col>
              <Col as="dd" sm={8} className="mb-0">{value}</Col>
            </Row>
          ))}
        </dl>

        <div className="d-flex flex-wrap gap-2">
          <Button as={Link} to={`/employees/${id}/edit`}>Edit</Button>
          <Button variant="outline-danger" onClick={() => setShowDelete(true)}>Delete</Button>
          <Button as={Link} to="/employees" variant="outline-secondary" className="ms-auto">
            Back to list
          </Button>
        </div>
      </Card.Body>

      <ConfirmDeleteModal
        show={showDelete}
        name={fullName(employee)}
        deleting={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setShowDelete(false)}
      />
    </Card>
  );
}