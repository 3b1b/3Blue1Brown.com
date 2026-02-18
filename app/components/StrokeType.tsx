import type { ComponentProps } from "react";

type Props = {
  children: string;
} & ComponentProps<"span">;

export default function StrokeType({ children, ...props }: Props) {
  const chars = children.split("");

  return (
    <span {...props}>
      {chars.map((char, index) => (
        <span
          key={index}
          className="stroke-type"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {char}
        </span>
      ))}
    </span>
  );
}
