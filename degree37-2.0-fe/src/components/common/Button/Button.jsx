import React from 'react';

const Button = ({ loading, value, children, ...props }) => {
  return (
    <button disabled={loading} {...props}>
      {loading ? 'Processing...' : children}
    </button>
  );
};

export default Button;
