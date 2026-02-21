import type { ReactNode } from "react";
import Link from "~/components/Link";

type Props = {
  title: string;
  author: string;
  link: string;
  image: string;
  children?: ReactNode;
};

export default function Book({ title, author, link, image, children }: Props) {
  return (
    <div className="flex flex-col gap-8 no-underline">
      <Link
        to={link}
        arrow={false}
        className="aspect-video w-full overflow-hidden bg-gray/10 hover-ring"
      >
        <img src={image} alt={title} className="size-full object-contain" />
      </Link>
      <strong className="font-medium">{title}</strong>
      <em className="-mt-4">{author}</em>
      {children}
    </div>
  );
}
