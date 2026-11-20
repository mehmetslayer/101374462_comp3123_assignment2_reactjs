import { Component } from 'react';
import { Alert, Button } from 'react-bootstrap';

// Error boundaries must be class components: React has no hook for componentDidCatch.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('UI error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert variant="danger" className="mt-4">
          <Alert.Heading as="h2" className="h5">Something went wrong</Alert.Heading>
          <p>This page could not be displayed. Please try again.</p>
          <Button variant="outline-danger" onClick={() => window.location.assign('/employees')}>
            Back to employees
          </Button>
        </Alert>
      );
    }
    return this.props.children;
  }
}