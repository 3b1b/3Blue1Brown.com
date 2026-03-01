import { useCallback, useEffect, useState } from "react";
import GraphWindow, {
  GraphPoint,
  GraphLines,
  GraphShader,
  InteractiveWindow,
} from "../../../../../../components/Graph";

const MANDELBROT_COLORS = [
  [0 / 255, 6 / 255, 92 / 255],
  [6 / 255, 30 / 255, 126 / 255],
  [12 / 255, 54 / 255, 160 / 255],
  [32 / 255, 89 / 255, 188 / 255],
  [66 / 255, 136 / 255, 211 / 255],
  [217 / 255, 237 / 255, 228 / 255],
  [240 / 255, 249 / 255, 228 / 255],
  [186 / 255, 159 / 255, 106 / 255],
  [87 / 255, 55 / 255, 6 / 255],
];

export default function MandelbrotInteractive() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div
        style={{
          flex: "1 0 0",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div style={{ textAlign: "center", color: "white", fontSize: 36 }}>
          <div>
            <span style={{ color: "yellow" }}>c</span> ↔{" "}
            <span style={{ color: "#38b1ce" }}>Pixel</span>
          </div>
          <div>
            z<sub>0</sub> = 0
          </div>
        </div>
        <GraphWindow width={600} height={600} center={[-0.3, 0]} radius={1}>
          {({ range }) => (
            <>
              <GraphShader
                vertex={vertex}
                fragment={fragment}
                uniforms={{
                  parameter: ["vec2", [0.0, 0.0]],
                  opacity: ["float", 1.0],
                  n_steps: ["float", 300.0],
                  mandelbrot: ["float", 1.0],

                  scale_factor: ["float", 1.0],
                  offset: ["vec3", [0.3, 0.0, 0.0]],

                  color0: ["vec3", MANDELBROT_COLORS[0]],
                  color1: ["vec3", MANDELBROT_COLORS[1]],
                  color2: ["vec3", MANDELBROT_COLORS[2]],
                  color3: ["vec3", MANDELBROT_COLORS[3]],
                  color4: ["vec3", MANDELBROT_COLORS[4]],
                  color5: ["vec3", MANDELBROT_COLORS[5]],
                  color6: ["vec3", MANDELBROT_COLORS[6]],
                  color7: ["vec3", MANDELBROT_COLORS[7]],
                  color8: ["vec3", MANDELBROT_COLORS[8]],
                }}
              />
              <GraphPoint
                x={pos.x}
                y={pos.y}
                onDrag={([x, y]) => {
                  x = Math.max(x, range[0][0]);
                  x = Math.min(x, range[0][1]);
                  y = Math.max(y, range[1][0]);
                  y = Math.min(y, range[1][1]);
                  setPos({ x, y });
                }}
                color="yellow"
                size={24}
              />
              <GraphLines
                fontSize={15}
                color="rgba(255, 255, 255, 0.3)"
                labelStr={(n, axis) => {
                  let str = new Intl.NumberFormat().format(n);
                  if (axis === "y") str += "i";
                  return str;
                }}
              />
            </>
          )}
        </GraphWindow>
      </div>
      <div
        style={{
          textAlign: "center",
          color: "white",
          fontSize: 36,
          margin: "0 16px",
        }}
      >
        <div>Iterate</div>
        <div>
          z<sup>2</sup> + <span style={{ color: "yellow" }}>c</span>
        </div>
      </div>
      <div
        style={{
          flex: "1 0 0",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div style={{ textAlign: "center", color: "white", fontSize: 36 }}>
          <div style={{ color: "yellow" }}>
            c = {Math.round(pos.x * 100) / 100} +{" "}
            {Math.round(pos.y * 100) / 100}i
          </div>
          <div>
            z<sub>0</sub> ↔ <span style={{ color: "#38b1ce" }}>Pixel</span>
          </div>
        </div>
        <GraphWindow width={600} height={600} center={[0, 0]} radius={2}>
          <GraphShader
            vertex={vertex}
            fragment={fragment}
            uniforms={{
              parameter: ["vec2", [pos.x, pos.y]],
              opacity: ["float", 1.0],
              n_steps: ["float", 100.0],
              mandelbrot: ["float", 0.0],

              scale_factor: ["float", 0.5],
              offset: ["vec3", [0.0, 0.0, 0.0]],

              color0: ["vec3", MANDELBROT_COLORS[0]],
              color1: ["vec3", MANDELBROT_COLORS[1]],
              color2: ["vec3", MANDELBROT_COLORS[2]],
              color3: ["vec3", MANDELBROT_COLORS[3]],
              color4: ["vec3", MANDELBROT_COLORS[4]],
              color5: ["vec3", MANDELBROT_COLORS[5]],
              color6: ["vec3", MANDELBROT_COLORS[6]],
              color7: ["vec3", MANDELBROT_COLORS[7]],
              color8: ["vec3", MANDELBROT_COLORS[8]],
            }}
          />
          <GraphLines
            fontSize={15}
            color="rgba(255, 255, 255, 0.3)"
            labelStr={(n, axis) => {
              let str = new Intl.NumberFormat().format(n);
              if (axis === "y") str += "i";
              return str;
            }}
          />
        </GraphWindow>
      </div>
    </div>
  );
}

// Note: These shaders are taken directly from the video source code, with
// only the necessary changes to make them work with webgl. Original source:
// https://github.com/3b1b/manim/tree/master/manimlib/shaders/mandelbrot_fractal

const vertex = `#version 300 es
  in vec4 aVertexPosition;
  out vec3 xyz_coords;

  uniform float scale_factor;
  uniform vec3 offset;

  const vec2 DEFAULT_FRAME_SHAPE = vec2(1.0, 1.0);

  vec4 get_gl_Position(vec3 point){
      vec4 result = vec4(point, 1.0);
      result.x *= 1.0 / DEFAULT_FRAME_SHAPE.x;
      result.y *= 1.0 / DEFAULT_FRAME_SHAPE.y;
      result.z *= -1.0;
      return result;
  }

  void main() {
    xyz_coords = (aVertexPosition.xyz - offset) / scale_factor;
    gl_Position = get_gl_Position(aVertexPosition.xyz);
  }
`;

const fragment = `#version 300 es
  precision mediump float;

  uniform vec2 parameter;
  uniform float opacity;
  uniform float n_steps;
  uniform float mandelbrot;

  uniform vec3 color0;
  uniform vec3 color1;
  uniform vec3 color2;
  uniform vec3 color3;
  uniform vec3 color4;
  uniform vec3 color5;
  uniform vec3 color6;
  uniform vec3 color7;
  uniform vec3 color8;

  in vec3 xyz_coords;
  out vec4 frag_color;

  vec2 complex_mult(vec2 z, vec2 w){
      return vec2(z.x * w.x - z.y * w.y, z.x * w.y + z.y * w.x);
  }

  vec2 complex_div(vec2 z, vec2 w){
      return complex_mult(z, vec2(w.x, -w.y)) / (w.x * w.x + w.y * w.y);
  }

  vec2 complex_pow(vec2 z, int n){
      vec2 result = vec2(1.0, 0.0);
      for(int i = 0; i < n; i++){
          result = complex_mult(result, z);
      }
      return result;
  }

  vec3 float_to_color(float value, float min_val, float max_val, vec3[9] colormap_data){
      float alpha = clamp((value - min_val) / (max_val - min_val), 0.0, 1.0);
      int disc_alpha = min(int(alpha * 8.0), 7);
      return mix(
          colormap_data[disc_alpha],
          colormap_data[disc_alpha + 1],
          8.0 * alpha - float(disc_alpha)
      );
  }

  void main() {
      // vec3 xyz_coords = gl_FragCoord.xyz;
    
      vec3 color_map[9] = vec3[9](
          color0, color1, color2, color3,
          color4, color5, color6, color7, color8
      );
      vec3 color;

      vec2 z;
      vec2 c;

      if(bool(mandelbrot)){
          c = xyz_coords.xy;
          z = vec2(0.0, 0.0);
      }else{
          c = parameter;
          z = xyz_coords.xy;
      }

      float outer_bound = 2.0;
      bool stable = true;
      for(int n = 0; n < int(n_steps); n++){
          z = complex_mult(z, z) + c;
          if(length(z) > outer_bound){
              float float_n = float(n);
              float_n += log(outer_bound) / log(length(z));
              float_n += 0.5 * length(c);
              color = float_to_color(sqrt(float_n), 1.5, 8.0, color_map);
              stable = false;
              break;
          }
      }
      if(stable){
          color = vec3(0.0, 0.0, 0.0);
      }

      frag_color = vec4(color, opacity);
  }
`;
