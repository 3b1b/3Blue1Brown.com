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
  const { title, description, banner, logo, about, careers, slug } = useContext(PageContext);

  return (
    <NormalLayout anchors={false}>
      <Section width="narrow" dark={true} image={banner}>
        <a href={"/recruiting#" + slug}>
          <h4 style={{ align: "left"}}> 
            <i className="fas fa-arrow-left"></i> Recruiting
          </h4>
        </a>
        <a href={about} target="_blank" rel="noopener noreferrer"> 
          <img src={logo} alt="" style={{ width: 400 }}/>
        </a>
        <h3 style={{ margin: 0 }}>{description}</h3>
        <a href={about} target="_blank" rel="noopener noreferrer">
          <h3>Learn more</h3>
        </a>
      </Section>
      <PageContent />
      <Section>
        <Clickable
          link={careers}
          text="Explore open positions"
          icon="fas fa-external-link-alt"
          design="rounded"
          target="_blank"
          rel="noopener noreferrer"
        />
      </Section>
      <Jump />
    </NormalLayout>
  );
};

export default RecruitingLayout;
