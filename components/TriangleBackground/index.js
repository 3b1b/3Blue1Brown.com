import { useEffect, useId, useRef, useState } from "react";
import styles from "./index.module.scss";

// params
const width = 1600;
const height = 300;
const radius = 3;
const spacing = 50;
const density = 0.75;
const minConnections = 3;
const duration = 10;
const opacity = 0.5;
const glowSize = 10;
const glowAmount = 3;
const delay = (x, y) => (Math.sin(9 * x) + Math.sin(12 * y)) / 2;

// boundaries
const left = -width / 2;
const right = width / 2;
const top = -height / 2;
const bottom = height / 2;

// equilateral triangle h/w ratio
const tri = Math.sqrt(3) / 2;

// map nodes to neighbors
const graph = new Map();

// graph funcs
const addNode = (node) => graph.set(node, new Set());
const addEdge = (node, neighbor) => graph.get(node).add(neighbor);
const removeNode = (node) => {
  for (const neighbors of graph.values()) neighbors.delete(node);
  graph.delete(node);
};

export default function HexBG() {
  const ref = useRef();
  const id = useId();
  const [dots, setDots] = useState([]);
  const [lines, setLines] = useState([]);

  useEffect(() => {
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
      for (let y = yStart; y <= bottom; y += spacing) addNode({ x, y });
    }

    // remove some points at random
    for (const node of graph.keys())
      if (Math.random() > density) removeNode(node);

    // link adjacent points
    for (const node of graph.keys())
      for (const neighbor of graph.keys())
        if (node !== neighbor)
          if (
            Math.hypot(node.x - neighbor.x, node.y - neighbor.y) <
            (1.1 * spacing) / tri
          )
            addEdge(node, neighbor);

    // remove isolated nodes
    let isolated = {};
    while (!!isolated && graph.size > 0) {
      const isolated = graph
        .keys()
        .find((node) => graph.get(node).size < minConnections);
      if (!isolated) break;
      removeNode(isolated);
    }

    // remove double edges
    for (const node of graph.keys())
      for (const neighbor of graph.keys())
        if (node !== neighbor)
          if (graph.get(node).has(neighbor) && graph.get(neighbor).has(node))
            graph.get(neighbor).delete(node);

    // flatten graph for rendering
    const dots = [
      ...graph.keys().map(({ x, y }) => ({
        x,
        y,
        // normalize to [-1,1]
        normX: x / (width / 2),
        normY: y / (height / 2),
      })),
    ];
    const lines = [
      ...graph.keys().map((node) => [
        ...graph
          .get(node)
          .values()
          .map((neighbor) => ({
            x1: node.x,
            y1: node.y,
            x2: neighbor.x,
            y2: neighbor.y,
            // midpoint, normalize to [-1,1]
            normX: (node.x + neighbor.x) / 2 / (width / 2),
            normY: (node.y + neighbor.y) / 2 / (height / 2),
          })),
      ]),
    ].flat();

    setDots(dots);
    setLines(lines);
  }, []);

  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={[left, top, width, height].join(" ")}
      preserveAspectRatio="xMidYMid slice"
    >
      <filter
        id={id}
        colorInterpolationFilters="linearRGB"
        filterUnits="objectBoundingBox"
        primitiveUnits="userSpaceOnUse"
      >
        <feGaussianBlur
          in="SourceGraphic"
          stdDeviation={glowSize}
          result="blur"
        />
        <feComponentTransfer in="blur" result="glow">
          <feFuncA type="linear" slope={glowAmount} intercept="0" />
        </feComponentTransfer>
        <feBlend in="SourceGraphic" in2="glow" mode="screen" />
      </filter>

      <rect x={left} y={top} width={width} height={height} fill="black" />

      <g filter={`url(#${id})`}>
        <g stroke="currentColor">
          {lines.map(({ x1, y1, x2, y2, normX, normY }, index) => (
            <line
              key={index}
              className={styles.pulse}
              style={{
                animationDuration: `${duration}s`,
                animationDelay: `${delay(normX, normY) * duration}s`,
              }}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              opacity={opacity * Math.hypot(normX, normY)}
            />
          ))}
        </g>

        <g fill="currentColor">
          {dots.map(({ x, y, normX, normY }, index) => (
            <circle
              key={index}
              className={styles.pulse}
              style={{
                animationDuration: `${duration}s`,
                animationDelay: `${delay(normX, normY) * duration}s`,
              }}
              cx={x}
              cy={y}
              r={radius}
              opacity={opacity * Math.hypot(normX, normY)}
            />
          ))}
        </g>
      </g>
    </svg>
  );
}
