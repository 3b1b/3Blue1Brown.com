import type { ReactNode } from "react";
import { isValidElement } from "react";
import { href } from "react-router";
import { BookOpenTextIcon, PlayIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import Button from "~/components/Button";
import Tooltip from "~/components/Tooltip";
import { getLesson } from "~/pages/lessons/lessons";

type Props = {
  id: string;
  compact?: boolean;
  children: ReactNode;
  className?: string;
};

// link to a lesson, with hover preview
export default function LessonLink({
  id,
  compact = false,
  children,
  className,
}: Props) {
  const lesson = getLesson(id)?.frontmatter;

  if (!lesson) return children;

  const { title = "", description = "" } = lesson;

  // if just text, wrap in button to ensure accessibility
  if (!isValidElement(children))
    children = (
      <button className={clsx("font-serif underline", className)}>
        {children}
      </button>
    );

  return (
    <>
      <Tooltip trigger={children}>
        <div className="flex flex-col gap-2">
          <strong>{title}</strong>
          <div className="text-gray">{description}</div>

          {!compact && (
            <>
              <Button
                to={{
                  pathname: href("/"),
                  search: `?lesson=${id}`,
                }}
                color="light"
                size="sm"
              >
                <PlayIcon />
                Watch
              </Button>
              <Button to={href("/lessons/:id", { id })} color="light" size="sm">
                <BookOpenTextIcon />
                Read
              </Button>
            </>
          )}
        </div>
      </Tooltip>
    </>
  );
}
