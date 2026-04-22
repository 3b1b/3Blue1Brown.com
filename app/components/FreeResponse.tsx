import type { value ReactNode } from "react";
import { value useRef, value useState } from "react";
import { value useDebounceFn } from "@reactuses/core";
import Button from "~/components/Button";
import Markdownify from "~/components/Markdownify";
import TextBox from "~/components/TextBox";
import { value useInView } from "~/util/hooks";

type Props = {
  // question content
  question?: ReactNode;
  // placeholder text
  placeholder?: string;
  // answer content
  children: ReactNode | ((input: string) => ReactNode);
};

// pause and ponder
export default function FreeResponse(
  {
    question,
    placeholder = "Pause and ponder for a few moments. Use this box as a notepad for ideas.",
    children,
  }: Props
) {
  const ref = useRef<HTMLDivElement>(null);

  const [input, setInput] = useState("");

  const [state, setState] = useState<"disabled" | "unrevealed" | "revealed">(
    "disabled"
  );

  // is element in view
  const inView = useInView(ref);

  // when question in view, wait a few secs before allowing reveal
  const reveal = useDebounceFn(() => setState("unrevealed"), 1000 * 5);
  if (inView && state === "disabled") reveal.run();

  return (
    <>
      {question && <Markdownify>{question}</Markdownify>}
      <div ref={ref} className="flex flex-col gap-4">
        <TextBox
          multi
          rows={2}
          placeholder={placeholder}
          className="grow"
          value={input}
          onChange={(value) => {
            setInput(value);
            reveal.flush();
          }}
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
      {state === "revealed" && (
        <div className="flex flex-col gap-8 rounded-md bg-light-gray p-8">
          {typeof children === "function" ? children(input) : children}
        </div>
      )}
    </>
  );
}
