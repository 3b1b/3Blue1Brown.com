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
import site from "~/data/site.yaml";

const links = [
  {
    icon: <YoutubeLogoIcon />,
    label: "2nd Channel",
    link: site.second_channel,
  },
  {
    icon: <NewspaperIcon />,
    label: "Newsletter",
    link: site.newsletter,
  },
  {
    icon: <RssIcon />,
    label: "RSS",
    link: site.rss,
  },
  {
    icon: <InstagramLogoIcon />,
    label: "Instagram",
    link: site.instagram,
  },
  {
    icon: <XLogoIcon />,
    label: "X",
    link: site.x,
  },
  {
    icon: <ButterflyIcon />,
    label: "BlueSky",
    link: site.bluesky,
  },
  {
    icon: <TiktokLogoIcon />,
    label: "TikTok",
    link: site.tiktok,
  },
  {
    icon: <FacebookLogoIcon />,
    label: "Facebook",
    link: site.facebook,
  },
  {
    icon: <SpotifyLogoIcon />,
    label: "Spotify",
    link: site.spotify,
  },
  {
    icon: <RedditLogoIcon />,
    label: "Reddit",
    link: site.reddit,
  },
  {
    icon: <GithubLogoIcon />,
    label: "GitHub",
    link: site.github,
  },
  {
    icon: <TelevisionIcon />,
    label: "Bilibili",
    link: site.bilibili,
  },
];

export default function Follow() {
  return (
    <section className="bg-secondary/10">
      <h2>
        <hr />
        Follow
        <hr />
      </h2>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(auto,--spacing(50)))] justify-center gap-4">
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
