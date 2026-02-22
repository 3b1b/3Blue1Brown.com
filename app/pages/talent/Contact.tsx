import { href } from "react-router";
import Link from "~/components/Link";

const email = "talent@3blue1brown.com";

export default function Details() {
  return (
    <>
      <section className="bg-gray/10 width-sm">
        <h2>Want to be listed here?</h2>

        <p>
          If your company or organization would like to be featured here, please
          send an inquiry to <Link to={`mailto:${email}`}>{email}</Link> and we
          can explore whether it's a good fit. The main thing we care about is
          whether members of your technical team genuinely love working there.
        </p>
      </section>

      <section className="bg-secondary/10 width-sm">
        <h2>Find a job here?</h2>

        <p className="text-center">
          Did you find a job through this page? Let us know, we'd love to hear
          your story!
          <br />
          Email us at <Link to={`mailto:${email}`}>{email}</Link> or use the{" "}
          <Link to={`${href("/about")}#contact`}>contact form</Link>.
        </p>
      </section>
    </>
  );
}
