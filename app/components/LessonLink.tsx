import type { ReactNode } from "react";
import { isValidElement } from "react";
import { href } from "react-router";
import { BookOpenTextIcon, PlayIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import Button from "~/components/Button";
import Tooltip from "~/components/Tooltip";
import { getLesson } from "~/pages/lessons/lessons";

type Props = {
  // lesson id
  id: string;
  // class on button
  className?: string;
  // button content
  children: ReactNode;
};

// link to a lesson, with hover preview
export default function LessonLink({ id, className, children }: Props) {
  const lesson = getLesson(id)?.frontmatter;

  if (!lesson) return children;

  // get lesson details
  const { title = "", description = "", read } = lesson;

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
        <div className="flex flex-col gap-4">
          <strong>{title}</strong>
          <p className="text-gray">{description}</p>

          <div className="flex items-center gap-4 *:flex-1">
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
            {read && (
              <Button to={href("/lessons/:id", { id })} color="light" size="sm">
                <BookOpenTextIcon />
                Read
              </Button>
            )}
          </div>
        </div>
      </Tooltip>
    </>
  );
}
