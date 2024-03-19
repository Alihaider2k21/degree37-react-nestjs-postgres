import React from 'react';
import { Link } from 'react-router-dom';

function NotAuthorizedPage() {
  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div className="text-center">
        <h1 className="display-4">403</h1>
        <p className="lead">You are not authorized</p>
        <p className="text-muted">
          Sorry, you do not have permission to access this page.
        </p>
        <Link to="/dashboard" className="btn btn-primary">
          Go to DashBoard
        </Link>
      </div>
    </div>
  );
}

export default NotAuthorizedPage;
