import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FormInput = ({
  val,
  setVal,
  type,
  id,
  placeholder,
  iconClass,
  icon,
  labelText,
  addClass,
  required,
  autocomplete,
  formik = false,
}) => {
  const handleChange = (e) => {
    setVal(e.target.value);
  };
  return (
    <div className={`d-flex flex-row align-items-center mb-4 ${addClass}`}>
      <FontAwesomeIcon
        icon={icon}
        className={`fas fa-lg me-3 fa-fw ${iconClass}`}
      />
      <div className="form-outline flex-fill mb-0">
        <input
          type={type}
          id={id}
          className="form-control"
          placeholder={placeholder}
          value={val}
          onChange={formik ? setVal : handleChange}
          required={required}
          autoComplete={autocomplete}
        />
        {labelText && (
          <label htmlFor={id} className="formLabel">
            {labelText}
          </label>
        )}
      </div>
    </div>
  );
};

export default FormInput;
