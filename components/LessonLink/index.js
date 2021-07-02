import PropTypes from "prop-types";
import Link from "next/link";
import Tooltip from "../Tooltip";
import LessonCard from "../LessonCard";

LessonLink.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

// plain text link to another lesson from markdown, with tooltip preview
export default function LessonLink({ id = "", children }) {
  const tooltip = <LessonCard id={id} mini={true} />;

  return (
    <Link href={id ? `/lessons/${id}` : ""} passHref>
      <Tooltip content={tooltip}>
        <a>{children}</a>
      </Tooltip>
    </Link>
  );
}
