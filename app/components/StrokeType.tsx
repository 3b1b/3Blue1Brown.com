type Props = {
  delay?: number;
  duration?: number;
  children: string;
  className?: string;
};

// loose emulation of manim "DrawBorderThenFill"
export default function StrokeType({
  delay = 0,
  duration = 1,
  children,
  className,
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
