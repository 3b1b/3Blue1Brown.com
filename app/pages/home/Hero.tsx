import { useRef, useState } from "react";
import {
  BellIcon,
  EyeIcon,
  NewspaperIcon,
  VideoIcon,
  YoutubeLogoIcon,
} from "@phosphor-icons/react";
import { useInterval } from "@reactuses/core";
import clsx from "clsx";
import Button from "~/components/Button";
import site from "~/data/site.json";
import { useInView } from "~/util/hooks";
import { formatNumber } from "~/util/string";
import stats from "./stats.json";

// stat entries
const entries = [
  {
    Icon: VideoIcon,
    value: stats.videos,
    label: "videos",
    className: "text-theme",
  },
  {
    Icon: BellIcon,
    value: stats.subscribers,
    label: "subscribers",
    className:
      "text-[color-mix(in_oklch,var(--color-theme)_50%,var(--color-success))]",
  },
  {
    Icon: EyeIcon,
    value: stats.views,
    label: "views",
    className: "text-success",
  },
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
        <div ref={ref} className="grid grid-cols-3 gap-12 self-center">
          {entries.map(({ Icon, value, label, className }, index) => (
            <div
              key={index}
              className={clsx("flex flex-col items-center", className)}
            >
              <Icon className="mb-4 h-10" weight="light" />
              <div className="font-sans text-xl tabular-nums">
                {formatNumber(percent * value)}
              </div>
              <div className="font-sans">{label}</div>
            </div>
          ))}
        </div>

        <div className="flex w-50 flex-col gap-4">
          <Button to={site.socials.channel} color="theme">
            <YoutubeLogoIcon />
            Channel
          </Button>
          <Button to={site.socials.newsletter} color="light">
            <NewspaperIcon />
            Mailing List
          </Button>
        </div>
      </div>
    </section>
  );
}
