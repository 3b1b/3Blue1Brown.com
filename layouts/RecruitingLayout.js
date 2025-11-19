import { useContext } from "react";
import NormalLayout from "./NormalLayout";
import PageContent from "../components/PageContent";
import Clickable from "../components/Clickable";
import Jump from "../components/Jump";
import Section from "../components/Section";
import { PageContext } from "../pages/_app";

// layout for recruiting company pages
const RecruitingLayout = () => {
  const { title, description, logo, about, careers, slug } = useContext(PageContext);

  return (
    <NormalLayout>
      <style jsx global>{`
        .recruiting-page .anchor {
          display: none !important;
        }
      `}</style>
      <Section width="narrow" className="recruiting-page">
        <div style={{ position: 'relative' }}>
          {/* "More companies" link positioned in upper left */}
          <a href={"/recruiting#" + slug} style={{ textDecoration: 'none', position: 'absolute', top: 0, left: 0 }}>
            <h4 style={{ margin: 0 }}>
              <i className="fas fa-arrow-left"></i> More companies
            </h4>
          </a>

          {/* Logo positioned absolutely in upper left, below "More companies" link */}
          <div style={{ position: 'absolute', top: 50, left: 0 }}>
            <img src={logo} alt={title} style={{ width: 120, height: 120, objectFit: 'contain' }}/>
          </div>

          {/* Centered content - unaffected by absolutely positioned elements */}
          <div style={{ paddingTop: '40px' }}>
            <h1 style={{ margin: '0 0 15px 0', fontSize: '2.5rem', textAlign: 'center' }}>{title}</h1>
            <p style={{ margin: '0 auto 30px auto', fontSize: '1.2rem', color: '#666', textAlign: 'center', maxWidth: '800px' }}>{description}</p>

            <div style={{ display: 'flex', gap: '25px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <a href={about} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <i className="fas fa-external-link-alt"></i> About {title}
              </a>
              <a href={careers} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <i className="fas fa-external-link-alt"></i> Explore open positions
              </a>
            </div>
          </div>
        </div>
      </Section>

      <div className="recruiting-page">
        <PageContent />
      </div>

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
