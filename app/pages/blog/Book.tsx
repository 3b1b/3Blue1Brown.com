import type { ReactNode } from "react";
import Card from "~/components/Card";

type Props = {
  title: string;
  author: string;
  link: string;
  image: string;
  children?: ReactNode;
};

export default function Book({ title, author, link, image, children }: Props) {
  return (
    <div className="flex flex-col gap-8">
      <Card to={link} className="bg-light-gray">
        <img src={image} alt={title} className="h-50" />
      </Card>
      <strong className="font-medium">{title}</strong>
      <em className="-mt-4">{author}</em>
      {children}
    </div>
  );
}
