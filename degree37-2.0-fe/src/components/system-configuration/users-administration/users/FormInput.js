import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import style from './index.module.scss';

const FormInput = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  required,
  error,
  errorHandler,
  isPassword,
  disabled,
  readOnly,
  isWidth,
}) => {
  const [toggle, setToggle] = useState(true);
  const handleClick = () => {
    setToggle(!toggle); // Toggle the value of 'toggle'
  };
  return (
    <div className={`form-field ${isWidth ? 'w-100' : ''}`}>
      <div className={`h-100 field ${isPassword ? 'password' : ''}`}>
        <input
          type={
            type === 'date'
              ? 'date'
              : !toggle || !isPassword
              ? type
              : 'password'
          }
          className={'form-control'}
          name={name}
          value={value}
          disabled={disabled}
          onChange={onChange}
          onBlur={errorHandler}
          placeholder=" "
          required={required}
          readOnly={readOnly}
        />
        <label>
          {label}
          {required ? '*' : ''}
        </label>
        {isPassword ? (
          <div onClick={handleClick} className="icon">
            {!toggle && <FontAwesomeIcon icon={faEye} />}
            {toggle && <FontAwesomeIcon icon={faEyeSlash} />}
          </div>
        ) : null}
      </div>
      {error && (
        <div>
          <div className="error">
            <p className={`${style.error} mt-0`}>{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormInput;
