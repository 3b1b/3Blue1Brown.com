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
    link: "https://www.youtube.com/@grantsanderson",
  },
  {
    icon: <NewspaperIcon />,
    label: "Newsletter",
    link: "https://3blue1brown.substack.com",
  },
  {
    icon: <InstagramLogoIcon />,
    label: "Instagram",
    link: "https://www.instagram.com/3blue1brown",
  },
  {
    icon: <XLogoIcon />,
    label: "X",
    link: "https://x.com/3blue1brown",
  },
  {
    icon: <ButterflyIcon />,
    label: "BlueSky",
    link: "https://bsky.app/profile/3blue1brown.com",
  },
  {
    icon: <TiktokLogoIcon />,
    label: "TikTok",
    link: "https://www.tiktok.com/@3blue1brown",
  },
  {
    icon: <FacebookLogoIcon />,
    label: "Facebook",
    link: "https://www.facebook.com/3blue1brown",
  },
  {
    icon: <SpotifyLogoIcon />,
    label: "Spotify",
    link: "https://open.spotify.com/show/4MFZ3m3PIfsKBNoVR7yIf2",
  },
  {
    icon: <RedditLogoIcon />,
    label: "Reddit",
    link: "https://www.reddit.com/r/3blue1brown",
  },
  {
    icon: <GithubLogoIcon />,
    label: "GitHub",
    link: "https://github.com/3b1b",
  },
  {
    icon: <RssIcon />,
    label: "RSS",
    link: "https://3blue1brown.substack.com/feed",
  },
  {
    icon: <TelevisionIcon />,
    label: "Bilibili",
    link: "https://space.bilibili.com/88461692",
  },
];

export default function Follow() {
  return (
    <section>
      <hr />
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
