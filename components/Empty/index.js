import Section from "../Section";
import PiCreature from "../PiCreature";

// placeholder component for when lesson has no text content
const Empty = () => (
  <Section>
    <p className="center">There's no text version of this lesson yet!</p>
    <PiCreature emotion="thinking" placement="inline" />
  </Section>
);

export default Empty;
