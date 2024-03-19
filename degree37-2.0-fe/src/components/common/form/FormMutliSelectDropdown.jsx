import { startCase } from 'lodash';
import React from 'react';

const FormMultiSelectDropdown = (props) => {
  const {
    options,
    selected,
    onClick,
    placeholder,
    name,
    setErrors,
    errors,
    style = '',
  } = props;
  const calculateTotalQuantity = () => {
    let totalQuantity = 0;
    totalQuantity = selected.length ? selected.length : 0;
    return totalQuantity;
  };

  const handleOnBlur = async (key) => {
    const index = 'multiSelect';
    if (selected.length === 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [index]: `${startCase(key)} is required`,
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [index]: '',
      }));
    }
  };

  return (
    <div className={`form-field selectTags ${style}`}>
      <div className="dropdown">
        {selected.length ? (
          <label
            style={{
              fontSize: '12px',
              top: '24%',
              color: '#555555',
              zIndex: 1,
            }}
          >
            {placeholder}
          </label>
        ) : (
          ''
        )}

        <button
          className="btn btn-secondary dropdown-toggle"
          type="button"
          onChange={() => handleOnBlur(name)}
          onClick={() => handleOnBlur(name)}
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {
            <>
              {selected?.length === 0 ? (
                <span className="span-first-child">{placeholder}</span>
              ) : (
                selected?.slice(0, 2).map((names, key) => (
                  <span key={key}>
                    {key === 0 ? '' : ', '}
                    {names}{' '}
                  </span>
                ))
              )}
              {selected.length === 0 ? (
                ''
              ) : (
                <span className="total"> {calculateTotalQuantity()} </span>
              )}
            </>
          }
        </button>
        <ul
          className="dropdown-menu overflow-y-scroll"
          style={{ maxHeight: '150px' }}
        >
          {options?.map((data) => (
            <li
              className="dropdown-item"
              key={data?.id}
              onClick={(e) => {
                onClick(
                  data,
                  selected?.some((item) => item === data.name) ? false : true
                );
                e.stopPropagation();
              }}
            >
              <div className="form-field checkbox w-100">
                <input
                  className={`form-check-input`}
                  type="checkbox"
                  value={data.id}
                  name={data.name}
                  id={`flexCheckDefault${parseInt(data?.id)}`}
                  onBlur={() => handleOnBlur(name)}
                  checked={selected?.some((item) => item === data.name)}
                  onClick={(e) => {
                    onClick(data, e.target.checked);
                  }}
                />
                <label
                  className="form-check-label"
                  htmlFor={`flexCheckDefault${parseInt(data?.id)}`}
                >
                  {data.name}
                </label>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {errors.multiSelect && (
        <div className="error">
          <p>{errors.multiSelect}</p>
        </div>
      )}
    </div>
  );
};

export default FormMultiSelectDropdown;
