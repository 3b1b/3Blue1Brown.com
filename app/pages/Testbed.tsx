import { Meta } from "~/Meta";

export default function Home() {
  return (
    <main>
      <Meta title="Testbed" />

      <section>
        <h1>Heading 1</h1>
        <h2>Heading 2</h2>
        <hr />
        <h3>Heading 3</h3>
        <h4>Heading 4</h4>
      </section>

      <section className="narrow">
        <p>
          <strong>Lorem ipsum</strong> dolor sit <em>amet consectetur</em>{" "}
          adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem
          placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu
          aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec
          metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer
          nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad
          litora torquent per conubia nostra inceptos himenaeos.
        </p>
      </section>

      <section className="font-sans">
        <p>
          <strong>Lorem ipsum</strong> dolor sit <em>amet consectetur</em>{" "}
          adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem
          placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu
          aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec
          metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer
          nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad
          litora torquent per conubia nostra inceptos himenaeos.
        </p>
      </section>

      <section className="font-mono full">
        <p>
          <strong>Lorem ipsum</strong> dolor sit <em>amet consectetur</em>{" "}
          adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem
          placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu
          aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec
          metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer
          nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad
          litora torquent per conubia nostra inceptos himenaeos.
        </p>
      </section>

      <hr />

      <section>
        <p className="flex gap-4">
          <a href="/">Internal link</a>
          <a href="https://3blue1brown.com">External link</a>
        </p>

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

        <blockquote>
          It was the best of times, it was the worst of times, it was the age of
          wisdom, it was the age of foolishness, it was the epoch of belief, it
          was the epoch of incredulity, it was the season of light, it was the
          season of darkness, it was the spring of hope, it was the winter of
          despair.
          <span>— Charles Dickens</span>
        </blockquote>

        <p>
          Some <code>inline code</code>.
        </p>

        <pre tabIndex={0}>
          {`const popup = document.querySelector("#popup"); 
popup.style.width = "100%";
popup.innerText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
`}
        </pre>

        <table>
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
    </main>
  );
}
