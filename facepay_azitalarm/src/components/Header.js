import React from 'react';
import styles from '../css/Header.module.css';
import { Link } from 'react-router-dom';

function Header(props) {
  return (
    <div>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Link to="/" className={styles.headerLink}><span className={styles.payColor}>FACE</span>PAY</Link>
        </div>
        <hr />
        <div className={styles.headerRight}>
          얼굴결제
        </div>
      </div>
    </div>
  );
}

export default Header;