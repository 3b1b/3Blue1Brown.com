import { CaretUpIcon } from "@phosphor-icons/react";
import { useWindowScroll } from "@reactuses/core";
import Button from "~/components/Button";

// small controls that hover in corner of screen
export default function ViewCorner() {
  const { y } = useWindowScroll();

  return (
    <div className="fixed right-0 bottom-0 z-100 flex flex-col gap-4">
      {y > 500 && (
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Jump to top"
        >
          <CaretUpIcon />
        </Button>
      )}
    </div>
  );
}
