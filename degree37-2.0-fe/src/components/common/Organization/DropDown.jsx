import React from 'react';
import styles from './Dropdown.module.scss';
import DropdownArrow from '../../../assets/images/dropdown-arrow.svg';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const OrganizationalDropDown = ({ value, handleClick, handleClear }) => {
  return (
    <div className={styles.dropdown}>
      <input
        type="text"
        placeholder="Organizational Level"
        value={value ? 'Organizational Level' : ''}
        onClick={handleClick}
      />
      {value && (
        <span className={styles.clear} onClick={handleClear}>
          <FontAwesomeIcon icon={faTimes} />
        </span>
      )}
      <img
        className="cursor-pointer"
        src={DropdownArrow}
        alt="arrow"
        onClick={handleClick}
      />
    </div>
  );
};

export default OrganizationalDropDown;
