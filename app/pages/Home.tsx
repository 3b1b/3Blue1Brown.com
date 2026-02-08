import Footer from "~/components/Footer";
import Header from "~/components/Header";
import { Meta } from "~/Meta";
import Explore from "~/pages/home/Explore";
import Follow from "~/pages/home/Follow";
import Highlights from "~/pages/home/Highlights";
import Theater from "~/pages/home/Theater";

export default function Home() {
  return (
    <>
      <Meta />

      <Header>
        <Theater />
      </Header>

      <main>
        <Explore />
        <Highlights />
        <Follow />
      </main>

      <Footer />
    </>
  );
}
