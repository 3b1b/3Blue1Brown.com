import Link from "next/link";
import NormalLayout from "../layouts/normal";
import Section from "../components/section";
import PiCreature from "../components/pi-creature";
import styles from "./404.module.scss";

const NotFound = () => (
  <NormalLayout>
    <Section>
      <div class={styles.not_found}>
        <PiCreature emotion="sad" placement="inline" />
        <div class={styles.text}>
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
