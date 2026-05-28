import { useCallback, useRef, useState } from "react";
import clsx from "clsx";
import gsap from "gsap";
import { sample } from "lodash-es";
import Canvas from "~/components/Canvas";
import { useHowMuchInView } from "~/util/hooks";
import { Vector } from "~/util/vector";

// size of dots, in px
const radius = 3;
// thickness of lines, in px
const thickness = 1.5;
// spacing of dots, in px
const spacing = 50;
// proportional density of dots
const density = 0.75;
// delete nodes with fewer than this many connections
const minConnections = 2;
// max dots
const limit = 1000;
// baseline duration of animations, in sec
const duration = 4;
// colors
const colorA = "#0088ff";
const colorB = "#ff88ff";
// how much to delay animation of object based on position
const delayEq = (p: Vector) => (Math.sin(4.5 * p.x) + Math.sin(6 * p.y)) / 2;

// triangle grid viz
export default function TriangleGrid({ className = "" }) {
  const ref = useRef<HTMLCanvasElement>(null);

  const [{ dots = [], lines = [] } = {}, setObjects] =
    useState<ReturnType<typeof generate>>();

  // when canvas size changes
  const onChange = useCallback((width: number, height: number) => {
    // use gsap context to efficiently clean up old animations
    const ctx = gsap.context(() => setObjects(generate(width, height)));
    return () => ctx.revert();
  }, []);

  const [, yInView] = useHowMuchInView(ref);

  return (
    <Canvas
      ref={ref}
      className={clsx("absolute inset-0 -z-10 size-full", className)}
      render={(ctx) => {
        // parallax effect
        const offset = yInView * spacing;

        // draw lines
        for (const { from, to, opacity, thickness, color } of lines) {
          ctx.strokeStyle = color;
          ctx.globalAlpha = opacity;
          ctx.lineWidth = thickness;
          ctx.beginPath();
          ctx.moveTo(from.x, from.y + offset);
          ctx.lineTo(to.x, to.y + offset);
          ctx.stroke();
        }

        // draw dots
        for (const { position, opacity, radius, color } of dots) {
          ctx.fillStyle = color;
          ctx.globalAlpha = opacity;
          ctx.beginPath();
          ctx.arc(position.x, position.y + offset, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }}
      onChange={onChange}
    />
  );
}

const makeGraph = <Type,>() => {
  // map nodes to neighbors
  const graph = new Map<Type, Set<Type>>();

  // graph funcs
  const getNodes = () => [...graph.keys()];
  const addNode = (node: Type) => graph.set(node, new Set());
  const addEdge = (node: Type, neighbor: Type) =>
    graph.get(node)?.add(neighbor);
  const removeNode = (node: Type) => {
    for (const neighbors of graph.values()) neighbors.delete(node);
    graph.delete(node);
  };

  return { graph, getNodes, addNode, addEdge, removeNode };
};

// equilateral triangle h/w ratio
const tri = Math.sqrt(3) / 2;

const generate = (width: number, height: number) => {
  // boundaries
  const left = -width / 2;
  const right = width / 2;
  const top = -height / 2;
  const bottom = height / 2;

  const { graph, getNodes, addNode, addEdge, removeNode } = makeGraph<Vector>();

  // generate triangular grid of dots
  let offset = false;
  let xStart = left;
  xStart += (width % (spacing * tri)) / 2;
  for (let x = xStart; x <= right; x += spacing * tri) {
    let yStart = top;
    // offset every other row
    offset = !offset;
    if (offset) yStart += spacing / 2;
    yStart += (height % spacing) / 2;
    for (let y = yStart; y <= bottom; y += spacing) addNode(new Vector(x, y));
  }

  // remove some dots at random
  for (const node of graph.keys()) {
    const dist = node.scale(1 / width, 1 / height).length() * 2;
    // favor removing dots near center
    if (Math.random() > dist * density) removeNode(node);
  }

  // link adjacent dots
  for (const node of getNodes())
    for (const neighbor of getNodes())
      if (node !== neighbor)
        if (node.distance(neighbor) < (1.1 * spacing) / tri)
          addEdge(node, neighbor);

  // remove isolated nodes
  for (let tries = 0; tries < 10000; tries++) {
    const isolated = getNodes().find(
      (node) => (graph.get(node)?.size ?? 0) < minConnections,
    );
    if (!isolated) break;
    removeNode(isolated);
  }

  // hard limit dots for performance
  for (let tries = 0; tries < 10000; tries++) {
    if (graph.size < limit) break;
    const node = sample(getNodes());
    if (!node) break;
    removeNode(node);
  }

  // remove double links
  for (const node of getNodes())
    for (const neighbor of getNodes())
      if (node !== neighbor)
        if (graph.get(node)?.has(neighbor) && graph.get(neighbor)?.has(node))
          graph.get(neighbor)?.delete(node);

  // flatten graph for rendering
  const dots = getNodes().map((node) => ({
    position: node,
    // normalize to [-1,1]
    normalized: node.scale(2 / width, 2 / height),
    // animatable properties
    opacity: 0,
    radius: 0,
    color: colorA,
  }));
  const lines = getNodes()
    .map((node) =>
      [...(graph.get(node)?.values() ?? [])].map((neighbor) => ({
        from: node,
        to: neighbor,
        // midpoint, normalize to [-1,1]
        normalized: node.add(neighbor).scale(1 / width, 1 / height),
        // animatable properties
        opacity: 0,
        thickness: 0,
        color: colorA,
      })),
    )
    .flat();

  // set animation defaults
  gsap.defaults({ ease: "sine.inOut" });

  // animate dots
  for (const dot of dots) {
    const delay = delayEq(dot.normalized) * duration;
    gsap
      .timeline({ repeat: -1, yoyo: true, delay })
      .to(dot, { opacity: 1, radius, duration });
    gsap
      .timeline({ repeat: -1, delay })
      .to(dot, { color: colorB, duration: duration * 2 });
  }

  // animate lines
  for (const line of lines) {
    const delay = delayEq(line.normalized) * duration;
    gsap
      .timeline({ repeat: -1, yoyo: true, delay })
      .to(line, { opacity: 1, thickness, duration });
    gsap
      .timeline({ repeat: -1, yoyo: true, delay })
      .to(line, { color: colorB, duration: duration * 2 });
  }

  return { dots, lines };
};
