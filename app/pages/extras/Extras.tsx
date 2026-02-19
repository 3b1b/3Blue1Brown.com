import Meta from "~/components/Meta";
import StrokeType from "~/components/StrokeType";
import Blog from "~/pages/extras/Blog";
import OtherWork from "~/pages/extras/OtherWork";

export default function Extras() {
  return (
    <>
      <Meta title="Extras" />

      <section className="bg-theme/10">
        <h1>
          <StrokeType>Extras</StrokeType>
        </h1>
      </section>

      <OtherWork />
      <Blog />
    </>
  );
}
