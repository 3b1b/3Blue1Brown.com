import { useContext } from "react";
import { DiscussionEmbed } from "disqus-react";
import { disqus } from "../../data/site.yaml";
import Section from "../Section";
import { PageContext } from "../../pages/_app";

const Disqus = () => {
  const { title } = useContext(PageContext);
  return (
    <Section>
      <h1 id="discussion">Discussion</h1>
      <DiscussionEmbed
        shortname={disqus}
        config={{
          url: "",
          identifier: "",
          title: title,
        }}
      />
    </Section>
  );
};

export default Disqus;
