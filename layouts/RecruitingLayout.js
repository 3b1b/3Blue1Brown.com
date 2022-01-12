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
        <a href={"/recruiting#" + slug} style={{ textDecoration: 'none' }}>
          <h4 style={{ align: "left"}}> 
            <i className="fas fa-arrow-left"></i> More companies
          </h4>
        </a>
        <a href={about} target="_blank" rel="noopener noreferrer"> 
          <img src={logo} alt="" style={{ width: 400 }}/>
        </a>
        <h3 style={{ margin: 0 }}> {description} </h3>
        <div style={{ margin: 20 }}/>
        <a href={about} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
          <i class="fas fa-external-link-alt"></i> About {title}
        </a>
        <span style={{ margin: 20}} />
        <a href={careers} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
          <i class="fas fa-external-link-alt"></i> Explore open positions
        </a>
      </Section>
      <div />
      <PageContent />
      <div />
      <Section>
        <Clickable
          link={careers}
          icon="fas fa-external-link-alt"
          text="Explore open positions"
          design="rounded"
        />
      </Section>
      <Jump />
    </NormalLayout>
  );
};

export default RecruitingLayout;
