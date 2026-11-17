import { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Form, Image, Row, Spinner } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createEmployee, getEmployee, pictureUrl, updateEmployee } from '../api/employees';
import errorMessage from '../utils/errorMessage';
import { EMAIL_RE } from '../utils/validation';

const EMPTY = {
  first_name: '', last_name: '', email: '', position: '',
  department: '', salary: '', date_of_joining: '',
};
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

// used for both Add (/employees/add) and Edit (/employees/:id/edit)
export default function EmployeeForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [currentPicture, setCurrentPicture] = useState(null);

  useEffect(() => {
    if (!isEdit) return;
    getEmployee(id)
      .then(({ data }) => {
        setValues({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          position: data.position,
          department: data.department,
          salary: String(data.salary),
          date_of_joining: data.date_of_joining?.slice(0, 10) ?? '',
        });
        setCurrentPicture(pictureUrl(data.profile_picture));
      })
      .catch((err) => {
        const status = err.response?.status;
        setLoadError(status === 404 || status === 400 ? 'Employee not found.' : errorMessage(err));
      })
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  // free the temporary preview URL when it changes or the page closes
  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    // hide a field's error as soon as the user edits it
    if (errors[name]) {
      const next = { ...errors };
      delete next[name];
      setErrors(next);
    }
  };

  const handleFile = (e) => {
    const picked = e.target.files[0];
    const next = { ...errors };
    delete next.profile_picture;

    if (picked && !IMAGE_TYPES.includes(picked.type)) {
      next.profile_picture = 'Only JPEG, PNG or WebP images are allowed';
    } else if (picked && picked.size > MAX_IMAGE_SIZE) {
      next.profile_picture = 'Image must be 2 MB or smaller';
    }
    setErrors(next);

    if (!picked || next.profile_picture) {
      e.target.value = '';
      setFile(null);
      setPreview(null);
      return;
    }
    setFile(picked);
    setPreview(URL.createObjectURL(picked));
  };

  const validate = () => {
    const next = {};
    const v = Object.fromEntries(Object.entries(values).map(([k, val]) => [k, val.trim()]));
    if (!v.first_name || v.first_name.length > 50) next.first_name = 'First name is required (max 50 characters)';
    if (!v.last_name || v.last_name.length > 50) next.last_name = 'Last name is required (max 50 characters)';
    if (!EMAIL_RE.test(v.email) || v.email.length > 100) next.email = 'Enter a valid email address';
    if (!v.position || v.position.length > 100) next.position = 'Position is required (max 100 characters)';
    if (!v.department || v.department.length > 100) next.department = 'Department is required (max 100 characters)';
    if (v.salary === '' || Number.isNaN(Number(v.salary)) || Number(v.salary) < 0) {
      next.salary = 'Salary must be a number of 0 or more';
    }
    if (!v.date_of_joining) next.date_of_joining = 'Date of joining is required';
    if (errors.profile_picture) next.profile_picture = errors.profile_picture;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    const clean = Object.fromEntries(Object.entries(values).map(([k, val]) => [k, val.trim()]));
    setSaving(true);
    try {
      if (isEdit) {
        await updateEmployee(id, clean, file);
      } else {
        await createEmployee(clean, file);
      }
      const name = `${clean.first_name} ${clean.last_name}`;
      navigate('/employees', { state: { message: `${name} was ${isEdit ? 'updated' : 'added'}.` } });
    } catch (err) {
      setServerError(err.response?.status === 404 ? 'Employee not found.' : errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  if (loadError) {
    return (
      <Alert variant="danger">
        {loadError} <Alert.Link as={Link} to="/employees">Back to employees</Alert.Link>
      </Alert>
    );
  }

  const field = (name, label, type = 'text', props = {}) => (
    <Form.Group controlId={name}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type={type}
        name={name}
        value={values[name]}
        onChange={handleChange}
        isInvalid={Boolean(errors[name])}
        {...props}
      />
      <Form.Control.Feedback type="invalid">{errors[name]}</Form.Control.Feedback>
    </Form.Group>
  );

  const shownPicture = preview || currentPicture;

  return (
    <Card className="mx-auto shadow-sm" style={{ maxWidth: 760 }}>
      <Card.Body className="p-4">
        <h1 className="h3 mb-4">{isEdit ? 'Edit Employee' : 'Add Employee'}</h1>
        {serverError && <Alert variant="danger">{serverError}</Alert>}

        <Form noValidate onSubmit={handleSubmit}>
          <Row className="g-3">
            <Col md={6}>{field('first_name', 'First name')}</Col>
            <Col md={6}>{field('last_name', 'Last name')}</Col>
            <Col md={6}>{field('email', 'Email', 'email')}</Col>
            <Col md={6}>{field('position', 'Position')}</Col>
            <Col md={6}>{field('department', 'Department')}</Col>
            <Col md={6}>{field('salary', 'Salary (CAD)', 'number', { min: 0, step: '0.01' })}</Col>
            <Col md={6}>{field('date_of_joining', 'Date of joining', 'date')}</Col>

            <Col md={6}>
              <Form.Group controlId="profile_picture">
                <Form.Label>Profile picture (optional)</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFile}
                  isInvalid={Boolean(errors.profile_picture)}
                />
                <Form.Text muted>JPEG, PNG or WebP, up to 2 MB.</Form.Text>
                <Form.Control.Feedback type="invalid">{errors.profile_picture}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            {shownPicture && (
              <Col xs={12}>
                <div className="d-flex align-items-center gap-3">
                  <Image src={shownPicture} alt="Profile picture preview" roundedCircle
                    style={{ width: 96, height: 96, objectFit: 'cover' }} className="border" />
                  <span className="text-muted small">
                    {preview ? 'New picture (saved when you submit)' : 'Current picture'}
                  </span>
                </div>
              </Col>
            )}
          </Row>

          <div className="d-flex gap-2 mt-4">
            <Button type="submit" disabled={saving}>
              {saving ? <Spinner size="sm" animation="border" /> : isEdit ? 'Save changes' : 'Add employee'}
            </Button>
            <Button as={Link} to={isEdit ? `/employees/${id}` : '/employees'} variant="outline-secondary">
              Cancel
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}