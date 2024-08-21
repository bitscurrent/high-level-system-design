
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
        <a href="/" className={styles.navItem}>
          <i className={`${styles.navIcon} fas fa-home`}></i> Home
        </a>
        <a href="/upload" className={styles.navItem}>
          <i className={`${styles.navIcon} fas fa-fire`}></i> Upload
        </a>
       
        
      </nav>
    </header>
  );
}

export default Header;
