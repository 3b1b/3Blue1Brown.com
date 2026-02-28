import type { ComponentProps } from "react";
import { useEventListener } from "@reactuses/core";

type Props = {
  // called when form submitted
  onSubmit: (data: FormData) => unknown;
} & Omit<ComponentProps<"form">, "onSubmit">;

// form wrapper with extra conveniences
export default function Form({ onSubmit, ...props }: Props) {
  // prevent implicit form submit from pressing enter on input
  useEventListener("keydown", (event) => {
    if (
      event.key === "Enter" &&
      event.target instanceof Element &&
      event.target.matches("input")
    )
      // prevent submit
      event.preventDefault();
  });

  return (
    <form
      onSubmit={(event) => {
        // prevent page navigation
        event.preventDefault();

        // only submit if triggered by a submit button
        if (
          event.nativeEvent instanceof SubmitEvent &&
          event.nativeEvent.submitter?.matches("button[type='submit']")
        )
          // call callback
          onSubmit(new FormData(event.target));
      }}
      {...props}
    />
  );
}
