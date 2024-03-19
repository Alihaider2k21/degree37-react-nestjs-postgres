import React from 'react';
import styles from './index.module.scss';

const Loader = () => {
  return (
    <div className={styles.contentLoader}>
      <p className={styles.textFadeInOut}>Loading...</p>
    </div>
  );
};

export default Loader;
