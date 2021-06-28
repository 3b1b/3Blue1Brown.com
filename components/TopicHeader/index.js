import Section from "../Section";
import styles from "./index.module.scss";

export default function TopicHeader({ topic }) {
  return (
    <Section width="narrow" dark={true} style={{ background: "black" }}>
      <div className={styles.imageWrapper}>
        <img
          className={styles.image}
          src={`/images/topics/${topic.slug}.jpg`}
          alt=""
        />
      </div>

      <div className={styles.text}>
        <h1 id={topic.slug}>{topic.name}</h1>
        {topic.description && <div>{topic.description}</div>}
      </div>
    </Section>
  );
}
