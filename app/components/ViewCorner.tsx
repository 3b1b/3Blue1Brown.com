import Feedback from "~/components/Feedback";
import Jump from "~/components/Jump";
import Share from "~/components/Share";

// small controls that hover in corner of screen
export default function ViewCorner() {
  return (
    <div className="fixed right-0 bottom-0 z-20 flex flex-col mix-blend-difference transition **:text-[white] max-md:**:text-sm print:hidden">
      <Jump />
      <Share />
      <Feedback />
    </div>
  );
}
