import { Container } from 'react-bootstrap';
import { Navigate, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import ProtectedRoute from './components/ProtectedRoute';
import PublicOnlyRoute from './components/PublicOnlyRoute';
import EmployeeList from './pages/EmployeeList';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Signup from './pages/Signup';

export default function App() {
  return (
    <>
      <NavBar />
      <Container as="main" className="pb-5">
        <Routes>
          <Route path="/" element={<Navigate to="/employees" replace />} />

          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/employees" element={<EmployeeList />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
    </>
  );
}