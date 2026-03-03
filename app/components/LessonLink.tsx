import type { ReactNode } from "react";
import { href } from "react-router";
import { ArrowRightIcon } from "@phosphor-icons/react";
import Button from "~/components/Button";
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
    <>
      <Tooltip
        trigger={<button className="font-serif underline">{children}</button>}
      >
        <div className="flex flex-col gap-2">
          <strong>{title}</strong>
          <div className="text-gray">{description}</div>
          <Button
            to={href("/lessons/:id", { id })}
            size="sm"
            className="flex items-center justify-center gap-1"
          >
            View Lesson
            <ArrowRightIcon />
          </Button>
        </div>
      </Tooltip>
    </>
  );
}
