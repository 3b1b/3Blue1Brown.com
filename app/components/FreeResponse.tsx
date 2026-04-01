import type { ReactNode } from "react";
import { useRef, useState } from "react";
import { useDebounceFn } from "@reactuses/core";
import Button from "~/components/Button";
import Markdownify from "~/components/Markdownify";
import TextBox from "~/components/TextBox";
import { useInView } from "~/util/hooks";

type Props = {
  // question content
  question?: ReactNode;
  // answer content
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
  const reveal = useDebounceFn(() => setState("unrevealed"), 1000 * 5);
  if (inView && state === "disabled") reveal.run();

  return (
    <>
      {question && <Markdownify noParagraph>{question}</Markdownify>}
      <div ref={ref} className="flex flex-col gap-4">
        <TextBox
          multi
          rows={2}
          placeholder="Pause and ponder for a few moments. Use this box as a notepad for ideas."
          className="grow"
        />
        <Button
          color="light"
          size="sm"
          className="w-40"
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
