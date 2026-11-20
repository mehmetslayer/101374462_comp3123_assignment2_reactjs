import { Container } from 'react-bootstrap';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import NavBar from './components/NavBar';
import ProtectedRoute from './components/ProtectedRoute';
import PublicOnlyRoute from './components/PublicOnlyRoute';
import EmployeeDetails from './pages/EmployeeDetails';
import EmployeeForm from './pages/EmployeeForm';
import EmployeeList from './pages/EmployeeList';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Signup from './pages/Signup';

export default function App() {
  const location = useLocation();

  return (
    <>
      <NavBar />
      <Container as="main" className="pb-5">
        {/* keyed by path so moving to another page clears a previous error */}
        <ErrorBoundary key={location.pathname}>
          <Routes>
            <Route path="/" element={<Navigate to="/employees" replace />} />

            <Route element={<PublicOnlyRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path="/employees" element={<EmployeeList />} />
              <Route path="/employees/add" element={<EmployeeForm />} />
              <Route path="/employees/:id" element={<EmployeeDetails />} />
              <Route path="/employees/:id/edit" element={<EmployeeForm />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </Container>
    </>
  );
}