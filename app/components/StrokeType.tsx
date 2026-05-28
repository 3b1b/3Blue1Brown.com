import type { ComponentProps } from "react";
import classes from "./StrokeType.module.css";

type Props = {
  // delay, in sec
  delay?: number;
  // duration, in sec
  duration?: number;
  // text content to animate
  children: string;
} & ComponentProps<"span">;

// loose emulation of manim "DrawBorderThenFill"
export default function StrokeType({
  delay = 0,
  duration = 1,
  children,
  ...props
}: Props) {
  const chars = children.split("");

  return (
    <span {...props}>
      {chars.map((char, index) => (
        <span
          key={index}
          className={classes["stroke-type"]}
          style={{
            animationDelay: `${delay + index * (duration / chars.length)}s`,
          }}
        >
          {char}
        </span>
      ))}
    </span>
  );
}
