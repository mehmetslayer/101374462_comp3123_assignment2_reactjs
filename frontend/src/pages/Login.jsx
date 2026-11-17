import { useState } from 'react';
import { Alert, Button, Card, Form, Spinner } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { login as loginRequest } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import errorMessage from '../utils/errorMessage';

export default function Login() {
  const { login, expired } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ identifier: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const next = {};
    if (!form.identifier.trim()) next.identifier = 'Username or email is required';
    if (!form.password) next.password = 'Password is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setLoading(true);
    try {
      const identifier = form.identifier.trim();
      const { data } = await loginRequest(identifier, form.password);
      login(data.token, identifier);
      navigate('/employees', { replace: true });
    } catch (err) {
      setServerError(
        err.response?.status === 401 ? 'Invalid username/email or password.' : errorMessage(err)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto shadow-sm" style={{ maxWidth: 420 }}>
      <Card.Body className="p-4">
        <h1 className="h3 mb-4">Login</h1>

        {location.state?.signedUp && (
          <Alert variant="success">Account created. You can log in now.</Alert>
        )}
        {expired && <Alert variant="warning">Your session expired. Please log in again.</Alert>}
        {serverError && <Alert variant="danger">{serverError}</Alert>}

        <Form noValidate onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="identifier">
            <Form.Label>Username or email</Form.Label>
            <Form.Control
              name="identifier"
              value={form.identifier}
              onChange={handleChange}
              isInvalid={Boolean(errors.identifier)}
              autoComplete="username"
            />
            <Form.Control.Feedback type="invalid">{errors.identifier}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-4" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              isInvalid={Boolean(errors.password)}
              autoComplete="current-password"
            />
            <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
          </Form.Group>

          <Button type="submit" className="w-100" disabled={loading}>
            {loading ? <Spinner size="sm" animation="border" /> : 'Login'}
          </Button>
        </Form>

        <p className="mt-3 mb-0 text-center">
          No account? <Link to="/signup">Sign up</Link>
        </p>
      </Card.Body>
    </Card>
  );
}