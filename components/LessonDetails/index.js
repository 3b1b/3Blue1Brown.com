import { useContext } from "react";
import Link from "next/link";
import Chip from "../Chip";
import Section from "../Section";
import { formatDate } from "../../util/locale";
import styles from "./index.module.scss";
import creditsInfo from "../../data/credits.yaml";
import { PageContext } from "../../pages/_app";

const LessonDetails = () => (
  <Section>
    <Title />
    <div className={styles.lesson_details}>
      <Published />
      <LastMod />
      <Credits />
      <Tags />
    </div>
  </Section>
);

export default LessonDetails;

const Title = () => {
  const { title, chapter } = useContext(PageContext);
  return (
    <h1>
      {chapter && <Chip text={`Chapter ${chapter}`} />}
      {title}
    </h1>
  );
};

const Published = () => {
  const { date } = useContext(PageContext);
  return (
    <>
      {date && (
        <div>
          <i className="far fa-calendar"></i>
          <span>Published {formatDate(date)}</span>
        </div>
      )}
    </>
  );
};

const LastMod = () => {
  const { lastMod, empty } = useContext(PageContext);
  return (
    <>
      {lastMod && !empty && (
        <div>
          <i className="far fa-clock"></i>
          <span>Updated {formatDate(lastMod)}</span>
        </div>
      )}
    </>
  );
};

const Credits = () => {
  let { credits = [] } = useContext(PageContext);

  // get list of credit names
  const names = creditsInfo.map((c) => c.name);
  // regex to split string by names
  const regex = new RegExp(`(${names.join("|")})`, "gi");

  // assemble list of credits with before text, name with link, and after text
  credits = credits.map((credit) => {
    const [before = "", name = "", after = ""] = credit.split(regex);
    const link = creditsInfo.find((info) => info.name === name)?.link || "";
    return { before, name, link, after };
  });

  return (
    <>
      {credits.map(({ before, name, link, after }, index) => {
        return (
          <div key={index}>
            <i className="fas fa-feather-alt"></i>
            <span>
              {before}
              {name && (
                <Link href={link}>
                  <a>{name}</a>
                </Link>
              )}
              {after && after}
            </span>
          </div>
        );
      })}
    </>
  );
};

const Tags = () => {
  const { tags } = useContext(PageContext);
  return (
    <>
      {(tags || []).map((tag, index) => (
        <div key={index}>
          <i className="fas fa-tag"></i>
          <span>{tag}</span>
        </div>
      ))}
    </>
  );
};
