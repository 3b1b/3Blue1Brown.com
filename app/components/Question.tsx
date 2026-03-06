import type { ReactNode } from "react";
import { useState } from "react";
import { CheckIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import Button from "~/components/Button";
import { celebrate } from "~/components/Celebrate";
import Form from "~/components/Form";
import Markdownify from "~/components/Markdownify";
import PiCreature from "~/components/PiCreature";
import Radios from "~/components/Radios";
import { shake } from "~/util/dom";
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
  const isRight = (index: number) => state === "right" && index + 1 === answer;

  return (
    <Form
      className="flex flex-col gap-8"
      onSubmit={async (event, submitter) => {
        if (state === "right") setState("unanswered");
        else if (value === String(answer)) {
          setState("right");
          celebrate();
        } else if (state === "wrong") {
          // give indication of another submit
          shake(submitter);
          // un-set and re-set to re-trigger screen reader
          setState("unanswered");
          await sleep();
          setState("wrong");
        } else setState("wrong");
      }}
    >
      <Radios
        label={
          <strong>
            <Markdownify noParagraph>{question}</Markdownify>
          </strong>
        }
        options={choices.map((choice, index) => ({
          value: String(index + 1),
          label: (
            <>
              <Markdownify noParagraph>{choice}</Markdownify>
              {isRight(index) && (
                <CheckIcon className="ml-auto icon text-success" />
              )}
            </>
          ),
          className: clsx(isRight(index) && "bg-success/10"),
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

      <div className="flex items-center gap-8">
        <Button
          type="submit"
          onClick={async (event) => {
            // if already wrong and submitted another wrong
            if (state === "wrong" && value !== String(answer)) {
              // give indication of another submit
              shake(event?.currentTarget);
              // un-set and re-set to re-trigger screen reader
              setState("unanswered");
              await sleep();
              setState("wrong");
            }
          }}
          color="light"
          size="sm"
          aria-disabled={!value}
        >
          {state === "right" && "Reset"}
          {state === "wrong" && "Try Again"}
          {state === "unanswered" && "Check Answer"}
        </Button>

        {state === "wrong" && (
          <>
            <PiCreature emotion="pondering" size="sm" />
            Not quite...
          </>
        )}
        {state === "right" && (
          <>
            <PiCreature emotion="hooray" size="sm" />
            Correct!
          </>
        )}
      </div>

      {state === "right" && (
        <div className="flex flex-col gap-8 rounded-md bg-light-gray p-8">
          {children}
        </div>
      )}
    </Form>
  );
}
