import Link from "next/link";
import Chip from "../chip";
import Section from "../section";
import { formatDate } from "../../util/locale";
import styles from "./index.module.scss";
import creditsInfo from "../../data/credits.yaml";

const LessonDetails = (props) => (
  <Section>
    <Title {...props} />
    <div className={styles.lesson_details}>
      <Published {...props} />
      <LastMod {...props} />
      <Credits {...props} />
      <Tags {...props} />
    </div>
  </Section>
);

export default LessonDetails;

const Title = (props) => (
  <h1>
    {props.chapter && <Chip text={`Chapter ${props.chapter}`} />}
    {props.title}
  </h1>
);

const Published = (props) => (
  <>
    {props.date && (
      <div>
        <i className="far fa-calendar"></i>
        <span>Published {formatDate(props.date)}</span>
      </div>
    )}
  </>
);

const LastMod = (props) => (
  <>
    {props.lastMod && props.content.trim() && (
      <div>
        <i className="far fa-clock"></i>
        <span>Updated {formatDate(props.lastMod)}</span>
      </div>
    )}
  </>
);

const Credits = (props) => {
  // get list of credit names
  const names = creditsInfo.map((c) => c.name);
  // regex to split string by names
  const regex = new RegExp(`(${names.join("|")})`, "gi");

  // assemble list of credits with before text, name with link, and after text
  const credits = (props.credits || []).map((credit) => {
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

const Tags = (props) => (
  <>
    {(props.tags || []).map((tag, index) => (
      <div key={index}>
        <i className="fas fa-tag"></i>
        <span>{tag}</span>
      </div>
    ))}
  </>
);
