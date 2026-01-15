import { useContext } from "react";
import NormalLayout from "./NormalLayout";
import PageContent from "../components/PageContent";
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
    <NormalLayout>
      <div>
        <Clickable
          link="/talent"
          text="More companies"
          icon="fas fa-arrow-left"
        />
      </div>

      <Section width="narrow">
        <div className={styles.header}>
          <img src={logo} alt={`${title} logo`} className={styles.logo} />
          <div className={styles["header-text"]}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.description}>{description}</p>
          </div>
        </div>
      </Section>

      <Section width="narrow" dark image={banner}>
        <p
          className={styles.highlights}
          dangerouslySetInnerHTML={{ __html: highlights }}
        />
      </Section>

      <Section width="narrow">
        <p className={styles.introduction}>{introduction}</p>
      </Section>

      <Section width="narrow">
        <Center>
          {links.map((link, index) => (
            <Clickable
              key={index}
              link={link.url}
              text={link.label}
              icon="fas fa-external-link-alt"
              design="rounded"
              className={styles.link}
            />
          ))}
        </Center>

        <Center>
          {tags.map((tag, index) => (
            <div key={index} className={styles.tag}>
              {tag}
            </div>
          ))}
        </Center>
      </Section>

      <div className={styles.images}>
        {images.map((src, index) => (
          <a key={index} href={src} target="_blank">
            <img src={src} alt="" />
          </a>
        ))}
      </div>

      <div>
        <PageContent />
      </div>

      <Jump />
    </NormalLayout>
  );
};

export default TalentLayout;
