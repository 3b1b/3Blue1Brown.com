/*
  This interactive works, but it isn't exactly a shining example of elegant code.

  I don't expect this to be edited a whole lot going forward, so I don't think
  it's worth taking the time to make the code beautiful. (Hopefully this doesn't come
  back to bite me.)

  So instead, here are a few noteworthy quirks to be aware of if you dive into this:
  - The entire interface is just one big SVG with event handlers to make it interactive.
    I chose to use an SVG because positioning everything with CSS sounds kind of nightmarish.

  - The entire animation process happens with pure CSS transitions. The only javascript
    involved is a single boolean called "animating" that turns on when the animation
    begins. I use transition-delay to orchestrate all the changes over time, so that not
    everything appears immediately when "animating" becomes true. I can't decide if this
    solution is really elegant or really ugly.

  - This was originally written as pretty much just one giant component that rendered
    everything. I've since split it up into smaller components, but the concerns aren't
    really separated as much as they should be. These components aren't really reusable;
    they're designed to do one thing and one thing only. In an ideal world, you might
    split these components up more nicely so they aren't quite as intertwined.
*/

import { useState, useEffect, useCallback, useMemo } from "react";
import { threeImage, weights, biases } from "./data";

// This array defines which neurons are visible on screen.
// The null values indicate empty spaces (where the ... lives)
// It is used by many components, along with...
const visibleNeurons = [
  [0, 1, 2, 3, 4, 5, null, null, 778, 779, 780, 781, 782, 783],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
];

// ...this function, which spits out the on-screen x/y coordinates
// of a given neuron in the array above.
function getNeuronPosition(layerIndex, visibleNeuronIndex) {
  const visibleNeuronsInLayer = visibleNeurons[layerIndex].length;
  return {
    x: 230 + 115 * layerIndex,
    y: 240 + 28 * (visibleNeuronIndex - (visibleNeuronsInLayer - 1) / 2),
  };
}

export default function NeuralNetworkInteractive({ instant = false }) {
  const [points, setPoints] = useState(threeImage);
  const [isNormalized, setIsNormalized] = useState(true);
  const [normalizing, setNormalizing] = useState(false);

  const [animating, setAnimating] = useState(false);

  // Update neuron values based on points the user draws
  const [neurons, setNeurons] = useState(getNeuronValues(points));
  useEffect(() => {
    if (instant || animating) {
      setNeurons(getNeuronValues(points));
    }
  }, [points, instant, animating]);

  const normalizePointsAnimated = (duration = 1.0) => {
    setNormalizing(true);

    const data = collectNormalizationData(points);

    const startTime = Date.now();
    const ease = (t) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

    return new Promise((resolve) => {
      const frame = () => {
        const t = (Date.now() - startTime) / 1000;

        const newPoints = applyNormalizationTransformation(
          points,
          data,
          ease(Math.min(1, t / duration))
        );
        setPoints(newPoints);
        setIsNormalized(true);

        if (t < duration) {
          requestAnimationFrame(frame);
        } else {
          setNormalizing(false);
          resolve();
        }
      };

      frame();
    });
  };

  function animate() {
    setAnimating(false);

    if (isNormalized) {
      setTimeout(() => setAnimating(true), 1);
    } else {
      normalizePointsAnimated().then(() => {
        setTimeout(() => setAnimating(true), 200);
      });
    }
  }

  const [selectedNeuron, setSelectedNeuron] = useState(null);

  return (
    <svg
      width={640}
      height={480}
      viewBox="0 0 640 480"
      style={{
        display: "block",
        maxWidth: "none",
        touchAction: "none", // Prevent scrolling on mobile while drawing
      }}
    >
      <NeuronConnections
        selectedNeuron={selectedNeuron}
        animating={animating}
        instant={instant}
      />

      <VerticalEllipsis cx={230} cy={240} />

      <Neurons
        neurons={neurons}
        selectedNeuron={selectedNeuron}
        setSelectedNeuron={setSelectedNeuron}
        animating={animating}
        instant={instant}
      />

      <OutputDigitLabels />

      <WinningOutputNeuronBox
        neurons={neurons}
        animating={animating}
        instant={instant}
      />

      {/* Weight grid for neurons in 2nd layer */}
      {selectedNeuron &&
        selectedNeuron.layerIndex === 1 &&
        (() => {
          const position = getNeuronPosition(
            selectedNeuron.layerIndex,
            selectedNeuron.neuronId
          );

          return (
            <WeightGrid
              x={position.x + 20}
              y={-40 + (position.y - 240) * 0.85 + 240}
              width={85}
              height={85}
              weights={weights[0][selectedNeuron.neuronId]}
              inputNeurons={neurons[0]}
            />
          );
        })()}

      <PiCreature animating={animating} instant={instant} />

      {/* Black background while drawing (covers everything else) */}
      {!instant && (
        <rect
          x="0"
          y="0"
          width="640"
          height="480"
          fill="black"
          style={{
            opacity: animating ? 0.0 : 1.0,
            pointerEvents: animating ? "none" : undefined,
            transition: "opacity 300ms ease-in-out",
          }}
        />
      )}

      <ImageGrid
        instant={instant}
        editing={!animating || instant}
        startEditing={() => {
          setAnimating(false);
          setPoints([]);
          setIsNormalized(false);
        }}
        x={animating || instant ? 10 : 125}
        y={animating || instant ? 10 : 10}
        width={animating || instant ? 190 : 390}
        height={animating || instant ? 190 : 390}
        points={points}
        setPoints={(newPoints) => {
          setPoints(newPoints);
          setIsNormalized(false);
        }}
        normalizing={normalizing}
        isNormalized={isNormalized}
        normalizePointsAnimated={normalizePointsAnimated}
        style={{
          transition: "transform 500ms ease-in-out",
        }}
        beginAnimation={animate}
        highlightedTile={
          selectedNeuron && selectedNeuron.layerIndex === 0
            ? selectedNeuron.neuronId
            : null
        }
      />
    </svg>
  );
}

function NeuronConnections({ selectedNeuron, animating, instant }) {
  let connections = [];

  for (let layerIndex = 1; layerIndex < visibleNeurons.length; layerIndex++) {
    const layer = visibleNeurons[layerIndex];

    const prevLayerIndex = layerIndex - 1;
    const prevLayer = visibleNeurons[prevLayerIndex];

    layer.forEach((neuronId, neuronIndex) => {
      if (neuronId === null) return;

      prevLayer.forEach((prevNeuronId, prevNeuronIndex) => {
        if (prevNeuronId === null) return;

        const weight = weights[prevLayerIndex][neuronId][prevNeuronId];

        const layerIsHighlighted = selectedNeuron?.layerIndex === layerIndex;

        const neuronIsHighlighted =
          layerIsHighlighted && selectedNeuron?.neuronId === neuronId;

        const maxAlpha = neuronIsHighlighted
          ? 1.0
          : layerIsHighlighted
          ? 0.1
          : 0.3;
        const alpha = maxAlpha * Math.abs(weight * 0.6);
        const color =
          weight < 0
            ? `rgba(252, 98, 85, ${alpha})`
            : `rgba(88, 196, 221, ${alpha})`;
        const lineWidth = neuronIsHighlighted ? 3 : 1;

        const prevNeuronPos = getNeuronPosition(
          prevLayerIndex,
          prevNeuronIndex
        );
        const nextNeuronPos = getNeuronPosition(layerIndex, neuronIndex);

        const lineLength = Math.hypot(
          prevNeuronPos.x - nextNeuronPos.x,
          prevNeuronPos.y - nextNeuronPos.y
        );

        const thisLineCanAnimate =
          (prevNeuronId * layer.length + neuronId) % 7 === 2;

        connections.push(
          <line
            key={`${prevLayerIndex}-${prevNeuronId}-${layerIndex}-${neuronId}`}
            x1={prevNeuronPos.x}
            x2={nextNeuronPos.x}
            y1={prevNeuronPos.y}
            y2={nextNeuronPos.y}
            stroke={color}
            strokeWidth={lineWidth}
          />
        );

        if (thisLineCanAnimate && !instant) {
          connections.push(
            <line
              key={`${prevLayerIndex}-${prevNeuronId}-${layerIndex}-${neuronId}-anim`}
              x1={prevNeuronPos.x}
              x2={nextNeuronPos.x}
              y1={prevNeuronPos.y}
              y2={nextNeuronPos.y}
              stroke="rgba(255, 255, 0, 0.5)"
              strokeWidth={lineWidth}
              strokeDasharray={`${lineLength} ${lineLength}`}
              strokeDashoffset={(animating ? -1 : 1) * lineLength}
              style={{
                transition: animating
                  ? `stroke-dashoffset 1200ms ease-in-out ${
                      1200 * (layerIndex - 1) + 500 + 100 * Math.random()
                    }ms`
                  : "none",
              }}
            />
          );
        }
      });
    });
  }

  return <g>{connections}</g>;
}

function Neurons({
  neurons,
  selectedNeuron,
  setSelectedNeuron,
  animating,
  instant,
}) {
  return (
    <g>
      {visibleNeurons.map((layer, layerIndex) =>
        layer.map((neuronId, neuronIndex) => {
          if (neuronId === null) return null;

          const neuronValue = neurons[layerIndex][neuronId];
          const grayValue = Math.floor(255 * neuronValue);
          const fill = `rgb(${grayValue}, ${grayValue}, ${grayValue})`;

          const neuronPos = getNeuronPosition(layerIndex, neuronIndex);

          const isSelected =
            selectedNeuron &&
            selectedNeuron.layerIndex === layerIndex &&
            selectedNeuron.neuronId === neuronId;

          return (
            <circle
              key={`${layerIndex}-${neuronId}`}
              cx={neuronPos.x}
              cy={neuronPos.y}
              r="10"
              stroke={isSelected ? "yellow" : "white"}
              strokeWidth={isSelected ? 2 : 1}
              style={{
                fill: animating || instant ? fill : "black",
                transition:
                  animating && !instant
                    ? `fill 600ms ease-in-out ${1200 * layerIndex + 100}ms`
                    : "none",
                cursor: "pointer",
              }}
              onClick={() => {
                if (isSelected) {
                  setSelectedNeuron(null);
                } else {
                  setSelectedNeuron({ layerIndex, neuronId });
                }
              }}
            />
          );
        })
      )}
    </g>
  );
}

function WinningOutputNeuronBox({ neurons, animating, instant }) {
  const winningValue = Math.max(...neurons[3]);
  const winningNeuron = neurons[3].indexOf(winningValue);
  const position = getNeuronPosition(3, winningNeuron);
  return (
    <rect
      x={position.x - 18}
      y={position.y - 16}
      width={56}
      height={32}
      stroke="yellow"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      strokeDasharray="176 176"
      strokeDashoffset={(animating || instant ? 0 : 1) * 176}
      style={{
        transition: animating
          ? `stroke-dashoffset 800ms ease-in-out ${instant ? "0ms" : "4500ms"}`
          : "none",
      }}
    />
  );
}

function OutputDigitLabels() {
  return (
    <g>
      {visibleNeurons[visibleNeurons.length - 1].map(
        (neuronId, neuronIndex) => {
          const position = getNeuronPosition(
            visibleNeurons.length - 1,
            neuronIndex
          );

          return (
            <text
              key={neuronId}
              x={position.x + 25}
              y={position.y + 2}
              style={{ fill: "white" }}
              fontSize="20"
              dominantBaseline="middle"
              textAnchor="middle"
            >
              {neuronId}
            </text>
          );
        }
      )}
    </g>
  );
}

function PiCreature({ animating, instant }) {
  return (
    <>
      <g
        transform="translate(30 340) scale(0.4)"
        style={{
          opacity: instant ? 0.0 : animating ? 0.0 : 1.0,
          transition:
            animating && !instant ? "opacity 0ms linear 5000ms" : "none",
        }}
      >
        <path
          d="M152.905 32.5001L153.153 32.4976L153.302 32.298C155.664 29.1133 157.1 25.0092 157.1 20.7001C157.1 9.92735 148.379 1.09871 137.498 1.20008C126.723 1.20136 118 9.92473 118 20.7001C118 25.1033 119.433 29.421 122.117 32.6214L122.269 32.8024L122.505 32.8001L152.905 32.5001Z"
          fill="white"
          stroke="black"
        />
        <path
          d="M207.905 32.5001L208.153 32.4976L208.302 32.298C210.664 29.1133 212.1 25.0092 212.1 20.7001C212.1 9.92735 203.379 1.09871 192.498 1.20008C181.723 1.20136 173 9.92473 173 20.7001C173 25.1033 174.433 29.421 177.117 32.6214L177.269 32.8024L177.505 32.8001L207.905 32.5001Z"
          fill="white"
          stroke="black"
        />
        <path
          d="M142.999 5.80005C141.699 5.90005 140.699 6.90004 140.699 8.20004C140.699 9.50004 141.799 10.6 143.099 10.6C144.399 10.6 145.499 9.50004 145.499 8.20004C145.499 6.90004 144.399 5.80005 143.099 5.80005H142.999L145.899 4.80005C150.199 4.80005 153.599 8.30005 153.599 12.5C153.599 16.7 150.099 20.2 145.899 20.2C141.699 20.2 138.199 16.7 138.199 12.5C138.199 8.30005 141.699 4.80005 145.899 4.80005"
          fill="black"
        />
        <path
          d="M197.999 5.80005C196.699 5.90005 195.699 6.90004 195.699 8.20004C195.699 9.50004 196.799 10.6 198.099 10.6C199.399 10.6 200.499 9.50004 200.499 8.20004C200.499 6.90004 199.399 5.80005 198.099 5.80005H197.999L200.899 4.80005C205.199 4.80005 208.599 8.30005 208.599 12.5C208.599 16.7 205.099 20.2 200.899 20.2C196.699 20.2 193.199 16.7 193.199 12.5C193.199 8.30005 196.699 4.80005 200.899 4.80005"
          fill="black"
        />
        <path
          d="M133.399 62.1H197.799C182.399 125.9 172.699 167.5 172.699 213.1C172.699 221.1 172.699 282.6 196.099 282.6C208.099 282.6 218.299 271.8 218.299 262.1C218.299 259.3 218.299 258.1 214.299 249.6C198.899 210.3 198.899 161.3 198.899 157.3C198.899 153.9 198.899 113.4 210.899 62.2H274.699C282.099 62.2 300.899 62.2 300.899 44C300.899 31.5 290.099 31.5 279.799 31.5H92.3992C79.2992 31.5 59.8992 31.5 33.6992 59.4C18.8992 75.9 0.699219 106.1 0.699219 109.5C0.699219 112.9 3.49922 114.1 6.99922 114.1C10.9992 114.1 11.5992 112.4 14.3992 109C43.9992 62.3 73.5992 62.3 87.8992 62.3H120.399C107.899 105 93.5992 154.6 46.8992 254.3C42.2992 263.4 42.2992 264.6 42.2992 268C42.2992 280 52.5992 282.8 57.6992 282.8C74.1992 282.8 78.7992 268 85.5992 244.1C94.6992 215 94.6992 213.9 100.399 191.1L133.399 62.1Z"
          fill="#0C7F99"
        />
        <path
          d="M144.801 47.3C149.701 50.6 153.701 55.6 165.301 55.5C180.001 55.5 181.501 48.6 181.601 48.2L181.301 46.3C179.001 47.4 178.201 52 165.501 51.8C155.301 51.6 151.901 49.4 145.901 45.7"
          fill="black"
        />
      </g>

      <g
        transform="translate(45 340) scale(0.4)"
        style={{
          opacity: instant ? 1.0 : animating ? 1.0 : 0.0,
          transition:
            animating && !instant ? "opacity 0ms linear 5000ms" : "none",
        }}
      >
        <path
          d="M110.905 34.4999L111.153 34.4975L111.302 34.2979C113.664 31.1132 115.1 27.0091 115.1 22.7C115.1 11.9272 106.379 3.09859 95.4976 3.19996C84.7226 3.20123 76 11.9246 76 22.7C76 27.1032 77.4327 31.4209 80.1169 34.6213L80.2687 34.8023L80.5049 34.7999L110.905 34.4999Z"
          fill="white"
          stroke="black"
        />
        <path
          d="M165.905 34.4999L166.153 34.4975L166.302 34.2979C168.664 31.1132 170.1 27.0091 170.1 22.7C170.1 11.9272 161.379 3.09859 150.498 3.19996C139.723 3.20123 131 11.9246 131 22.7C131 27.1032 132.433 31.4209 135.117 34.6213L135.269 34.8023L135.505 34.7999L165.905 34.4999Z"
          fill="white"
          stroke="black"
        />
        <path
          d="M101 7.80005C99.7002 7.90005 98.7002 8.90004 98.7002 10.2C98.7002 11.5 99.8002 12.6 101.1 12.6C102.4 12.6 103.5 11.5 103.5 10.2C103.5 8.90004 102.4 7.80005 101.1 7.80005H101L103.9 6.80005C108.2 6.80005 111.6 10.3 111.6 14.5C111.6 18.7 108.1 22.2 103.9 22.2C99.7002 22.2 96.2002 18.7 96.2002 14.5C96.2002 10.3 99.7002 6.80005 103.9 6.80005"
          fill="black"
        />
        <path
          d="M156 7.80005C154.7 7.90005 153.7 8.90004 153.7 10.2C153.7 11.5 154.8 12.6 156.1 12.6C157.4 12.6 158.5 11.5 158.5 10.2C158.5 8.90004 157.4 7.80005 156.1 7.80005H156L158.9 6.80005C163.2 6.80005 166.6 10.3 166.6 14.5C166.6 18.7 163.1 22.2 158.9 22.2C154.7 22.2 151.2 18.7 151.2 14.5C151.2 10.3 154.7 6.80005 158.9 6.80005"
          fill="black"
        />
        <path
          d="M91.4002 64.1001H155.8C140.4 127.9 130.7 169.5 130.7 215.1C130.7 223.1 130.7 284.6 154.1 284.6C166.1 284.6 176.3 273.8 176.3 264.1C176.3 261.3 176.3 260.1 172.3 251.6C156.9 212.3 156.9 163.3 156.9 159.3C156.9 155.9 156.9 115.4 168.9 64.2L238.1 63.2C251.9 62.8 264.7 42.3 264.7 24C264.7 11.5 247.8 34.1 220.7 34.1L50.4002 33.4C37.3002 33.4 32.0002 34.3 26.1002 28.1C15.9002 17.3 21.3002 8.80005 21.3002 5.40005C21.3002 2.00005 18.5002 0.800049 15.0002 0.800049C11.0002 0.800049 8.4002 1.60005 7.6002 5.90005C-1.4998 53.1 31.1002 63.5001 45.8002 64.1001H78.3002C65.8002 106.8 51.5002 156.4 4.8002 256.1C0.200202 265.2 0.200195 266.4 0.200195 269.8C0.200195 281.8 10.5002 284.6 15.6002 284.6C32.1002 284.6 36.7002 269.8 43.5002 245.9C52.6002 216.8 52.6002 215.7 58.3002 192.9L91.4002 64.1001Z"
          fill="#0C7F99"
        />
        <path
          d="M104.9 55C104.9 55.9 109.8 60.7 121.3 60.3C130.6 59.9 132.3 58.8 134.4 54.8L135.3 50.8C131.6 50.9 122.1 51.6 116 51.4C111.8 51.3 106 51.3 105 51.5"
          fill="black"
        />
      </g>
    </>
  );
}

function ImageGrid({
  x,
  y,
  width,
  height,
  points,
  setPoints,
  normalizing,
  isNormalized,
  normalizePointsAnimated,
  instant,
  editing,
  startEditing,
  beginAnimation,
  highlightedTile,
}) {
  const [dragging, setDragging] = useState(false);

  const fillAtPoint = useCallback(
    (x, y, drag) => {
      setPoints((points) => {
        let newPoints = [];
        if (drag && points.length > 0) {
          const prevPoint = points[points.length - 1];
          for (let d = 1; d <= 2; d++) {
            newPoints.push({
              x: prevPoint.x + (x - prevPoint.x) * (d / 3),
              y: prevPoint.y + (y - prevPoint.y) * (d / 3),
            });
          }
        }

        newPoints.push({ x, y });

        return [...points, ...newPoints];
      });
    },
    [setPoints]
  );

  const fillAtClientPixel = useCallback(
    (screenX, screenY, target, drag) => {
      const rect = target.getBoundingClientRect();
      const x = ((screenX - rect.left) / (rect.right - rect.left)) * 28;
      const y = ((screenY - rect.top) / (rect.bottom - rect.top)) * 28;

      fillAtPoint(x, y, drag);
    },
    [fillAtPoint]
  );

  const fillAtEventLocation = useCallback(
    (event, drag) => {
      if (event.touches) {
        for (const touch of event.touches) {
          // This code is supposed to handle multi-touch (drawing with two
          // fingers at once) but on my phone it only seems to deal with
          // one touch at a time. Not sure why.
          fillAtClientPixel(touch.clientX, touch.clientY, event.target, drag);
        }
      } else {
        // This was a mouse event
        fillAtClientPixel(event.clientX, event.clientY, event.target, drag);
      }
    },
    [fillAtClientPixel]
  );

  const onMouseUp = useCallback((event) => {
    setDragging(false);
  }, []);

  const onMouseDown = useCallback(
    (event) => {
      if (editing) {
        setDragging(true);
        fillAtEventLocation(event);
        event.preventDefault();
      }
    },
    [editing, fillAtEventLocation]
  );

  const onMouseMove = useCallback(
    (event) => {
      if (dragging && editing) {
        fillAtEventLocation(event, true);
        event.preventDefault();
      }
    },
    [dragging, editing, fillAtEventLocation]
  );

  const onClick = useCallback(() => {
    if (!editing) {
      startEditing();
    }
  }, [editing, startEditing]);

  useEffect(() => {
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("touchend", onMouseUp);
    return () => {
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("touchend", onMouseUp);
    };
  }, [onMouseUp]);

  const values = useMemo(() => getInputNeuronValues(points), [points]);

  const isEmpty = !values.some((value) => value > 0.1);

  return (
    <g
      style={{
        transform: `translate(${x}px, ${y}px) scale(${width / 400}, ${
          height / 400
        })`,
        transition: "all 500ms ease-in-out",
      }}
    >
      <rect x={0} y={0} width={400} height={400} fill="black" />

      <g>
        {values.map((value, n) => {
          const tileX = n % 28;
          const tileY = Math.floor(n / 28);

          return (
            <rect
              key={`${tileX}-${tileY}`}
              x={(tileX * 400) / 28}
              y={(tileY * 400) / 28}
              width={400 / 28}
              height={400 / 28}
              fill={`rgba(255, 255, 255, ${value})`}
              stroke={highlightedTile === n ? "yellow" : "none"}
              strokeWidth="2"
            />
          );
        })}
      </g>

      <g
        style={{
          opacity: normalizing ? 1.0 : 0.0,
          pointerEvents: "none",
          transition: "opacity 200ms ease-in-out",
        }}
      >
        <rect x={50} y={0} width={300} height={80} fill="rgba(0, 0, 0, 0.6)" />
        <text
          x={200}
          y={50}
          dominantBaseline="middle"
          textAnchor="middle"
          fill="yellow"
          fontFamily="sans-serif"
          fontSize="36"
        >
          Pre-processing...
        </text>
      </g>

      <rect
        x={0}
        y={0}
        width={400}
        height={400}
        stroke="#61BAD6"
        strokeWidth="2"
        rx="2"
        fill="transparent"
        style={{
          cursor: editing ? "crosshair" : "pointer",
        }}
        onClick={onClick}
        onMouseDown={onMouseDown}
        onTouchStart={onMouseDown}
        onMouseMove={onMouseMove}
        onTouchMove={onMouseMove}
      />

      <g
        transform="translate(0 410)"
        style={{
          opacity: editing ? 1.0 : 0.0,
          pointerEvents: editing ? undefined : "none",
          transition: "opacity 500ms ease-in-out",
        }}
      >
        <g>
          <rect
            x={0}
            y={0}
            width={150}
            height={60}
            tabIndex="0"
            rx={3}
            onClick={() => {
              if (!isEmpty) {
                setPoints([]);
              }
            }}
            style={{
              fill: "#C7E9F1",
              cursor: isEmpty ? "default" : "pointer",
              opacity: isEmpty ? 0.5 : 1.0,
            }}
          />

          <text
            x="75"
            y="32"
            dominantBaseline="middle"
            textAnchor="middle"
            fill="black"
            fontFamily="sans-serif"
            fontSize="24"
            style={{
              pointerEvents: "none",
              opacity: isEmpty ? 0.5 : 1.0,
            }}
          >
            Clear
          </text>
        </g>

        {!instant && (
          <g>
            <rect
              x={200}
              y={0}
              width={200}
              height={60}
              tabIndex="0"
              rx={3}
              onClick={() => {
                if (!isEmpty) {
                  beginAnimation();
                }
              }}
              style={{
                fill: "#1C758A",
                cursor: isEmpty ? "default" : "pointer",
                opacity: isEmpty ? 0.5 : 1.0,
              }}
            />

            <text
              x="300"
              y="32"
              dominantBaseline="middle"
              textAnchor="middle"
              fill="white"
              fontFamily="sans-serif"
              fontSize="24"
              style={{
                pointerEvents: "none",
                opacity: isEmpty ? 0.5 : 1.0,
              }}
            >
              Check digit
            </text>
          </g>
        )}

        {instant && (
          <g>
            <rect
              x={200}
              y={0}
              width={200}
              height={60}
              tabIndex="0"
              rx={3}
              onClick={() => {
                if (!(isEmpty || isNormalized)) {
                  normalizePointsAnimated(1);
                }
              }}
              style={{
                fill: "#1C758A",
                cursor: isEmpty || isNormalized ? "default" : "pointer",
                opacity: isEmpty || isNormalized ? 0.5 : 1.0,
              }}
            />

            <text
              x="300"
              y="32"
              dominantBaseline="middle"
              textAnchor="middle"
              fill="white"
              fontFamily="sans-serif"
              fontSize="24"
              style={{
                pointerEvents: "none",
                opacity: isEmpty || isNormalized ? 0.5 : 1.0,
              }}
            >
              Pre-process
            </text>
          </g>
        )}
      </g>
    </g>
  );
}

function VerticalEllipsis({ cx = 0, cy = 0 }) {
  return (
    <g>
      <circle cx={cx} cy={cy - 12} r="3" fill="white" />
      <circle cx={cx} cy={cy} r="3" fill="white" />
      <circle cx={cx} cy={cy + 12} r="3" fill="white" />
    </g>
  );
}

function WeightGrid({ x, y, width, height, weights, inputNeurons }) {
  const maxWeight = Math.max(...weights.map(Math.abs));

  return (
    <g transform={`translate(${x} ${y}) scale(${width / 28} ${height / 28})`}>
      <rect
        x="-1"
        y="-1"
        width="30"
        height="30"
        fill="black"
        stroke="yellow"
        strokeWidth="0.5"
      />
      {weights.map((weight, n) => {
        const weightX = n % 28;
        const weightY = Math.floor(n / 28);

        const alpha = Math.abs(weight / maxWeight) ** 0.3;
        const color =
          weight < 0
            ? `rgba(252, 98, 85, ${alpha})`
            : `rgba(88, 196, 221, ${alpha})`;

        return (
          <rect x={weightX} y={weightY} width="1" height="1" fill={color} />
        );
      })}
      <rect
        x="31"
        y="-1"
        width="30"
        height="30"
        fill="black"
        stroke="yellow"
        strokeWidth="0.5"
      />
      {weights.map((weight, n) => {
        const weightX = n % 28;
        const weightY = Math.floor(n / 28);

        const alpha = Math.abs(weight / maxWeight) ** 0.3 * inputNeurons[n];
        const color =
          weight < 0
            ? `rgba(252, 98, 85, ${alpha})`
            : `rgba(88, 196, 221, ${alpha})`;

        return (
          <rect
            x={32 + weightX}
            y={weightY}
            width="1"
            height="1"
            fill={color}
          />
        );
      })}
    </g>
  );
}

function dotProduct(vec1, vec2) {
  let result = 0;
  for (let i = 0; i < vec1.length; i++) {
    result += vec1[i] * vec2[i];
  }
  return result;
}

function matrixVectorMult(matrix, vector) {
  let result = [];
  for (let row = 0; row < matrix.length; row++) {
    result.push(dotProduct(matrix[row], vector));
  }
  return result;
}

function vectorAdd(vec1, vec2) {
  let result = [];
  for (let i = 0; i < vec1.length; i++) {
    result.push(vec1[i] + vec2[i]);
  }
  return result;
}

function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

// a_1 = sigma(W * a_0 + b)
function getAllNeuronValues(firstLayer) {
  let layers = [firstLayer];

  while (layers.length <= weights.length) {
    const previousLayer = layers[layers.length - 1];
    const weightMatrix = weights[layers.length - 1];
    const biasVector = biases[layers.length - 1];
    layers.push(
      vectorAdd(matrixVectorMult(weightMatrix, previousLayer), biasVector).map(
        sigmoid
      )
    );
  }

  return layers;
}

function getInputNeuronValues(points) {
  let values = new Array(28 ** 2).fill(0);

  for (const point of points) {
    const { x, y } = point;

    values = values.map((value, n) => {
      const tileX = n % 28;
      const tileY = Math.floor(n / 28);

      const dist = Math.hypot(tileX - x, tileY - y);

      let penValue = 0.8 - (dist / 2) ** 2;
      penValue = Math.min(Math.max(0, penValue), 1);
      return value + (1 - value) * penValue;
    });
  }

  return values;
}

function getNeuronValues(points) {
  const inputNeurons = getInputNeuronValues(points);
  return getAllNeuronValues(inputNeurons);
}

function collectNormalizationData(points) {
  const values = getInputNeuronValues(points);

  let left = Infinity;
  let right = -Infinity;
  let top = Infinity;
  let bottom = -Infinity;

  let centerX = 0;
  let centerY = 0;
  let totalValue = 0;

  for (let n = 0; n < values.length; n++) {
    const x = n % 28;
    const y = Math.floor(n / 28);
    const value = values[n];

    centerX += x * value;
    centerY += y * value;
    totalValue += value;

    if (value > 0.05) {
      left = Math.min(left, x);
      right = Math.max(right, x);
      top = Math.min(top, y);
      bottom = Math.max(bottom, y);
    }
  }

  centerX /= totalValue;
  centerY /= totalValue;

  const width = right - left;
  const height = bottom - top;

  const scale = 20 / Math.max(width, height);

  return { scale, centerX, centerY };
}

function applyNormalizationTransformation(points, data, time = 1) {
  const { scale, centerX, centerY } = data;

  return points.map((point) => {
    let { x, y } = point;

    x -= centerX;
    y -= centerY;

    x *= scale;
    y *= scale;

    x += 14;
    y += 14;

    return {
      ...point,
      x: point.x + (x - point.x) * time,
      y: point.y + (y - point.y) * time,
    };
  });
}
