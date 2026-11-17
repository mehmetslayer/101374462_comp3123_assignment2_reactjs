import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="text-center py-5">
      <h1 className="display-6">Page not found</h1>
      <p className="text-muted">The page you are looking for does not exist.</p>
      <Button as={Link} to="/">Go home</Button>
    </div>
  );
}