import type { Article } from "schema-dts";
import type { Lesson } from "~/pages/lessons/lessons";
import type { Route } from "./+types/Lesson";
import { use } from "react";
import { href } from "react-router";
import { Fragment } from "react/jsx-runtime";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BracketsCurlyIcon,
  CalendarBlankIcon,
  UserIcon,
} from "@phosphor-icons/react";
import { find } from "lodash-es";
import Button from "~/components/Button";
import Card from "~/components/Card";
import Footer from "~/components/Footer";
import Header from "~/components/Header";
import { H1, H2 } from "~/components/Heading";
import Image from "~/components/Image";
import Link from "~/components/Link";
import Main from "~/components/Main";
import Meta from "~/components/Meta";
import ShowPartial from "~/components/ShowPartial";
import StrokeType from "~/components/StrokeType";
import TableOfContents from "~/components/TableOfContents";
import YouTube from "~/components/YouTube";
import team from "~/data/team.json";
import { getPatrons, transformLesson } from "~/pages/lessons/lessons";
import {
  getNextByTopic,
  getPreviousByTopic,
  getTopic,
} from "~/pages/lessons/topics";
import NotFound from "~/pages/NotFound";
import { importAssetsAsync } from "~/util/import";
import { formatDate } from "~/util/string";

// lazy load full lesson (frontmatter + mdx content)
const getFullLesson = importAssetsAsync(
  import.meta.glob<Lesson>("./20\\d\\d/**/index.mdx"),
  "index",
  transformLesson,
);

// lesson page layout
export default function Lesson({ params: { id } }: Route.ComponentProps) {
  const lesson = use(getFullLesson(id));

  if (!lesson) return <NotFound />;

  const {
    // get component to render
    default: Component,
    // get frontmatter
    frontmatter: {
      title = "",
      date = new Date(),
      description = "",
      credits = ["Lesson by Grant Sanderson"],
      combinedCredits = { Lesson: ["Grant Sanderson"] } as Record<
        string,
        string[]
      >,
      video = "",
      source = "",
      chapter = -1,
      image = "",
      read = true,
    },
  } = lesson;

  // load patrons
  const patrons = getPatrons(id) ?? [];

  // load topic
  const topic = getTopic(id);

  // load previous/next lessons in topic
  const previous = getPreviousByTopic(id)?.frontmatter;
  const next = getNextByTopic(id)?.frontmatter;

  return (
    <>
      <Meta<Article>
        title={title}
        description={description}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: title,
          description,
          author: credits,
          datePublished: date.toISOString(),
          articleSection: chapter !== -1 ? `Chapter ${chapter}` : undefined,
        }}
      />

      <Header />

      <Main striped>
        {/* lesson header */}
        <section className="items-center bg-theme/10! width-lg">
          {/* topic */}
          {topic && (
            <Button
              to={{ pathname: "/", search: `?topic=${topic.id}` }}
              className="top-4 left-4 self-center md:absolute"
            >
              <ArrowLeftIcon />
              {topic.title}
            </Button>
          )}

          {/* chapter */}
          {chapter !== -1 && (
            <div className="-my-4 flex items-center gap-2 text-lg">
              Chapter {chapter}
            </div>
          )}

          {/* title */}
          <H1>
            <StrokeType>{title}</StrokeType>
          </H1>

          <div className="grid grid-cols-2 gap-12 max-md:grid-cols-1 max-md:gap-8">
            {/* embed */}
            {video ? <YouTube id={video} /> : <Image image={image} />}

            {/* details */}
            <div className="flex flex-col items-start justify-start gap-8">
              {description && <p className="text-lg">{description}</p>}
              <div className="flex flex-col flex-wrap gap-x-8 gap-y-4 text-lg *:flex *:items-center *:gap-2 **:text-gray max-md:flex-row">
                {/* date */}
                {date && (
                  <div>
                    <CalendarBlankIcon />
                    {formatDate(date)}
                  </div>
                )}

                {/* credits */}
                {Object.entries(combinedCredits).map(([role, names], index) => (
                  <div key={index}>
                    <UserIcon />
                    {role} by{" "}
                    {names.map((name, index) => (
                      <Fragment key={index}>
                        <Link
                          to={find(team, { name })?.link ?? ""}
                          arrow={false}
                        >
                          {name}
                        </Link>
                        {index < names.length - 1 ? " &" : ""}
                      </Fragment>
                    ))}
                  </div>
                ))}

                {/* source */}
                {source && (
                  <div>
                    <BracketsCurlyIcon />
                    <Link
                      to={`https://github.com/3b1b/videos/blob/master/${source}`}
                      arrow={false}
                    >
                      Source
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* toc */}
        {read && <TableOfContents />}

        {/* lesson content */}
        <Component />

        {/* nav */}
        {(!!previous || !!next) && (
          <section className="grid grid-cols-3 gap-8 max-sm:grid-cols-1">
            {/* previous */}
            {!!previous ? (
              <Card
                to={href("/lessons/:id", { id: previous.id })}
                image={previous.image}
                title={
                  <>
                    <ArrowLeftIcon />
                    Previous Lesson
                  </>
                }
                description={previous.title}
              />
            ) : (
              <div />
            )}

            <div />

            {/* next */}
            {!!next ? (
              <Card
                to={href("/lessons/:id", { id: next?.id })}
                image={next.image}
                title={
                  <>
                    Next Lesson
                    <ArrowRightIcon />
                  </>
                }
                description={next.title}
              />
            ) : (
              <div />
            )}
          </section>
        )}

        {/* thank you */}
        {!!patrons.length && (
          <section className="bg-secondary/10!">
            <H2>
              <hr />
              Thanks
              <hr />
            </H2>

            <p className="text-center text-balance">
              Special thanks to those below for supporting this lesson.
            </p>

            <ShowPartial>
              <div className="grid max-w-max grid-cols-4 gap-4 self-center max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
                {patrons.map((patron, index) => (
                  <div key={index}>{patron}</div>
                ))}
              </div>
            </ShowPartial>
          </section>
        )}
      </Main>

      <Footer />
    </>
  );
}
