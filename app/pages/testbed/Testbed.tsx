import Alert from "~/components/Alert";
import Button from "~/components/Button";
import Checkbox from "~/components/Checkbox";
import Collapsible from "~/components/Collapsible";
import Figure from "~/components/Figure";
import Link from "~/components/Link";
import Logo from "~/components/Logo";
import Meta from "~/components/Meta";
import Portrait from "~/components/Portrait";
import StrokeType from "~/components/StrokeType";
import Textbox from "~/components/Textbox";
import site from "~/data/site.yaml";
import { getVariants } from "~/util/misc";

// a place to test and see all components side-by-side to ensure consistency
export default function Testbed() {
  return (
    <>
      <Meta title="Testbed" />

      <section className="bg-theme/10">
        <h1>
          <StrokeType>Testbed</StrokeType>
        </h1>
      </section>

      <section>
        <h2>Link</h2>

        <div className="flex justify-center gap-4">
          <Link to="/">Internal link</Link>
          <Link to="https://google.com">External link</Link>
        </div>
      </section>

      <section>
        <h2>Button</h2>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(auto,--spacing(50)))] place-content-center place-items-center gap-4">
          {getVariants({
            size: ["small", "medium"] as const,
            color: ["none", "light", "theme", "accent"] as const,
          }).map((props, index) => (
            <Button key={index} {...props} to="/">
              Lorem ipsum
            </Button>
          ))}
        </div>
      </section>

      <section>
        <h2>Collapsible</h2>

        <Collapsible title="Collapsible content" className="self-center">
          Lorem ipsum dolor sit amet consectetur adipiscing elit
        </Collapsible>
      </section>

      <section>
        <h2>Textbox</h2>

        <Textbox placeholder="Lorem ipsum dolor sit amet" />
        <Textbox multi placeholder="Lorem ipsum dolor sit amet" />
      </section>

      <section>
        <h2>Checkbox</h2>

        <Checkbox className="self-center">Lorem ipsum dolor sit amet</Checkbox>
      </section>

      <section>
        <h2>Select</h2>

        <Textbox placeholder="Lorem ipsum dolor sit amet" />
        <Textbox multi placeholder="Lorem ipsum dolor sit amet" />
      </section>

      <section>
        <h2>Alert</h2>

        {(["loading", "info", "success", "warning", "error"] as const).map(
          (type) => (
            <Alert key={type} type={type} className="self-center">
              Lorem ipsum dolor sit amet
            </Alert>
          ),
        )}
      </section>

      <section>
        <h2>Portrait</h2>

        <Portrait
          image="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Oryctolagus_cuniculus_Rcdo.jpg/500px-Oryctolagus_cuniculus_Rcdo.jpg"
          name="Lorem ipsum"
          description="Lorem ipsum dolor sit amet consectetur adipiscing elit"
          className="max-w-50 self-center"
        />
      </section>

      <section>
        <h2>Figure</h2>

        <Figure image="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Oryctolagus_cuniculus_Rcdo.jpg/500px-Oryctolagus_cuniculus_Rcdo.jpg">
          Lorem ipsum dolor sit amet consectetur adipiscing elit
        </Figure>
      </section>

      <section>
        <h2>Headings</h2>

        <h3>Heading 3</h3>
        <h4>Heading 4</h4>
      </section>

      <section>
        <h2>Fonts</h2>

        <p>
          <strong>Lorem ipsum</strong> dolor sit <em>amet consectetur</em>{" "}
          adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem
          placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu
          aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec
          metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer
          nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad
          litora torquent per conubia nostra inceptos himenaeos.
        </p>
        <hr />
        <p className="font-sans">
          <strong>Lorem ipsum</strong> dolor sit <em>amet consectetur</em>{" "}
          adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem
          placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu
          aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec
          metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer
          nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad
          litora torquent per conubia nostra inceptos himenaeos.
        </p>
        <hr />
        <p className="font-mono">
          <strong>Lorem ipsum</strong> dolor sit <em>amet consectetur</em>{" "}
          adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem
          placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu
          aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec
          metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer
          nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad
          litora torquent per conubia nostra inceptos himenaeos.
        </p>
      </section>

      <section>
        <h2>List</h2>
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
        <h2>Quote</h2>

        <blockquote>
          It was the best of times, it was the worst of times, it was the age of
          wisdom, it was the age of foolishness, it was the epoch of belief, it
          was the epoch of incredulity, it was the season of light, it was the
          season of darkness, it was the spring of hope, it was the winter of
          despair.
        </blockquote>
      </section>

      <section>
        <h2>Code</h2>

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
        <h2>Table</h2>

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
        <h2>Icons</h2>

        <Logo className="size-100" />
        <div className="dark relative isolate flex h-160 w-240 flex-col items-center justify-center gap-4 overflow-hidden bg-white font-serif text-lg text-black">
          <Logo className="absolute -z-10 scale-250 blur-[100px]" />
          <Logo className="mb-4 size-60" />
          <div className="text-6xl">{site.title}</div>
          <div className="text-3xl opacity-50">{site.subtitle}</div>
        </div>
      </section>
    </>
  );
}
