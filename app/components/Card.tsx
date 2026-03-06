import type { ComponentProps, ReactNode } from "react";
import { CheckCircleIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import Link from "~/components/Link";

type Props = {
  // image source
  image?: string;
  // title content
  title?: ReactNode;
  // secondary content
  description?: ReactNode;
  // active state
  active?: boolean;
  // tertiary content
  children?: ReactNode;
} & Omit<ComponentProps<typeof Link>, "title" | "children">;

// big clickable button with image and text
export default function Card({
  image,
  title,
  description,
  children,
  active,
  className,
  ...props
}: Props) {
  return (
    <Link
      arrow={false}
      className={clsx(
        "group relative isolate flex flex-col items-center justify-start gap-4 text-center text-balance text-black no-underline outline-none hocus:scale-102",
        className,
      )}
      aria-current={active}
      {...props}
    >
      {/* do bg as inner el w/ expansion, so other els line up with surroundings */}
      <div className="absolute -inset-2 -z-10 rounded-md group-hocus-ring transition group-hocus:bg-theme/10" />

      {image && (
        <img src={image} alt="" className={clsx(active && "opacity-50")} />
      )}
      {title && (
        <div className="flex items-center gap-2 font-sans text-lg font-medium">
          {title}
        </div>
      )}
      {description && <div className="line-clamp-3">{description}</div>}
      {active && (
        <div className="absolute -top-4 -right-4 grid size-8 place-items-center rounded-full bg-theme text-white">
          <CheckCircleIcon />
        </div>
      )}
      {children}
    </Link>
  );
}
