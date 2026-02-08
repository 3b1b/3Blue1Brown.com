import {
  ButterflyIcon,
  FacebookLogoIcon,
  GithubLogoIcon,
  InstagramLogoIcon,
  NewspaperIcon,
  RedditLogoIcon,
  RssIcon,
  SpotifyLogoIcon,
  TelevisionIcon,
  TiktokLogoIcon,
  XLogoIcon,
  YoutubeLogoIcon,
} from "@phosphor-icons/react";
import Button from "~/components/Button";
import Heading from "~/components/Heading";

const links = [
  {
    icon: <YoutubeLogoIcon />,
    label: "2nd Channel",
    link: "",
  },
  {
    icon: <NewspaperIcon />,
    label: "Newsletter",
    link: "",
  },
  {
    icon: <InstagramLogoIcon />,
    label: "Instagram",
    link: "",
  },
  {
    icon: <XLogoIcon />,
    label: "X",
    link: "",
  },
  {
    icon: <ButterflyIcon />,
    label: "BlueSky",
    link: "",
  },
  {
    icon: <TiktokLogoIcon />,
    label: "TikTok",
    link: "",
  },
  {
    icon: <FacebookLogoIcon />,
    label: "Facebook",
    link: "",
  },
  {
    icon: <SpotifyLogoIcon />,
    label: "Spotify",
    link: "",
  },
  {
    icon: <RedditLogoIcon />,
    label: "Reddit",
    link: "",
  },
  {
    icon: <GithubLogoIcon />,
    label: "GitHub",
    link: "",
  },
  {
    icon: <RssIcon />,
    label: "RSS",
    link: "",
  },
  {
    icon: <TelevisionIcon />,
    label: "Bilibili",
    link: "",
  },
];

export default function Follow() {
  return (
    <section>
      <Heading level={2} className="sr-only">
        Follow
      </Heading>

      <div
        className="
          grid grid-cols-[repeat(auto-fit,minmax(auto,--spacing(50)))]
          justify-center gap-4
        "
      >
        {links.map(({ icon, label, link }) => (
          <Button
            key={label}
            to={link}
            color="none"
            className="justify-start"
            aria-label={label}
          >
            {icon}
            {label}
          </Button>
        ))}
      </div>
    </section>
  );
}
