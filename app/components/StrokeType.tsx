import type { ComponentProps } from "react";

type Props = {
  delay?: number;
  duration?: number;
  children: string;
} & Omit<ComponentProps<"span">, "children">;

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
          className="stroke-type"
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
