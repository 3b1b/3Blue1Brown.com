import clsx from "clsx";

type Props = {
  tags?: string[];
  className?: string;
};

export default function Tags({ tags, className }: Props) {
  if (!tags?.length) return null;

  return (
    <div
      className={clsx(
        "flex flex-wrap justify-center gap-2 font-sans",
        className,
      )}
    >
      {tags.map((tag, index) => (
        <span key={index} className="rounded-full bg-theme/35 px-2">
          {tag}
        </span>
      ))}
    </div>
  );
}
