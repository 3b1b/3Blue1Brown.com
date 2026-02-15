import type { ComponentProps } from "react";
import { useEffect, useRef } from "react";
import {
  useDebounce,
  useElementSize,
  useMergedRefs,
  useRafFn,
} from "@reactuses/core";

type Props = {
  scale?: number;
  render: (ctx: CanvasRenderingContext2D) => void;
  onResize?: (width: number, height: number) => (() => void) | void;
} & ComponentProps<"canvas">;

// general canvas component that handles animation loop, resizing, and etc.
export default function Canvas({
  ref,
  scale = 1,
  render,
  onResize,
  ...props
}: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const ctx = useRef<CanvasRenderingContext2D>(null);

  if (typeof window !== "undefined") scale *= window.devicePixelRatio || 1;

  // size of canvas in dom
  const [_width, _height] = useElementSize(canvas, { box: "border-box" });
  const width = useDebounce(_width, 100) * scale;
  const height = useDebounce(_height, 100) * scale;

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

  // on resize
  useEffect(() => {
    const cleanup = onResize?.(width * 2, height * 2);
    if (!canvas.current || !ctx.current) return;
    canvas.current.width = width;
    canvas.current.height = height;
    ctx.current.resetTransform();
    ctx.current.translate(width / 2, height / 2);
    return cleanup;
  }, [width, height, onResize]);

  const refs = useMergedRefs(canvas, ref);

  return <canvas ref={refs} {...props} />;
}
