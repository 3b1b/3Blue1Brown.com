import type { ReactNode } from "react";
import { href } from "react-router";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import Link from "~/components/Link";
import Tooltip from "~/components/Tooltip";
import { getLesson } from "~/pages/lessons/lessons";

type Props = {
  id: string;
  children: ReactNode;
};

// link to a lesson, with hover preview
export default function LessonLink({ id, children }: Props) {
  const lesson = getLesson(id)?.frontmatter;

  if (!lesson) return children;

  const { title = "", description = "" } = lesson;

  return (
    <Tooltip
      trigger={
        <Link to={href("/lessons/:id", { id })}>
          <MagnifyingGlassIcon />
          {children}
        </Link>
      }
    >
      <div className="flex flex-col gap-1">
        <strong>{title}</strong>
        <div className="text-gray">{description}</div>
      </div>
    </Tooltip>
  );
}
