import { Children, useState } from "react";
import Clickable from "../Clickable";
import SocialIcons from "../SocialIcons";
import Link from "next/link";
import styles from "./index.module.scss";

export default function HomepageFeaturedContent({ title, children }) {
  return (
    <div className={styles.container}>
      <div className={styles.title}>{title}</div>
      <div className={styles.featured}>
        <Carousel>{children}</Carousel>
      </div>
      <div className={styles.social}>
        <div>Want more math in your life?</div>
        <SocialIcons />
      </div>
    </div>
  );
}

export function HomepageFeaturedItem({ lesson, caption, children }) {
  return (
    <div>
      <div className={styles.itemButtons}>
        <Clickable
          link={`/lessons/${lesson}`}
          text="Watch"
          icon="fab fa-youtube"
        />
        <Clickable
          link={`/lessons/${lesson}#title`}
          text="Read"
          icon="far fa-newspaper"
        />
      </div>

      <figure className={styles.itemFigure}>
        {children}
        <figcaption className={styles.itemCaption}>
          <Link href={`/lessons/${lesson}`}>
            <a>{caption}</a>
          </Link>
        </figcaption>
      </figure>
    </div>
  );
}

function Carousel({ children }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slideCount = Children.count(children);

  return (
    <div className={styles.carousel}>
      <button
        className={styles.arrow}
        aria-label="Previous"
        onClick={() =>
          setCurrentIndex(
            currentIndex === 0 ? slideCount - 1 : currentIndex - 1
          )
        }
      >
        <i class="fas fa-caret-left" />
      </button>
      <div className={styles.slides}>
        {Children.map(children, (child, index) => {
          const translate = -100 * currentIndex;

          return (
            <div
              className={styles.slide}
              data-visible={index === currentIndex}
              style={{
                transform: `translateX(${translate}%)`,
              }}
            >
              {child}
            </div>
          );
        })}
      </div>
      <button
        className={styles.arrow}
        aria-label="Next"
        onClick={() =>
          setCurrentIndex(
            currentIndex === slideCount - 1 ? 0 : currentIndex + 1
          )
        }
      >
        <i class="fas fa-caret-right" />
      </button>
    </div>
  );
}
