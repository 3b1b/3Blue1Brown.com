import type { ComponentProps, RefObject } from "react";
import { useEffect, useRef, useState } from "react";
import { UploadIcon } from "@phosphor-icons/react";
import { useEventListener } from "@reactuses/core";
import clsx from "clsx";
import Button from "~/components/Button";

type Props = {
  // formats to accept. array of mime types or extensions w/ dot
  accept?: string[];
  // callback with file
  onUpload: (file: File, name: string, ext: string) => void;
  // drag target ref
  target?: RefObject<HTMLElement | null>;
} & ComponentProps<typeof Button>;

// file dialog or drag & drop button
export default function Upload({
  onUpload,
  target,
  accept = [],
  className,
  children,
  ...props
}: Props) {
  const ref = useRef<HTMLInputElement>(null);

  // upload file
  const upload = async (target: HTMLInputElement | DataTransfer | null) => {
    const file = (target?.files || [])[0];
    if (!file) return;

    // extract filename parts
    const [, name = "", ext = ""] = file.name.match(/(.+)\.(.+)/) || [];

    // pass upload to parent
    onUpload(file, name, ext);

    // reset file input
    if (ref.current) ref.current.value = "";
  };

  // is dragging
  const [drag, setDrag] = useState(false);

  // attach handlers to target
  useEventListener("dragenter", () => setDrag(true), target);
  useEventListener("dragleave", () => setDrag(false), target);
  useEventListener("dragover", (event) => event.preventDefault(), target);
  useEventListener(
    "drop",
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      setDrag(false);
      upload(event.dataTransfer);
    },
    target,
  );

  // visual feedback for drag state
  const dragClassName =
    "outline-2 outline-offset-2 outline-white outline-dashed";

  useEffect(() => {
    if (!target?.current) return;
    if (drag) target.current.classList.add(...dragClassName.split(" "));
    else target.current.classList.remove(...dragClassName.split(" "));
  }, [drag, target]);

  return (
    <>
      <Button
        className={clsx(drag && dragClassName, className)}
        onClick={() => ref.current?.click()}
        {...props}
      >
        <UploadIcon />
        {children}
      </Button>
      <input
        ref={ref}
        type="file"
        accept={accept.join(",")}
        style={{ display: "none" }}
        onChange={(event) => upload(event.target)}
      />
    </>
  );
}
