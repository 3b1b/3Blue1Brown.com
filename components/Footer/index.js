import SocialIcons from "../SocialIcons";
import styles from "./index.module.scss";

// footer component to show at bottom of every page
const Footer = () => (
  <footer className={styles.footer}>
    <Copyright />
    <SocialIcons />
  </footer>
);

export default Footer;

// left copyright col
const Copyright = () => (
  <div className={styles.copyright}>
    &copy; {new Date().getFullYear()} Grant Sanderson
  </div>
);
