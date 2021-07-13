import { useContext } from "react";
import Link from "next/link";
import Chip from "../Chip";
import Section from "../Section";
import { formatDate } from "../../util/locale";
import styles from "./index.module.scss";
import creditsInfo from "../../data/credits.yaml";
import { PageContext } from "../../pages/_app";

// details to show at the top of a lesson, with icons and text
const LessonDetails = () => (
  <Section width="narrow">
    <Title />
    <div className={styles.metadata}>
      <Published />
      <LastMod />
      <br />
      <Credits />
      <Tags />
      <Source />
    </div>
  </Section>
);

export default LessonDetails;

// lesson title
const Title = () => {
  const { title, chapter } = useContext(PageContext);
  return (
    <h1 id="title">
      {chapter !== undefined && <Chip text={`Chapter ${chapter}`} />}
      {title}
    </h1>
  );
};

// date when lesson was first "published" (youtube video publish date)
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

// when lesson markdown file was last modified
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

// list of credits for lesson
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

// list of tags for lesson
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

// link to lesson source code on github
const Source = () => {
  const { sourceCode } = useContext(PageContext);
  return (
    <>
      {sourceCode && (
        <div>
          <i className="fab fa-github" />
          <span>
            <a
              href={`https://github.com/3b1b/videos/tree/master/${sourceCode}`}
            >
              Source Code
            </a>
          </span>
        </div>
      )}
    </>
  );
};
