
import styles from './Header.module.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <i className={`${styles.logoIcon} fas fa-youtube`}></i>
        <h1 className={styles.logoText}>MyTube</h1>
      </div>
      <nav className={styles.nav}>
        <a href="/home" className={styles.navItem}>
          <i className={`${styles.navIcon} fas fa-home`}></i> Home
        </a>
        <a href="/videoplayer" className={styles.navItem}>
          <i className={`${styles.navIcon} fa-solid fa-play`}></i> VideoPlayer
        </a>
        <a href="/upload" className={styles.navItem}>
          <i className={`${styles.navIcon} fa-solid fa-upload`}></i> Upload
        </a>
      </nav>
    </header>
  );
}

export default Header;
