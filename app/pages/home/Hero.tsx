import { useRef, useState } from "react";
import {
  BellIcon,
  EyeIcon,
  NewspaperIcon,
  VideoIcon,
  YoutubeLogoIcon,
} from "@phosphor-icons/react";
import { useInterval } from "@reactuses/core";
import Button from "~/components/Button";
import site from "~/data/site.json";
import { useInView } from "~/util/hooks";
import { formatNumber } from "~/util/string";
import stats from "./stats.json";

// stat entries
const entries = [
  { Icon: VideoIcon, value: stats.videos, label: "videos" },
  { Icon: BellIcon, value: stats.subscribers, label: "subscribers" },
  { Icon: EyeIcon, value: stats.views, label: "views" },
];

// home page hero section
export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);

  const inView = useInView(ref);

  // stat value animation percent
  const [percent, setPercent] = useState(0);

  useInterval(
    // animate to full
    () => setPercent((percent) => percent + (1 - percent) / 20),
    // if in view and not already done
    percent < 0.999 && inView ? 10 : null,
  );

  return (
    <section className="bg-theme/10">
      <div className="grid grid-cols-2 place-items-center gap-12 max-md:grid-cols-1">
        <div
          ref={ref}
          className="grid grid-cols-3 gap-12 self-center bg-linear-to-r from-theme to-success bg-clip-text"
        >
          {entries.map(({ Icon, value, label }, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <Icon className="mb-2 h-12 text-gray" weight="light" />
              <div className="font-sans text-xl text-transparent tabular-nums">
                {formatNumber(percent * value)}
              </div>
              <div className="text-transparent">{label}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4">
          <Button
            to={site.socials.channel}
            color="theme"
            className="w-50 self-center"
          >
            <YoutubeLogoIcon />
            Channel
          </Button>
          <Button
            to={site.socials.newsletter}
            color="theme"
            className="w-50 self-center"
          >
            <NewspaperIcon />
            Mailing list
          </Button>
          {/*<p>Explore, learn, and be curious</p>*/}
        </div>
      </div>
    </section>
  );
}
