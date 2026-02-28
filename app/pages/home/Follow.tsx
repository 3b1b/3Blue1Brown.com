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
import { H2 } from "~/components/Heading";
import site from "~/data/site.json";

const links = [
  {
    icon: <YoutubeLogoIcon />,
    label: "2nd Channel",
    link: site.socials.second_channel,
  },
  {
    icon: <NewspaperIcon />,
    label: "Newsletter",
    link: site.socials.newsletter,
  },
  {
    icon: <RssIcon />,
    label: "RSS",
    link: site.socials.rss,
  },
  {
    icon: <InstagramLogoIcon />,
    label: "Instagram",
    link: site.socials.instagram,
  },
  {
    icon: <XLogoIcon />,
    label: "X",
    link: site.socials.x,
  },
  {
    icon: <ButterflyIcon />,
    label: "BlueSky",
    link: site.socials.bluesky,
  },
  {
    icon: <TiktokLogoIcon />,
    label: "TikTok",
    link: site.socials.tiktok,
  },
  {
    icon: <FacebookLogoIcon />,
    label: "Facebook",
    link: site.socials.facebook,
  },
  {
    icon: <SpotifyLogoIcon />,
    label: "Spotify",
    link: site.socials.spotify,
  },
  {
    icon: <RedditLogoIcon />,
    label: "Reddit",
    link: site.socials.reddit,
  },
  {
    icon: <GithubLogoIcon />,
    label: "GitHub",
    link: site.socials.github,
  },
  {
    icon: <TelevisionIcon />,
    label: "Bilibili",
    link: site.socials.bilibili,
  },
];

export default function Follow() {
  return (
    <section className="bg-secondary/10">
      <H2>
        <hr />
        Follow
        <hr />
      </H2>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(auto,--spacing(50)))] justify-center gap-4">
        {links.map(({ icon, label, link }, index) => (
          <Button
            key={index}
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
