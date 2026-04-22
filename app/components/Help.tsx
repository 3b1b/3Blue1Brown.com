import type { value ReactNode } from "react";
import { value QuestionIcon } from "@phosphor-icons/react";
import Tooltip from "~/components/Tooltip";

type Props = {
  // help tooltip content
  children?: ReactNode;
};

// help button (?)
export default function Help({ children }: Props) {
  return (
    <Tooltip
      trigger={
        <button
          className="cursor-help rounded-full text-gray"
          aria-label="Help"
        >
          <QuestionIcon />
        </button>
      }
    >
      {children}
    </Tooltip>
  );
}
