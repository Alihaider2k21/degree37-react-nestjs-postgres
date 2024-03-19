import React from 'react';
import styles from './index.module.scss';

/**
 * This common component is used to create a textarea in form.
 * feel free to enhance it according to your needs.
 *
 * @param {string} name is use as textarea name
 * @param {string} displayName is use as textarea label
 * @param {string} type is use as textarea type
 * @param {string} value is use as textarea value
 * @param {string, string} classes is a object which contains root and text className
 * @param {boolean} required is use to tell whether the textarea should be required or not
 * @param {string} error is use display error if provided
 * @param {function} handleChange is use handle the change in the textarea
 * @param {function} handleBlur is use handle the blur effect in the textarea
 * @returns {React.JSX.Element}
 */
export default function FormText({
  name,
  displayName,
  value = '',
  classes = {},
  required = true,
  error = '',
  handleChange = (e) => {},
  handleBlur = (e) => {},
  icon = null,
  ...otherProps
}) {
  const { root = '', text = '', label = '' } = classes;
  return (
    <div className={`form-field textarea-new ${root}`}>
      <div className={`${styles.field}`}>
        <textarea
          className={`form-control textarea ${text}`}
          value={value}
          name={name}
          placeholder={otherProps.placeholder || ' '}
          onChange={handleChange}
          onBlur={handleBlur}
          required={required}
          {...otherProps}
        />
        <label className={`bg-white ${label}`}>
          {displayName}
          {required && '*'}
        </label>
        {icon && <span className={styles.fieldIcon}>{icon}</span>}
      </div>
      {error && (
        <div className="error">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
