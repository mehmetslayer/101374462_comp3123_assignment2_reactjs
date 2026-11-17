import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NavBar() {
  const { isAuthenticated, username, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <Navbar bg="dark" data-bs-theme="dark" expand="md" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to={isAuthenticated ? '/employees' : '/login'}>
          Employee Manager
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          {isAuthenticated ? (
            <>
              <Nav className="me-auto">
                <Nav.Link as={NavLink} to="/employees" end>Employees</Nav.Link>
                <Nav.Link as={NavLink} to="/employees/add">Add Employee</Nav.Link>
              </Nav>
              <Navbar.Text className="me-3">Signed in as {username}</Navbar.Text>
              <Button variant="outline-light" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Nav className="ms-auto">
              <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
              <Nav.Link as={NavLink} to="/signup">Sign up</Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}