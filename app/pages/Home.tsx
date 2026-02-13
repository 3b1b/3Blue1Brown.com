import Footer from "~/components/Footer";
import Header from "~/components/Header";
import { Meta } from "~/Meta";
import Explore from "~/pages/home/Explore";
import Extras from "~/pages/home/Extras";
import Follow from "~/pages/home/Follow";
import Patreon from "~/pages/home/Patreon";
import Talent from "~/pages/home/Talent";
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
        <Patreon />
        <Talent />
        <Follow />
        <Extras />
      </main>

      <Footer />
    </>
  );
}
