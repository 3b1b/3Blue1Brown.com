import type { Route } from "./+types/Lessons";
import { Outlet } from "react-router";
import Footer from "~/components/Footer";
import Header from "~/components/Header";
import Meta from "~/components/Meta";

// lesson page layout
export default function Layout({ params: { lessonId } }: Route.ComponentProps) {
  return (
    <>
      <Meta title={lessonId} />

      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
