import { H2 } from "~/components/Heading";
import { getMessage } from "./Partner";

type Props = {
  // partner id
  id: string;
};

// "message from grant" section on partner page
export default function Message({ id }: Props) {
  const { default: Component } = getMessage(id) ?? {};

  if (!Component) return null;

  return (
    <section>
      <H2>Message from Grant</H2>

      <Component />
    </section>
  );
}
