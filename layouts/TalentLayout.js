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
    wordmark = "",
    wordmark_height = null,
    hide_header = false,
    hide_banner_overlay = false,
    light_banner_overlay = false,
    title = "",
  } = useContext(PageContext);

  return (
    <>
      <Head />
      {!hide_header && <Header light={true} />}
      <Glow />
      <Main>
      {/* Company Banner */}
      <div className={styles.companyBanner}>
        <img src={banner} alt="" className={styles.bannerImage} />
        <div
          className={styles.bannerOverlay}
          style={
            hide_banner_overlay
              ? { background: 'none' }
              : light_banner_overlay
                ? { background: 'linear-gradient(to top, rgba(255, 255, 255, 0.95), transparent)' }
                : {}
          }
          data-light={light_banner_overlay}
        >
          <div className={styles.bannerContent}>
            <img src={wordmark} alt={`${title}`} className={styles.wordmark} style={wordmark_height ? { height: wordmark_height } : {}} />
          </div>
        </div>
      </div>
      <div />
      <div className={styles.pageContent}>
        <div className={styles.backLinkRow}>
          <Link href="/talent" className={styles.backLink}>
            <i className="fas fa-arrow-left"></i> More 3b1b partners
          </Link>
        </div>
        <PageContent />
      </div>

      <Jump />
      </Main>
      <Footer />
    </>
  );
};

export default TalentLayout;
