import { useContext } from "react";
import { DiscussionEmbed } from "disqus-react";
import { disqus } from "../../data/site.yaml";
import Section from "../Section";
import { PageContext } from "../../pages/_app";

// disqus comment section component
const Disqus = () => {
  const { title } = useContext(PageContext);
  return (
    <Section>
      <h1 id="discussion">Discussion</h1>
      {process.env.NODE_ENV === "production" ? (
        <DiscussionEmbed
          shortname={disqus}
          config={{
            url: "",
            identifier: "",
            title: title,
          }}
        />
      ) : null}
    </Section>
  );
};

export default Disqus;
