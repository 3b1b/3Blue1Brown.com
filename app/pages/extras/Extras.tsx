import Meta from "~/components/Meta";
import StrokeType from "~/components/StrokeType";
import OtherWork from "~/pages/extras/OtherWork";
import Blog from "~/pages/extras/Posts";

export default function Extras() {
  return (
    <>
      <Meta title="Extras" />

      <section className="bg-theme/10">
        <h1>
          <StrokeType>Extras</StrokeType>
        </h1>

        <p className="self-center">
          Resources, podcasts, blog, collabs, courses, conversations, and other
          miscellany that don't fit elsewhere on the site.
        </p>
      </section>

      <OtherWork />
      <Blog />
    </>
  );
}
