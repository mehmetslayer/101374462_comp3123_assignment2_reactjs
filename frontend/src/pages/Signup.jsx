import { useState } from 'react';
import { Alert, Button, Card, Form, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../api/auth';
import errorMessage from '../utils/errorMessage';
import { EMAIL_RE, PASSWORD_RE, USERNAME_RE } from '../utils/validation';

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const next = {};
    if (!USERNAME_RE.test(form.username.trim())) {
      next.username = 'Username must be 3-50 characters without spaces';
    }
    if (!EMAIL_RE.test(form.email.trim()) || form.email.trim().length > 50) {
      next.email = 'Enter a valid email address';
    }
    if (!PASSWORD_RE.test(form.password)) {
      next.password = 'Password must be 8-50 characters with at least one letter and one number';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setLoading(true);
    try {
      await signup({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      navigate('/login', { replace: true, state: { signedUp: true } });
    } catch (err) {
      setServerError(
        err.response?.status === 409 ? 'This username or email is already taken.' : errorMessage(err)
      );
    } finally {
      setLoading(false);
    }
  };

  const field = (name, label, type, autoComplete, hint) => (
    <Form.Group className="mb-3" controlId={name}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        isInvalid={Boolean(errors[name])}
        autoComplete={autoComplete}
      />
      {hint && !errors[name] && <Form.Text muted>{hint}</Form.Text>}
      <Form.Control.Feedback type="invalid">{errors[name]}</Form.Control.Feedback>
    </Form.Group>
  );

  return (
    <Card className="mx-auto shadow-sm" style={{ maxWidth: 420 }}>
      <Card.Body className="p-4">
        <h1 className="h3 mb-4">Sign up</h1>
        {serverError && <Alert variant="danger">{serverError}</Alert>}

        <Form noValidate onSubmit={handleSubmit}>
          {field('username', 'Username', 'text', 'username')}
          {field('email', 'Email', 'email', 'email')}
          {field('password', 'Password', 'password', 'new-password',
            '8-50 characters, at least one letter and one number')}

          <Button type="submit" className="w-100 mt-2" disabled={loading}>
            {loading ? <Spinner size="sm" animation="border" /> : 'Create account'}
          </Button>
        </Form>

        <p className="mt-3 mb-0 text-center">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </Card.Body>
    </Card>
  );
}