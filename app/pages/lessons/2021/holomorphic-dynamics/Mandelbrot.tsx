import { useState } from "react";
import { interpolateViridis } from "d3";
import { range } from "lodash-es";
import { normalizeColor } from "~/components/Shader";
import { Chart } from "~/pages/lessons/2021/newtons-fractal/NewtonsFractal";
import source from "./mandelbrot.frag?raw";

const colors = Object.fromEntries(
  range(0, 1, 0.1)
    .map(interpolateViridis)
    .map((color, index) => [`colors[${index}]`, normalizeColor(color)]),
);

export default function Mandelbrot() {
  const [points, setPoints] = useState([{ x: 0, y: 0, color: "#000000" }]);
  const point = points[0]!;

  return (
    <>
      <div className="grid w-full grid-cols-[1fr_0_1fr] place-items-center gap-4 text-xl *:flex *:flex-col *:items-center *:gap-2 max-md:grid-cols-1">
        <div>
          <div>
            <span className="text-secondary">c</span> ↔{" "}
            <span className="text-theme">Pixel</span>
          </div>
          <div>
            z<sub>0</sub> = 0
          </div>
        </div>
        <div>
          <div>Iterate</div>
          <div>
            z<sup>2</sup> + <span className="text-secondary">c</span>
          </div>
        </div>
        <div>
          <div className="text-secondary">
            c = {Math.round(point.x * 100) / 100} +{" "}
            {Math.round(point.y * 100) / 100}i
          </div>
          <div>
            z<sub>0</sub> ↔ <span className="text-theme">Pixel</span>
          </div>
        </div>
      </div>
      <div className="grid w-full grid-cols-2 gap-4 max-md:grid-cols-1">
        <Chart
          source={source}
          constants={{
            MANDELBROT: "true",
            ITERATIONS: 100,
            COLORS: Object.keys(colors).length,
          }}
          uniforms={{
            ...colors,
            parameter: [0, 0],
          }}
          points={points}
          setPoints={setPoints}
          className="aspect-square"
        />

        <Chart
          source={source}
          constants={{
            MANDELBROT: "false",
            ITERATIONS: 100,
            COLORS: Object.keys(colors).length,
          }}
          uniforms={{
            ...colors,
            parameter: [point.x, point.y],
          }}
          className="aspect-square"
        />
      </div>
    </>
  );
}
