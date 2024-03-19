import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div className="text-center">
        <h1 className="display-4">404</h1>
        <p className="lead">Oops! Page not found</p>
        <p className="text-muted">
          The page you are looking for might have been removed or does not
          exist.
        </p>
        <Link to="/dashboard" className="btn btn-primary">
          Go to DashBoard
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
