import { CaretUpIcon } from "@phosphor-icons/react";
import { useWindowScroll } from "@reactuses/core";
import Button from "~/components/Button";

// jump to top of screen
export default function Jump() {
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
