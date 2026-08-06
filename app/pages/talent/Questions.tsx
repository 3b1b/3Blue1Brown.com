import { href } from "react-router";
import Alert from "~/components/Alert";
import { H2 } from "~/components/Heading";
import Link from "~/components/Link";
import PiCreature from "~/components/PiCreature";
import site from "~/data/site.json";

// details section on partner gallery page
export default function Details() {
  return (
    <>
      <section className="bg-theme/10">
        <H2>What is this?</H2>

        <p>
          These organizations are partners with 3Blue1Brown seeking to hire
          technically curious people like you. If this channel were a
          university, think of this as the campus career fair where you can find
          aligned opportunities. Explore the pages here to learn what makes each
          team unique.
        </p>

        <Alert>
          The organizations we partner with are selectively chosen and carefully
          vetted, but we still encourage you to research them yourself before
          applying.
        </Alert>

        <PiCreature
          emotion="hesitant"
          size="md"
          className="absolute bottom-10 left-32 max-xl:hidden"
        />
      </section>

      <section className="bg-secondary/10">
        <H2>Want to be featured here?</H2>

        <p>
          If your organization would like to partner with us, please send an
          inquiry to {site.contact.talent} and we can explore whether it's a
          good fit. The main thing we care about is whether members of your
          technical team genuinely love working there.
        </p>
      </section>

      <section className="bg-alt-white">
        <H2>Find a job here?</H2>

        <p className="text-center text-balance">
          If you find a job through this page, we'd love to hear your story!
          <br />
          Let us know via the general{" "}
          <Link to={`${href("/about")}#contact`}>contact form</Link>.
        </p>

        <PiCreature
          emotion="hooray"
          size="md"
          className="absolute right-32 bottom-10 -scale-x-100 max-xl:hidden"
        />
      </section>
    </>
  );
}
