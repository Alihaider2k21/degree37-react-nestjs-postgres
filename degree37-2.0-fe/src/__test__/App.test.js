import React from 'react';
import { render } from '@testing-library/react';
import App from '../pages/App';
import { AuthProvider } from '../components/common/context/AuthContext';

jest.mock('react-slick', () => ({
  __esModule: true,
  default: jest.fn(),
}));

test('renders the App component', () => {
  render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
});
