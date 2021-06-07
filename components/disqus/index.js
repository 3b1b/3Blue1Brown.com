import { DiscussionEmbed } from "disqus-react";
import { disqus } from "../../vars.yaml";
import Section from "../section";

const Disqus = (props) => (
  <Section>
    <h1 id="discussion">Discussion</h1>
    <DiscussionEmbed
      shortname={disqus}
      config={{
        url: "",
        identifier: "",
        title: props.title,
      }}
    />
  </Section>
);

export default Disqus;
