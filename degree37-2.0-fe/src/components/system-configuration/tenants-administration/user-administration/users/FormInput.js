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
}) => {
  const [toggle, setToggle] = useState(true);
  const handleClick = () => {
    setToggle(!toggle); // Toggle the value of 'toggle'
  };
  return (
    <div className={`form-field ${style.formFeild}`}>
      <div className={`h-100 field ${isPassword ? 'password' : ''}`}>
        <input
          type={
            type === 'date'
              ? 'date'
              : !toggle || !isPassword
              ? 'text'
              : 'password'
          }
          className="form-control"
          name={name}
          value={value}
          disabled={disabled}
          onChange={onChange}
          onBlur={errorHandler}
          placeholder=" "
          required
          readOnly={readOnly}
        />
        <label>
          {label}
          {required ? '*' : ''}
        </label>
        {isPassword ? (
          <div onClick={handleClick} className="icon">
            {!toggle && (
              <FontAwesomeIcon
                icon={faEye}
                style={{ width: '24px', height: '24px', fontSize: '20px' }}
              />
            )}
            {toggle && (
              <FontAwesomeIcon
                icon={faEyeSlash}
                style={{ width: '24px', height: '24px', fontSize: '20px' }}
              />
            )}
          </div>
        ) : null}
      </div>
      {error && (
        <div>
          <div>
            <p className={style.error}>{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormInput;
