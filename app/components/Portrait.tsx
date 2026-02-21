import clsx from "clsx";
import Link from "~/components/Link";

type Props = {
  image?: string;
  link?: string;
  name?: string;
  description?: string;
  className?: string;
};

// image, name, description, link
export default function Portrait({
  image,
  link = "",
  name,
  description,
  className,
}: Props) {
  return (
    <div
      className={clsx(
        "group flex shrink-0 flex-col items-center gap-1 text-center",
        className,
      )}
    >
      <Link
        to={link}
        className="aspect-square w-full overflow-hidden rounded-full outline-2 outline-offset-2 outline-theme"
      >
        <img
          src={image}
          alt={name}
          className="size-full object-cover transition group-hover:grayscale hover:scale-105"
        />
      </Link>
      {name && <div className="mt-4 font-sans font-medium">{name}</div>}
      {description && <div>{description}</div>}
    </div>
  );
}
