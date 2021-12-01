import { useContext } from "react";
import NormalLayout from "./NormalLayout";
import PageContent from "../components/PageContent";
import Figure from "../components/Figure";
import Clickable from "../components/Clickable";
import Jump from "../components/Jump";
import Section from "../components/Section";
import { PageContext } from "../pages/_app";

// layout for lessons
const RecruitingLayout = () => {
  const { title, description, banner, logo, website } = useContext(PageContext);

  return (
    <NormalLayout>
      <Section width="narrow" dark={true} image={banner}>
        <img src={logo} alt="" style={{ width: 400 }} />
        <h1 style={{ margin: 0 }}>{title}</h1>
        <h2 style={{ margin: 0 }}>{description}</h2>
        <Clickable
          link={website}
          text="Website"
          icon="fas fa-external-link-alt"
          design="rounded"
        />
      </Section>
      <PageContent />
      <Jump />
    </NormalLayout>
  );
};

export default RecruitingLayout;
