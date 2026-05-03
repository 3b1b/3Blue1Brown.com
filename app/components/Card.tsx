import type { ComponentProps, ReactNode } from "react";
import clsx from "clsx";
import Link from "~/components/Link";

type Props = {
  // layout direction
  direction?: "row" | "column";
  // image source
  image?: string;
  // title content
  title?: ReactNode;
  // secondary content
  description?: ReactNode;
  // tertiary content
  children?: ReactNode;
} & Omit<ComponentProps<typeof Link>, "title" | "children">;

// big clickable button with image and text
export default function Card({
  direction = "column",
  image,
  title,
  description,
  children,
  className,
  ...props
}: Props) {
  return (
    <Link
      arrow={false}
      className={clsx(
        "group relative isolate grid rounded-md text-black no-underline outline-none hocus:scale-101",
        direction === "row"
          ? "grid-cols-3 gap-8 max-md:grid-cols-2 max-sm:grid-cols-1"
          : "grid-cols-1 content-start gap-4 text-center text-balance",
        className,
      )}
      {...props}
    >
      {/* do bg as inner el w/ expansion, so following elements line up with surroundings */}
      <div className="absolute -inset-2 -z-10 rounded-md group-hocus-ring transition group-hocus:bg-theme/15" />

      {image && <img src={image} alt="" />}

      <div
        className={clsx(
          "flex flex-col gap-2",
          direction === "row"
            ? "col-span-2 items-start justify-center max-md:col-span-1"
            : "items-center",
        )}
      >
        {title && (
          <div className="flex items-center gap-2 font-sans text-lg font-medium">
            {title}
          </div>
        )}
        {description && <div className="line-clamp-2">{description}</div>}
        {children}
      </div>
    </Link>
  );
}
