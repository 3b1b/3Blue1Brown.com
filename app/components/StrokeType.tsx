type Props = {
  // delay, in sec
  delay?: number;
  // duration, in sec
  duration?: number;
  // class on root
  className?: string;
  // text content to animate
  children: string;
};

// loose emulation of manim "DrawBorderThenFill"
export default function StrokeType({
  delay = 0,
  duration = 1,
  className,
  children,
}: Props) {
  const chars = children.split("");

  return (
    <span className={className}>
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
