import SocialIcons from "../SocialIcons";
import styles from "./index.module.scss";

export default function HomePageTitle({ title = "Animated math" }) {
  return (
    <div className={styles.container}>
      <div className={styles.title}>{title}</div>
      <div className={styles.social}>
        <SocialIcons />
      </div>
    </div>
  );
}