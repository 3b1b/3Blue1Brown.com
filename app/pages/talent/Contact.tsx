import { href } from "react-router";
import { H2 } from "~/components/Heading";
import Link from "~/components/Link";
import site from "~/data/site.json";

const email = site.contact.talent;

// details section on partner gallery page
export default function Details() {
  return (
    <>
      <section className="bg-alt-white">
        <H2>Want to be listed here?</H2>

        <p>
          If your organization would like to be featured here, please send an
          inquiry to <Link to={`mailto:${email}`}>{email}</Link> and we can
          explore whether it's a good fit. The main thing we care about is
          whether members of your technical team genuinely love working there.
        </p>
      </section>

      <section className="bg-secondary/10">
        <H2>Find a job here?</H2>

        <p className="text-center text-balance">
          Did you find a job through this page? We'd love to hear your story!
          <br />
          Let us know via the general{" "}
          <Link to={`${href("/about")}#contact`}>contact form</Link>.
        </p>
      </section>
    </>
  );
}
