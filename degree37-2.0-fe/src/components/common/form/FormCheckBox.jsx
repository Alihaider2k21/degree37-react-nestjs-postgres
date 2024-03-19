import React from 'react';
import styles from './FormCheckbox.module.scss';

/**
 * This common component is used to create a input in form.
 * feel free to enhance it according to your needs.
 *
 * @param {string} name is use as input name
 * @param {string} displayName is use as input label
 * @param {string} value is use as input value
 * @param {string, string} classes is a object which contains root and text className
 * @param {boolean} required is use to tell whether the input should be required or not
 * @param {string} error is use display error if provided
 * @param {function} handleChange is use handle the change in the input
 * @param {function} handleBlur is use handle the blur effect in the input
 * @returns {React.JSX.Element}
 */
export default function FormCheckbox({
  name,
  displayName,
  value = '',
  checked = false,
  classes = {},
  error = '',
  handleChange = (e) => {},
  handleBlur = (e) => {},
  required = false,
  labelClass = '',
  ...otherProps
}) {
  const { root = '', text = '', checkboxfield = '' } = classes;

  return (
    <div
      className={`form-field checkbox ${checkboxfield} ${styles.container} ${root}`}
    >
      <div className="field">
        <input
          type="checkbox"
          className={`form-check-input p-0 ${text}`}
          style={{ width: '20px', height: '20px' }}
          value={value}
          checked={checked}
          name={name}
          onChange={handleChange}
          onBlur={handleBlur}
          required={required}
          {...otherProps}
        />
        <label className={labelClass}>{displayName}</label>
      </div>
      {error && (
        <div className="error">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
