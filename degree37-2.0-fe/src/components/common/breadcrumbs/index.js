import React from 'react';
import styles from './index.module.scss';
import SvgComponent from '../../common/SvgComponent';
import { Link } from 'react-router-dom';
export default function BreadCrumbs(props) {
  const { data, title } = props;

  return (
    <div className={styles.breadcrumbs}>
      <h1>{title}</h1>
      <div className={styles.breadcrumbsLabels}>
        {data?.map((e, i) => {
          const isLastElement = i === data.length - 1;
          return (
            <span key={i}>
              <Link key={i} to={`${e.link}`}>
                <span className={`text ${e.class}`}>{e.label}</span>
              </Link>
              {!isLastElement && (
                <span className="icon">
                  <SvgComponent name={'RightChevron'} />
                </span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}
