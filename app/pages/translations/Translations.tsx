import Card from "~/components/Card";
import Carousel from "~/components/Carousel";
import Collapsible from "~/components/Collapsible";
import Footer from "~/components/Footer";
import Header from "~/components/Header";
import { H1, H2 } from "~/components/Heading";
import Main from "~/components/Main";
import Meta from "~/components/Meta";
import StrokeType from "~/components/StrokeType";
import panel1 from "~/pages/translations/images/Panel1.png";
import panel2 from "~/pages/translations/images/Panel2.png";
import panel3 from "~/pages/translations/images/Panel3.png";

const languages = [
  {
    name: "हिन्दी",
    country: "in",
    link: "https://www.youtube.com/playlist?list=PLZHQObOWTQDNwUA5K8jpc5GSl335bX2vD",
  },
  {
    name: "Français",
    country: "fr",
    link: "https://www.youtube.com/playlist?list=PLZHQObOWTQDNYUN7N_DSrqPELmuAjp-xx",
  },
  {
    name: "Español",
    country: "es",
    link: "https://www.youtube.com/playlist?list=PLZHQObOWTQDM4HpiIzNVFtvy9BZQd8fH9",
  },
  {
    name: "Русский",
    country: "ru",
    link: "https://www.youtube.com/playlist?list=PLZHQObOWTQDM4E-dwvbnQTiyKDO-y9T2t",
  },
  {
    name: "日本語",
    country: "jp",
    link: "https://www.youtube.com/@3Blue1BrownJapan",
  },
  {
    name: "中文",
    country: "cn",
    link: "https://space.bilibili.com/88461692",
  },
];

export default function Translations() {
  return (
    <>
      <Meta title="Translations" />

      <Header />

      <Main>
        <section className="bg-theme/15">
          <H1>
            <StrokeType>Translations</StrokeType>
          </H1>
        </section>

        <section>
          <div className="grid grid-cols-3 gap-8 max-md:grid-cols-2 max-sm:grid-cols-1">
            {languages.map(({ name, country, link }) => (
              <Card
                key={name}
                to={link}
                title={
                  <>
                    <img
                      src={`https://flagcdn.com/w40/${country}.png`}
                      srcSet={`https://flagcdn.com/w80/${country}.png 2x`}
                      alt={name}
                      className="h-5 rounded-xs shadow-sm"
                    />
                    {name}
                  </>
                }
              />
            ))}
          </div>

          <p>
            Video translations are an ongonig project. Instead of AI dubs, or
            working with traditional dubbing services, my approach to
            translations has been to hire independent contractors who are
            knowledgable and passionate about the underlying math. The playlists
            above collect videos which have an audio track available in a given
            language.
          </p>

          <Collapsible title="How to find alternate audio tracks on YouTube">
            <Carousel>
              <img src={panel1} alt="Step 1: open video settings" />
              <img src={panel2} alt="Step 2: select Audio track" />
              <img src={panel3} alt="Step 3: choose a language" />
            </Carousel>
          </Collapsible>
        </section>

        <section>
          <H2>Contribute and Correct Subtitles</H2>
          <p>
            Beyond dubbed audio, my friend Ben Eater and I collaborated to build
            Criblate — a platform where the community can submit and correct
            subtitles for videos. If you'd like to contribute translations or
            fix existing captions, head over there.
          </p>
          <div className="flex justify-center">
            <Card to="https://criblate.com" title="Criblate" />
          </div>
        </section>
      </Main>

      <Footer />
    </>
  );
}
