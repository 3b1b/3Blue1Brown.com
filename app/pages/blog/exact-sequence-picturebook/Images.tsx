import { importAssets } from "~/util/file";

const { list } = importAssets(import.meta.glob("./*.svg", { eager: true }));

export default function Images() {
  return Object.values(list).map((src, index) => (
    <section key={index} suppressHydrationWarning={true}>
      <img
        key={index}
        src={src}
        style={{ backgroundColor: "white" }}
        alt="See PDF version for accessible text"
      />
    </section>
  ));
}
