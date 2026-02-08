import Button from "~/components/Button";
import Header from "~/components/Header";
import Heading from "~/components/Heading";
import Link from "~/components/Link";
import Logo from "~/components/Logo";
import { Meta, site } from "~/Meta";

export default function Home() {
  return (
    <>
      <Meta title="Testbed" />

      <Header />

      <main>
        <section>
          <Heading level={1}>Testbed</Heading>
        </section>

        <section>
          <Heading level={2}>Link</Heading>

          <div className="flex justify-center gap-4">
            <Link to="/">Internal link</Link>
            <Link to="https://3blue1brown.com">External link</Link>
          </div>
        </section>

        <section>
          <Heading level={2}>Button</Heading>

          <div className="flex justify-center gap-4">
            <Button to="https://3blue1brown.com">Lorem</Button>
            <Button onClick={console.log} color="light">
              Ipsum
            </Button>
            <Button onClick={console.log} color="theme">
              Dolor
            </Button>
            <Button onClick={console.log} color="accent">
              Sit
            </Button>
          </div>
        </section>

        <section>
          <Heading level={2}>Headings</Heading>

          <Heading level={3}>Heading 3</Heading>
          <Heading level={4}>Heading 4</Heading>
        </section>

        <section>
          <Heading level={2}>Fonts</Heading>

          <p>
            <strong>Lorem ipsum</strong> dolor sit <em>amet consectetur</em>{" "}
            adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem
            placerat. In id cursus mi pretium tellus duis convallis. Tempus leo
            eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec
            metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer
            nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu.
            Ad litora torquent per conubia nostra inceptos himenaeos.
          </p>
          <hr />
          <p className="font-sans">
            <strong>Lorem ipsum</strong> dolor sit <em>amet consectetur</em>{" "}
            adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem
            placerat. In id cursus mi pretium tellus duis convallis. Tempus leo
            eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec
            metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer
            nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu.
            Ad litora torquent per conubia nostra inceptos himenaeos.
          </p>
          <hr />
          <p className="font-mono">
            <strong>Lorem ipsum</strong> dolor sit <em>amet consectetur</em>{" "}
            adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem
            placerat. In id cursus mi pretium tellus duis convallis. Tempus leo
            eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec
            metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer
            nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu.
            Ad litora torquent per conubia nostra inceptos himenaeos.
          </p>
        </section>

        <section>
          <Heading level={2}>List</Heading>
          <ul>
            <li>List item 1</li>
            <li>List item 2</li>
            <li>
              <ol>
                <li>Nested list item 3a</li>
                <li>Nested list item 3b</li>
                <li>Nested list item 3c</li>
              </ol>
            </li>
          </ul>
        </section>

        <section>
          <Heading level={2}>Quote</Heading>

          <blockquote>
            It was the best of times, it was the worst of times, it was the age
            of wisdom, it was the age of foolishness, it was the epoch of
            belief, it was the epoch of incredulity, it was the season of light,
            it was the season of darkness, it was the spring of hope, it was the
            winter of despair.
            <span>— Charles Dickens</span>
          </blockquote>
        </section>

        <section>
          <Heading level={2}>Code</Heading>

          <p>
            Some <code>inline code</code>.
          </p>

          <pre tabIndex={0}>
            {`const popup = document.querySelector("#popup"); 
popup.style.width = "100%";
popup.innerText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
`}
          </pre>
        </section>

        <section>
          <Heading level={2}>Table</Heading>

          <table className="self-center">
            <thead>
              <tr>
                <th>A</th>
                <th>B</th>
                <th>C</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>2</td>
                <td>3</td>
              </tr>
              <tr>
                <td>1</td>
                <td>2</td>
                <td>3</td>
              </tr>
              <tr>
                <td>1</td>
                <td>2</td>
                <td>3</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="items-center">
          <Heading level={2}>Icons</Heading>

          <Logo className="size-100" />
          <div
            className="
              dark relative z-10 flex h-160 w-240 flex-col items-center
              justify-center gap-4 overflow-hidden bg-white font-serif text-lg
              text-black
            "
          >
            <Logo className="absolute -z-10 scale-250 blur-[100px]" />
            <Logo className="mb-4 size-60" />
            <div className="text-6xl">{site.title}</div>
            <div className="text-3xl opacity-50">{site.subtitle}</div>
          </div>
        </section>
      </main>
    </>
  );
}
