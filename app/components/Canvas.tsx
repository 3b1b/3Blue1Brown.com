import type { ComponentProps } from "react";
import { useEffect, useEffectEvent, useRef } from "react";
import {
  useDebounce,
  useElementSize,
  useMergedRefs,
  useRafFn,
} from "@reactuses/core";
import { mean } from "d3";
import { clamp } from "lodash-es";
import { now } from "~/util/async";
import { useBeenInView, useInView } from "~/util/hooks";

// max canvas buffer width/height, in px, to avoid memory crashes
const maxWidth = 4000;
const maxHeight = 2000;

type Props = {
  // how many canvas buffer pixels to draw per css/dom pixel, i.e. devicePixelRatio
  oversample?: number;
  // render frame
  render: (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    delta: number,
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

  // time tracking
  const last = useRef(0);
  const deltas = useRef<number[]>([]);

  // size of canvas, in css/dom px, debounced
  const [_width, _height] = useElementSize(canvas, { box: "border-box" });
  const clientWidth = useDebounce(clamp(_width, 0, maxWidth), 100);
  const clientHeight = useDebounce(clamp(_height, 0, maxHeight), 100);

  // is canvas in view
  const inView = useInView(canvas);
  const beenInView = useBeenInView(canvas);

  // init context
  useEffect(() => {
    ctx.current ??= canvas.current?.getContext("2d") ?? null;
  }, []);

  // render frame
  useRafFn(() => {
    if (!canvas.current || !ctx.current || !inView) {
      last.current = 0;
      deltas.current = [];
      return;
    }

    // clear canvas
    ctx.current.clearRect(
      -clientWidth / 2,
      -clientHeight / 2,
      clientWidth,
      clientHeight,
    );

    // calculate time delta
    const delta = last.current ? now() - last.current : 0;
    last.current = now();
    deltas.current.unshift(delta);
    deltas.current.splice(100);
    const smoothedDelta = mean(deltas.current) ?? 0;

    // call render func
    render(ctx.current, clientWidth, clientHeight, smoothedDelta);
  });

  // prevent onChange from being dep of useEffect
  const _onChange = useEffectEvent(onChange);

  // re-init canvas
  useEffect(() => {
    if (!canvas.current || !ctx.current) return;
    if (!beenInView) return;
    // canvas buffer size, in px
    const bufferWidth = clientWidth * oversample;
    const bufferHeight = clientHeight * oversample;
    // set canvas buffer size
    canvas.current.width = bufferWidth;
    canvas.current.height = bufferHeight;
    // start new transform
    ctx.current.resetTransform();
    // center (0,0)
    ctx.current.translate(bufferWidth / 2, bufferHeight / 2);
    // scale for oversampling
    ctx.current.scale(oversample, oversample);
    // notify parent of new size
    _onChange?.(clientWidth, clientHeight);
  }, [clientWidth, clientHeight, beenInView, oversample]);

  // combine local and passed refs
  const mergedRef = useMergedRefs(canvas, passedRef);

  return <canvas ref={mergedRef} aria-hidden="true" {...props} />;
}
