import type { ReactNode } from "react";
import { useState } from "react";
import {
  ArrowsClockwiseIcon,
  CheckIcon,
  EyeglassesIcon,
  XIcon,
} from "@phosphor-icons/react";
import clsx from "clsx";
import Button from "~/components/Button";
import Form from "~/components/Form";
import Markdownify from "~/components/Markdownify";
import Radios from "~/components/Radios";
import { sleep } from "~/util/misc";

type Props = {
  // question content
  question: ReactNode;
  // enumerated choices. not array b/c jsx would escape e.g. \times -> TABimes.
  // would need to do e.g. \\times or String.raw, making authoring annoying.
  choice1: ReactNode;
  choice2: ReactNode;
  choice3?: ReactNode;
  choice4?: ReactNode;
  choice5?: ReactNode;
  choice6?: ReactNode;
  // index of correct answer
  answer: number;
  // explanation of answer after reveal
  children?: ReactNode;
};

// multiple choice question
export default function Question({
  question,
  choice1,
  choice2,
  choice3,
  choice4,
  choice5,
  choice6,
  answer,
  children,
}: Props) {
  // list of choices
  const choices = [choice1, choice2, choice3, choice4, choice5, choice6].filter(
    Boolean,
  );

  // selected option
  const [value, setValue] = useState<string>("");

  // answer state
  const [state, setState] = useState<"unanswered" | "right" | "wrong">(
    "unanswered",
  );

  // is option index right answer
  const isRight = (index: number) =>
    state !== "unanswered" && index + 1 === answer;
  // is option index wrong answer
  const isWrong = (index: number) =>
    state !== "unanswered" &&
    String(index + 1) === value &&
    index + 1 !== answer;

  return (
    <Form
      className="flex flex-col gap-8"
      onSubmit={async () => {
        setState("unanswered");
        // allow aria alert to fully unmount & re-mount so it gets re-announced
        await sleep();
        if (value === String(answer)) setState("right");
        else setState("wrong");
      }}
    >
      <Radios
        label={question}
        options={choices.map((choice, index) => ({
          value: String(index + 1),
          label: (
            <>
              <Markdownify>{choice}</Markdownify>
              {isRight(index) && (
                <CheckIcon className="ml-auto icon text-success" />
              )}
              {isWrong(index) && <XIcon className="ml-auto icon text-error" />}
            </>
          ),
          className: clsx(
            isRight(index) && "bg-success/10",
            isWrong(index) && "bg-error/10",
          ),
        }))}
        value={value}
        onChange={setValue}
      />

      {state !== "unanswered" && (
        <div className="sr-only" role="alert" aria-atomic="true">
          {state === "right" && "Correct"}
          {state === "wrong" && "Incorrect"}
        </div>
      )}

      <Button
        type={state === "unanswered" ? "submit" : undefined}
        onClick={
          state !== "unanswered"
            ? // reset
              async () => {
                // wait so button doesn't immediately become type="submit" and re-handle same click and trigger form
                await sleep();
                setState("unanswered");
              }
            : undefined
        }
        color="light"
        size="sm"
        className="self-start"
        aria-disabled={!value}
      >
        {state === "unanswered" ? <EyeglassesIcon /> : <ArrowsClockwiseIcon />}
        {state === "unanswered" ? "Check" : "Reset"}
      </Button>

      {state !== "unanswered" && children}
    </Form>
  );
}
