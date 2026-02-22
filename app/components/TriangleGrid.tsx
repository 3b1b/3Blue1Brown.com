import { useCallback, useRef, useState } from "react";
import gsap from "gsap";
import { clamp, sample } from "lodash-es";
import Canvas from "~/components/Canvas";
import glow from "~/components/glow.svg?inline";
import { useParallax } from "~/util/hooks";
import { Vector } from "~/util/vector";

// params
const radius = 6;
const thickness = 3;
const spacing = 100;
const density = 8;
const minConnections = 1;
const duration = 4;
const colorA = "#0088ff";
const colorB = "#ff88ff";
const delayEq = (x = 0, y = 0) => (Math.sin(9 * x) + Math.sin(12 * y)) / 2;

gsap.defaults({ ease: "power1.inOut" });

export default function TriangleGrid() {
  const ref = useRef<HTMLCanvasElement>(null);
  const percent = useParallax(ref);

  const [{ dots = [], lines = [] } = {}, setObjects] =
    useState<ReturnType<typeof generate>>();

  const onChange = useCallback((width: number, height: number) => {
    const ctx = gsap.context(() => setObjects(generate(width, height)));
    return () => ctx.revert();
  }, []);

  return (
    <Canvas
      ref={ref}
      className="absolute inset-0 -z-10 size-full mask-radial-from-transparent mask-radial-from-0% mask-radial-to-white mask-radial-to-100%"
      style={{
        translate: `0 ${-percent * 10}%`,
        scale: 1.1,
        filter: `url("${glow}#filter")`,
      }}
      render={(ctx) => {
        for (const { x1, y1, x2, y2, opacity, thickness, color } of lines) {
          ctx.strokeStyle = color;
          ctx.globalAlpha = opacity;
          ctx.lineWidth = thickness;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
        for (const { x, y, opacity, radius, color } of dots) {
          ctx.fillStyle = color;
          ctx.globalAlpha = opacity;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
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
  const { graph, getNodes, addNode, addEdge, removeNode } = makeGraph<Vector>();

  // boundaries
  const left = -width / 2;
  const right = width / 2;
  const top = -height / 2;
  const bottom = height / 2;

  // generate triangular grid of points
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

  // make limit proportional to area
  const limit = clamp((density / 80000) * (width * height), 10, 1000);

  console.log(limit);

  // hard limit points
  for (let tries = 0; tries < 10000; tries++) {
    // if under limit, done
    if (graph.size < limit) break;
    // pick random node
    const node = sample(getNodes());
    if (!node) break;
    // favor removing points near center
    const dist = node.divide(width, height).length() * 2;
    if (dist < Math.random()) removeNode(node);
  }

  // link adjacent points
  for (const node of getNodes())
    for (const neighbor of getNodes())
      if (node !== neighbor)
        if (node.distanceTo(neighbor) < (1.1 * spacing) / tri)
          addEdge(node, neighbor);

  // remove isolated nodes
  while (graph.size > 0) {
    const isolated = getNodes().find(
      (node) => (graph.get(node)?.size ?? 0) < minConnections,
    );
    if (!isolated) break;
    removeNode(isolated);
  }

  // remove double links
  for (const node of getNodes())
    for (const neighbor of getNodes())
      if (node !== neighbor)
        if (graph.get(node)?.has(neighbor) && graph.get(neighbor)?.has(node))
          graph.get(neighbor)?.delete(node);

  // flatten graph for rendering
  const dots = getNodes().map(({ x, y }) => ({
    x,
    y,
    // normalize to [-1,1]
    normX: x / (width / 2),
    normY: y / (height / 2),
    // animatable properties
    opacity: 0,
    radius: 0,
    color: colorA,
  }));
  const lines = getNodes()
    .map((node) =>
      [...(graph.get(node)?.values() ?? [])].map((neighbor) => ({
        x1: node.x,
        y1: node.y,
        x2: neighbor.x,
        y2: neighbor.y,
        // midpoint, normalize to [-1,1]
        normX: (node.x + neighbor.x) / 2 / (width / 2),
        normY: (node.y + neighbor.y) / 2 / (height / 2),
        // animatable properties
        opacity: 0,
        thickness: 0,
        color: colorA,
      })),
    )
    .flat();

  // animate
  for (const dot of dots) {
    const delay = delayEq(dot.normX, dot.normY) * duration;
    gsap
      .timeline({ repeat: -1, yoyo: true, delay })
      .to(dot, { opacity: 1, radius, duration });
    gsap
      .timeline({ repeat: -1, delay })
      .to(dot, { color: colorB, duration: duration * 2 });
  }
  for (const line of lines) {
    const delay = delayEq(line.normX, line.normY) * duration;
    gsap
      .timeline({ repeat: -1, yoyo: true, delay })
      .to(line, { opacity: 1, thickness, duration });
    gsap
      .timeline({ repeat: -1, yoyo: true, delay })
      .to(line, { color: colorB, duration: duration * 2 });
  }

  return { dots, lines };
};
