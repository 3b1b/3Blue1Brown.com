import type { ComponentProps } from "react";
import { useEffect, useEffectEvent, useRef } from "react";
import {
  useDebounce,
  useElementSize,
  useMergedRefs,
  useRafFn,
} from "@reactuses/core";
import { clamp } from "lodash-es";
import { useBeenInView, useInView } from "~/util/hooks";

// max canvas width/height, in px
const maxSize = 4000;

type Props = {
  // how many canvas buffer pixels to draw per css pixel, i.e. devicePixelRatio
  oversample?: number;
  // render frame
  render: (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
  ) => void;
  // called when canvas size changes, return cleanup function if needed
  onChange?: (width: number, height: number) => (() => void) | void;
} & Omit<ComponentProps<"canvas">, "onChange">;

// generic canvas that handles animation loop, resizing, and etc.
export default function Canvas({
  ref: passedRef,
  oversample = 2,
  render,
  onChange = () => {},
  ...props
}: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const ctx = useRef<CanvasRenderingContext2D>(null);

  // size of canvas in dom
  const [_width, _height] = useElementSize(canvas, { box: "border-box" });
  const width = useDebounce(_width, 100);
  const height = useDebounce(_height, 100);

  // is canvas in view
  const inView = useInView(canvas);
  const beenInView = useBeenInView(canvas);

  // init context
  useEffect(() => {
    ctx.current ??= canvas.current?.getContext("2d") ?? null;
  }, []);

  // render frame
  useRafFn(() => {
    if (!canvas.current || !ctx.current) return;
    if (!inView) return;
    ctx.current.clearRect(
      -width / 2,
      -height / 2,
      canvas.current.width,
      canvas.current.height,
    );
    render(ctx.current, width, height);
  });

  // prevent onChange from being dep of useEffect
  const _onChange = useEffectEvent(onChange);

  // re-init canvas
  useEffect(() => {
    if (!canvas.current || !ctx.current) return;
    if (!beenInView) return;
    // set canvas buffer size, hard clamp to prevent perf issues
    canvas.current.width = clamp(width * oversample, 0, maxSize);
    canvas.current.height = clamp(height * oversample, 0, maxSize);
    ctx.current.resetTransform();
    // center (0,0)
    ctx.current.translate((width * oversample) / 2, (height * oversample) / 2);
    // scale for oversampling
    ctx.current.scale(oversample, oversample);
    _onChange?.(width, height);
  }, [width, height, beenInView, oversample]);

  // combine local and passed refs
  const mergedRef = useMergedRefs(canvas, passedRef);

  return <canvas ref={mergedRef} aria-hidden="true" {...props} />;
}
