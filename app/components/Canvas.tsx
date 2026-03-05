import type { ComponentProps } from "react";
import { useEffect, useEffectEvent, useRef } from "react";
import {
  useDebounce,
  useElementSize,
  useMergedRefs,
  useRafFn,
} from "@reactuses/core";
import { clamp } from "lodash-es";
import { useInView } from "~/util/hooks";

type Props = {
  // pixel density
  scale?: number;
  // render one frame
  render: (ctx: CanvasRenderingContext2D) => void;
  // called when canvas size changes, return cleanup function if needed
  onChange?: (width: number, height: number) => (() => void) | void;
} & Omit<ComponentProps<"canvas">, "onChange">;

// general canvas component that handles animation loop, resizing, and etc.
export default function Canvas({
  ref,
  scale = 2,
  render,
  onChange = () => {},
  ...props
}: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const ctx = useRef<CanvasRenderingContext2D>(null);

  // size of canvas in dom
  const [_width, _height] = useElementSize(canvas, { box: "border-box" });
  let width = useDebounce(_width, 100) * scale;
  let height = useDebounce(_height, 100) * scale;

  // hard limit size
  width = clamp(width, 1, 4000);
  height = clamp(height, 1, 2000);

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

  // prevent onChange from being dep of useEffect
  const _onChange = useEffectEvent(onChange);

  // re-init canvas
  useEffect(() => {
    if (!canvas.current || !ctx.current) return;
    if (!inView) return;
    const cleanup = _onChange?.(width * 2, height * 2);
    canvas.current.width = width;
    canvas.current.height = height;
    ctx.current.resetTransform();
    ctx.current.translate(width / 2, height / 2);
    return cleanup;
  }, [width, height, inView]);

  const refs = useMergedRefs(canvas, ref);

  return <canvas ref={refs} {...props} />;
}
