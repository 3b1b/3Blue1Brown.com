import { CaretUpIcon } from "@phosphor-icons/react";
import { useWindowScroll } from "@reactuses/core";
import Button from "~/components/Button";
import Feedback from "~/components/Feedback";

// small controls that hover in corner of screen
export default function ViewCorner() {
  return (
    <div className="fixed right-2 bottom-2 z-30 flex flex-col gap-2 mix-blend-difference [&_button]:text-white!">
      <Jump />
      <Feedback />
    </div>
  );
}

function Jump() {
  const { y } = useWindowScroll();

  if (y <= 500) return null;

  return (
    <Button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Jump to top"
    >
      <CaretUpIcon />
    </Button>
  );
}
