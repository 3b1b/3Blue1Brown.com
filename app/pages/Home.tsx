import type { Route } from "./+types/Home";

export default function Home() {
  return <>Hello world</>;
}

export function meta({}: Route.MetaArgs) {
  return [{ title: "Title" }, { name: "description", content: "Description" }];
}
