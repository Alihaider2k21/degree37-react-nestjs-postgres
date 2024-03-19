import React from 'react';
import styles from './index.module.scss';
import { useMask } from '@react-input/mask';

/**
 * This common component is used to create a input in form.
 * feel free to enhance it according to your needs.
 *
 * @param {string} name is use as input name
 * @param {string} displayName is use as input label
 * @param {string} type is use as input type
 * @param {string} value is use as input value
 * @param {string, string} classes is a object which contains root and text className
 * @param {boolean} required is use to tell whether the input should be required or not
 * @param {string} error is use display error if provided
 * @param {function} handleChange is use handle the change in the input
 * @param {function} handleBlur is use handle the blur effect in the input
 * @param {React.ReactElement} icon is use to add icon on input
 * @returns {React.JSX.Element}
 */
export default function FormInput({
  name,
  displayName,
  type = 'text',
  variant = '',
  value = '',
  classes = {},
  required = true,
  disabled = false,
  error,
  handleChange = (e) => {},
  handleBlur = (e) => {},
  icon = null,
  ...otherProps
}) {
  const inputPhoneMaskRef = useMask({
    mask: '(___) ___-____',
    replacement: { _: /\d/ },
  });
  const { root = '', text = '', label = '', icon: iconStyle = '' } = classes;
  return (
    <div className={`form-field ${root}`}>
      <div className={`${styles.field} ${disabled ? styles.disabledItem : ''}`}>
        <input
          disabled={disabled}
          type={type}
          className={`form-control ${text}`}
          value={value}
          name={name}
          placeholder={otherProps.placeholder || ' '}
          onChange={handleChange}
          onBlur={handleBlur}
          required={required}
          ref={variant === 'phone' ? inputPhoneMaskRef : null}
          {...otherProps}
        />
        <label
          className={label}
          style={!value ? { top: '50%' } : { top: '25%' }}
        >
          {displayName}
          {required && '*'}
        </label>
        {icon && (
          <span className={`${styles.fieldIcon} ${iconStyle}`}>{icon}</span>
        )}
      </div>
      {error && (
        <div className="error">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
