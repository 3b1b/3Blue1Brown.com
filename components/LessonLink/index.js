import Link from "next/link";
import Tooltip from "../Tooltip";
import LessonCard from "../LessonCard";

// plain text link to another lesson from markdown, with tooltip preview
const LessonLink = ({ id, children }) => (
  <>
    {id && (
      <Link href={`/lessons/${id}`} passHref>
        <Tooltip content={<LessonCard id={id} mini={true} />}>
          <a>{children}</a>
        </Tooltip>
      </Link>
    )}
  </>
);

export default LessonLink;
