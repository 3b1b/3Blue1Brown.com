import Feedback from "~/components/Feedback";
import Jump from "~/components/Jump";
import Share from "~/components/Share";

// small controls that hover in corner of screen
export default function ViewCorner() {
  return (
    <div className="fixed right-2 bottom-2 z-30 flex flex-col gap-2 mix-blend-difference [&_button]:text-[white]!">
      <Jump />
      <Share />
      <Feedback />
    </div>
  );
}
