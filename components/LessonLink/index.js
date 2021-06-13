import Link from "next/link";
import Tooltip from "../Tooltip";
import LessonCard from "../LessonCard";

const LessonLink = ({ id, children }) => (
  <Link href={`/lessons/${id}`} passHref>
    <Tooltip content={<LessonCard id={id} />}>
      <a>{children}</a>
    </Tooltip>
  </Link>
);

export default LessonLink;
