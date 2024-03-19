import React from 'react';

const FilterTab = ({ dropdownItems }) => {
  return (
    <div className="filter">
      {dropdownItems.map((dropdown, index) => (
        <div className="dropdown" key={index}>
          <button
            className="dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {dropdown.statusText}
          </button>
          <ul className="dropdown-menu">
            {dropdown.options.map((option, optionIndex) => (
              <li key={optionIndex}>
                <a
                  onClick={option.handler}
                  name={option.value}
                  className="dropdown-item"
                  href="#"
                >
                  {option.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default FilterTab;
