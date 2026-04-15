import { href } from "react-router";
import Alert from "~/components/Alert";
import { H2 } from "~/components/Heading";
import Link from "~/components/Link";
import site from "~/data/site.json";

// details section on partner gallery page
export default function Details() {
  return (
    <>
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
          Did you find a job through this page? We'd love to hear your story!
          <br />
          Let us know via the general{" "}
          <Link to={`${href("/about")}#contact`}>contact form</Link>.
        </p>
        <Alert>
          The organizations we partner with are selectively chosen and carefully
          vetted, but we still encourage you to research them yourself before
          applying.
        </Alert>
      </section>
    </>
  );
}
