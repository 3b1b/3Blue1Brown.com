import Link from "next/link";
import NormalLayout from "../layouts/NormalLayout";
import Section from "../components/Section";
import PiCreature from "../components/PiCreature";
import styles from "./404.module.scss";

const NotFound = () => (
  <NormalLayout>
    <Section>
      <div className={styles.not_found}>
        <PiCreature emotion="sad" placement="inline" />
        <div className={styles.text}>
          <div>Page not found</div>
          <div>
            Try{" "}
            <Link href="/search">
              <a>searching the site</a>
            </Link>{" "}
            for the content you want
          </div>
        </div>
      </div>
    </Section>
  </NormalLayout>
);

export default NotFound;
