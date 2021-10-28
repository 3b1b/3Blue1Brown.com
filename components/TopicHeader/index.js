import PropTypes from "prop-types";
import Section from "../Section";
import styles from "./index.module.scss";
import { transformSrc } from "../../util/transformSrc";

TopicHeader.propTypes = {
  topic: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
  }),
};

export default function TopicHeader({ topic }) {
  return (
    <Section width="narrow" dark={true} style={{ background: "black" }}>
      <div className={styles.imageWrapper}>
        <img
          className={styles.image}
          src={transformSrc(`/images/topics/${topic.slug}.jpg`)}
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
