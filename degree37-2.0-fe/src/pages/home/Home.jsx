import React from 'react';
import styles from '../..//styles/Home.module.scss';
import Layout from '../../components/common/layout/index';

export default function Home() {
  return (
    <>
      <Layout>
        <div className={styles.center}>
          <code className={styles.code}>Degree37 Admin Portal</code>
        </div>
      </Layout>
    </>
  );
}
