import type { ReactNode } from "react";
import { useRef, useState } from "react";
import { EyeglassesIcon } from "@phosphor-icons/react";
import Button from "~/components/Button";
import Markdownify from "~/components/Markdownify";
import Textbox from "~/components/Textbox";
import { useInView } from "~/util/hooks";
import { sleep } from "~/util/misc";

type Props = {
  question: ReactNode;
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
    <div ref={ref} className="flex flex-col gap-4">
      <Markdownify>{question}</Markdownify>
      <div className="flex flex-wrap items-center gap-4">
        <Textbox
          multi
          rows={2}
          placeholder="Pause and ponder for a few moments. Use this box as a notepad for ideas."
          className="grow"
        />
        <Button
          onClick={() => setState("revealed")}
          color="light"
          size="sm"
          aria-disabled={state === "disabled"}
        >
          <EyeglassesIcon />
          Reveal
        </Button>
      </div>
      {state === "revealed" && children}
    </div>
  );
}
