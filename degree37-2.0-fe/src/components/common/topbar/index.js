import React from 'react';
import BreadCrumbs from '../breadcrumbs';
import styles from './index.module.scss';

const TopBar = ({
  BreadCrumbsData,
  BreadCrumbsTitle,
  SearchPlaceholder = null,
  SearchValue = null,
  SearchOnChange = null,
  className = '',
  icon = null,
}) => {
  return (BreadCrumbsData && BreadCrumbsData.length) ||
    (BreadCrumbsTitle && BreadCrumbsTitle.length) ? (
    <div className={`${className} ${styles.topRow}`}>
      <BreadCrumbs data={BreadCrumbsData} title={BreadCrumbsTitle} />
      {SearchValue !== null ||
      SearchOnChange !== null ||
      SearchPlaceholder !== null ? (
        <div className={styles.search}>
          <div className={styles.formItem}>
            <input
              type="text"
              placeholder={SearchPlaceholder}
              value={SearchValue}
              onChange={SearchOnChange}
            />
            {icon && <span className={styles.fieldIcon}>{icon}</span>}
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  ) : (
    <></>
  );
};

export default TopBar;
