import { Outlet } from "react-router";
import Footer from "~/components/Footer";
import Header from "~/components/Header";

// basic/default layout
export default function Layout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
