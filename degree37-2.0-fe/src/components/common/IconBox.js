import React from 'react';
import SvgComponent from '../common/SvgComponent';
import styles from '../../styles/Common/IconBoxes.module.scss';
import { Link } from 'react-router-dom';

const IconBox = ({ iconName, boxName, link }) => {
  return (
    <div className={styles.iconBox}>
      <Link to={link}>
        <div className={styles.icon}>
          <SvgComponent name={iconName} />
        </div>
        <span className={styles.text}>{boxName}</span>
      </Link>
    </div>
  );
};

export default IconBox;
