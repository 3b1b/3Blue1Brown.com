import {
  BookOpenTextIcon,
  CalendarBlankIcon,
  InfoIcon,
  ShareNetworkIcon,
} from "@phosphor-icons/react";
import { useAtomValue } from "jotai";
import Button from "~/components/Button";
import Heading from "~/components/Heading";
import Youtube from "~/components/Youtube";
import { getLatest, getLesson } from "~/data/lessons";
import { lessonAtom } from "~/pages/home/Explore";
import { useRouteExists } from "~/routes";
import { formatDate } from "~/util/string";
import { share } from "~/util/url";

export default function Theater() {
  // current lesson details
  const lesson = getLesson(useAtomValue(lessonAtom)).lesson ?? getLatest();

  // link to readable lesson
  const readLink = lesson ? `/lessons/${lesson.id}` : "";

  // does readable lesson exist
  const readExists = useRouteExists(readLink);

  return (
    <section className="narrow">
      <Heading level={1} className="sr-only">
        Home
      </Heading>
      <Heading level={2} className="sr-only">
        Theater
      </Heading>
      <div className="flex flex-col gap-4">
        <Youtube
          id={lesson?.video ?? ""}
          className="aspect-video w-full self-center shadow-xl shadow-theme/50"
        />

        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="font-sans text-lg">{lesson?.title}</div>
          <Button size="small" onClick={share}>
            <ShareNetworkIcon />
            Share
          </Button>
          {readExists && (
            <Button size="small" to={readLink}>
              <BookOpenTextIcon />
              Read
            </Button>
          )}
          <Button
            size="small"
            expanded={
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2">
                  <CalendarBlankIcon />
                  {formatDate(lesson?.date)}
                </div>
                <p>{lesson?.description}</p>
              </div>
            }
          >
            <InfoIcon />
            Details
          </Button>
        </div>
      </div>
    </section>
  );
}
