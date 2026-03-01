import type { Article } from "schema-dts";
import type { Route } from "./+types/Lesson";
import {
  BracketsCurlyIcon,
  CalendarBlankIcon,
  UserIcon,
} from "@phosphor-icons/react";
import { find } from "lodash-es";
import Footer from "~/components/Footer";
import Header from "~/components/Header";
import { H1 } from "~/components/Heading";
import Link from "~/components/Link";
import Meta from "~/components/Meta";
import StrokeType from "~/components/StrokeType";
import TableOfContents from "~/components/TableOfContents";
import YouTube from "~/components/YouTube";
import team from "~/data/team.json";
import { getLesson } from "~/pages/lessons/lessons";
import { formatDate } from "~/util/string";

// lesson page layout
export default function Lesson({ params: { id } }: Route.ComponentProps) {
  const lesson = getLesson(id);
  if (!lesson) return;

  const {
    // get component to render
    default: Component,
    // get frontmatter
    frontmatter: {
      title = "",
      date = new Date(),
      description = "",
      credits = ["Lesson by Grant Sanderson"],
      video = "",
      source = "",
    },
  } = lesson;

  return (
    <>
      <Header />

      <main id="content" className="[&>section]:odd:bg-off-white">
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
          }}
        />

        <section className="items-center gap-8 bg-theme/10!">
          <H1>
            <StrokeType>{title}</StrokeType>
          </H1>
          <div className="flex flex-col items-center gap-4">
            {description && <p className="text-lg">{description}</p>}
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-lg *:flex *:items-center *:gap-2 **:text-gray">
              {credits.map((credit, index) => {
                const [, role, name] = credit.match(/(.*) by (.*)/) ?? [];

                return (
                  <div key={index}>
                    <UserIcon />
                    {role} by{" "}
                    <Link to={find(team, { name })?.link ?? ""} arrow={false}>
                      {name}
                    </Link>
                  </div>
                );
              })}
              {date && (
                <div>
                  <CalendarBlankIcon />
                  {formatDate(date)}
                </div>
              )}
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
          {video && <YouTube id={video} />}
        </section>

        <TableOfContents />

        <Component />
      </main>
      <Footer />
    </>
  );
}
