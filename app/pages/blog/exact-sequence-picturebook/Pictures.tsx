import { importAssets } from "~/util/import";

const [, pictures] = importAssets(
  import.meta.glob<{ default: string }>("./*.svg", { eager: true }),
);

export default function Pictures() {
  return Object.values(pictures).map(({ default: src }, index) => (
    <section key={index}>
      <img
        key={index}
        src={src}
        style={{ backgroundColor: "white" }}
        alt="See PDF version for accessible text"
      />
    </section>
  ));
}
