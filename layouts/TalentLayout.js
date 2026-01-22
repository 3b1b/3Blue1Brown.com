import { useContext } from "react";
import Link from "next/link";
import Head from "../components/Head";
import Header from "../components/Header";
import Main from "../components/Main";
import Footer from "../components/Footer";
import PageContent from "../components/PageContent";
import Glow from "../components/Glow";
import Center from "../components/Center";
import Clickable from "../components/Clickable";
import Jump from "../components/Jump";
import Section from "../components/Section";
import { PageContext } from "../pages/_app";
import styles from "./Talent.module.scss";

// layout for talent company pages
const TalentLayout = () => {
  const {
    banner = "",
    logo = "",
    title = "",
    description = "",
    introduction = "",
    highlights = "",
    links = [],
    tags = [],
    images = [],
  } = useContext(PageContext);

  return (
    <>
      <Head />
      <Header light={true} />
      <Glow />
      <Main>
      {/* Company Banner */}
      <div className={styles.companyBanner}>
        <img src={banner} alt="" className={styles.bannerImage} />
        <div className={styles.backLink}>
          <Link href="/talent">
            <i className="fas fa-arrow-left"></i> More companies
          </Link>
        </div>
        <div className={styles.bannerOverlay}>
          <div className={styles.bannerContent}>
            <div className={styles.titleRow}>
              <img src={logo} alt={`${title} logo`} className={styles.companyLogo} />
              <h1 className={styles.companyName}>{title}</h1>
            </div>
            <p className={styles.companyDescription}>{description}</p>
          </div>
        </div>
      </div>
      <div />
      <Section width="narrow">
        <p className={styles.introduction}>{introduction}</p>
      </Section>
      <div className={styles.pageContent}>
        <PageContent />
      </div>

      <Jump />
      </Main>
      <Footer />
    </>
  );
};

export default TalentLayout;
