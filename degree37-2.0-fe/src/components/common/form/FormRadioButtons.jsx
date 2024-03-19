import React from 'react';

const FormRadioButtons = (props) => {
  const {
    selected,
    label,
    value,
    name,
    handleChange = (e) => {},
    colorfull,
    className,
    disabled = false,
  } = props;

  return (
    <div className={`form-field checkbox cc ${className}`}>
      <input
        type="radio"
        name={name}
        className="form-check-input"
        value={value}
        checked={selected === value}
        required
        onChange={handleChange}
        disabled={disabled}
      />
      <label className="form-check-label" htmlFor={name}>
        {colorfull ? (
          <span className={`badge ${label.toLowerCase()}`}> {label} </span>
        ) : (
          <span>{label}</span>
        )}
      </label>
    </div>
  );
};

export default FormRadioButtons;
