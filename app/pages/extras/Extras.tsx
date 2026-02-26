import { H1 } from "~/components/Heading";
import Meta from "~/components/Meta";
import StrokeType from "~/components/StrokeType";
import Other from "~/pages/extras/Other";
import Podcast from "~/pages/extras/Podcast";
import Blog from "~/pages/extras/Posts";

export default function Extras() {
  return (
    <>
      <Meta title="Extras" />

      <section className="bg-theme/10">
        <H1>
          <StrokeType>Extras</StrokeType>
        </H1>
      </section>

      <Other />
      <Podcast />
      <Blog />
    </>
  );
}
