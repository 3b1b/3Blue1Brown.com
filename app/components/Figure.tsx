import clsx from "clsx";
import { renderText } from "~/util/dom";

type Props = {
  image: string;
  alt?: string;
  children?: string;
  className?: string;
};

export default function Figure({ image, alt, children, className }: Props) {
  alt ??= renderText(children);

  return (
    <figure className={clsx("flex flex-col items-center gap-4", className)}>
      <img src={image} alt={alt} className="shadow-md" />
      {children && (
        <figcaption className="text-dark-gray">{children}</figcaption>
      )}
    </figure>
  );
}
