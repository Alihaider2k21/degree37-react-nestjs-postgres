import React from 'react';
import styles from './FormToggle.module.scss';

export default function FormToggle({
  name,
  displayName,
  checked = false,
  classes = {},
  error = '',
  handleChange = (e) => {},
}) {
  const { root = '', input = '', checkboxfield = '' } = classes;
  const inputRef = React.useRef(checked);

  return (
    <div className={`form-field checkbox ${checkboxfield} ${root}`}>
      <div className="d-flex">
        <span className={styles.toggleText}>{displayName}</span>
        <div
          className={styles.container}
          onClick={() => inputRef.current.click()}
        >
          <label htmlFor={`${name}-id`} className={styles.toggleLabel}>
            <input
              ref={inputRef}
              id={`${name}-id`}
              type="checkbox"
              name={name}
              checked={checked}
              className={`${styles.toggleInput} ${input}`}
              onClick={handleChange}
            />
            <span className={styles.toggleSlider}></span>
          </label>
        </div>
      </div>
      {error && (
        <div className="error">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
