import type { ReactNode } from "react";
import { useRef, useState } from "react";
import Button from "~/components/Button";
import Markdownify from "~/components/Markdownify";
import Textbox from "~/components/Textbox";
import { useInView } from "~/util/hooks";
import { sleep } from "~/util/misc";

type Props = {
  question?: ReactNode;
  children: ReactNode;
};

// pause and ponder
export default function FreeResponse({ question, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const [state, setState] = useState<"disabled" | "unrevealed" | "revealed">(
    "disabled",
  );

  // is element in view
  const inView = useInView(ref);

  // when question in view, wait a few secs before allowing reveal
  if (inView && state === "disabled")
    sleep(1000 * 5).then(() => setState("unrevealed"));

  return (
    <>
      {question && <Markdownify noParagraph>{question}</Markdownify>}
      <div ref={ref} className="flex flex-wrap gap-4">
        <Textbox
          multi
          rows={2}
          placeholder="Pause and ponder for a few moments. Use this box as a notepad for ideas."
          className="grow"
        />
        <Button
          color="light"
          size="sm"
          onClick={() =>
            setState(state === "revealed" ? "unrevealed" : "revealed")
          }
          aria-disabled={state === "disabled"}
        >
          {state === "revealed" ? "Hide" : "Reveal"}
        </Button>
      </div>
      {state === "revealed" && children}
    </>
  );
}
