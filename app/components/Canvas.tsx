import type { ComponentProps } from "react";
import { useEffect, useRef } from "react";
import {
  useDebounce,
  useElementSize,
  useMergedRefs,
  useRafFn,
} from "@reactuses/core";
import { useInView } from "~/util/hooks";

type Props = {
  scale?: number;
  render: (ctx: CanvasRenderingContext2D) => void;
  onChange?: (width: number, height: number) => (() => void) | void;
} & Omit<ComponentProps<"canvas">, "onChange">;

// general canvas component that handles animation loop, resizing, and etc.
export default function Canvas({
  ref,
  scale = 1,
  render,
  onChange,
  ...props
}: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const ctx = useRef<CanvasRenderingContext2D>(null);

  if (typeof window !== "undefined") scale *= window.devicePixelRatio || 1;

  // size of canvas in dom
  const [_width, _height] = useElementSize(canvas, { box: "border-box" });
  const width = useDebounce(_width, 100) * scale;
  const height = useDebounce(_height, 100) * scale;

  // is canvas in view
  const inView = useInView(canvas);

  // init context
  useEffect(() => {
    ctx.current ??= canvas.current?.getContext("2d") ?? null;
  }, []);

  // render frame
  useRafFn(() => {
    if (!canvas.current || !ctx.current) return;
    ctx.current.clearRect(
      -width / 2,
      -height / 2,
      canvas.current.width,
      canvas.current.height,
    );
    render(ctx.current);
  });

  // re-init canvas
  useEffect(() => {
    if (!canvas.current || !ctx.current) return;
    if (!inView) return;
    const cleanup = onChange?.(width * 2, height * 2);
    canvas.current.width = width;
    canvas.current.height = height;
    ctx.current.resetTransform();
    ctx.current.translate(width / 2, height / 2);
    return cleanup;
  }, [width, height, inView, onChange]);

  const refs = useMergedRefs(canvas, ref);

  return <canvas ref={refs} {...props} />;
}
