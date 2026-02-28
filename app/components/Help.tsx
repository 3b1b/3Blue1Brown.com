import type { ReactNode } from "react";
import { QuestionIcon } from "@phosphor-icons/react";
import Tooltip from "~/components/Tooltip";

type Props = {
  children?: ReactNode;
};

// help button (?)
const Help = ({ children }: Props) => (
  <Tooltip
    trigger={
      <button className="cursor-help text-dark-gray">
        <QuestionIcon />
      </button>
    }
  >
    {children}
  </Tooltip>
);

export default Help;
