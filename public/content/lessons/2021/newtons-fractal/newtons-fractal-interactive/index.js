import { useCallback, useEffect, useState } from "react";
import GraphWindow, {
  GraphPoint,
  GraphLines,
  GraphShader,
  InteractiveWindow,
} from "../../../../../../components/Graph";

import styles from "./index.module.scss";

const colors = [
  [86 / 255, 6 / 255, 102 / 255, 1],
  [33 / 255, 170 / 255, 213 / 255, 1],
  [80 / 255, 159 / 255, 90 / 255, 1],
  [57 / 255, 84 / 255, 137 / 255, 1],
  [25 / 255, 144 / 255, 154 / 255, 1],
];

const toRGBStr = ([r, g, b, a]) => {
  return `rgba(${r * 255}, ${g * 255}, ${b * 255}, ${a})`;
};

export default function NewtonsFractalInteractive() {
  const [steps, setSteps] = useState(30);
  const [rootCount, setRootCount] = useState(5);

  const [root0, setRoot0] = useState([-1.3247, 0.0]);
  const [root1, setRoot1] = useState([0.0, 1.0]);
  const [root2, setRoot2] = useState([0.0, -1.0]);
  const [root3, setRoot3] = useState([0.66236, -0.56228]);
  const [root4, setRoot4] = useState([0.66236, 0.56228]);

  const roots = [root0, root1, root2, root3, root4].slice(0, rootCount);
  const setRoots = [setRoot0, setRoot1, setRoot2, setRoot3, setRoot4].slice(
    0,
    rootCount
  );

  const coefficients = getCoefficients(roots);

  const { width, height } = useWindowSize();

  return (
    <div className={styles.container}>
      <div>
        <GraphWindow width={width} height={height}>
          {({ range, resetRange, windowSize }) => (
            <>
              <InteractiveWindow minR={0.00001} maxR={100} />

              <GraphShader
                vertex={vertex}
                fragment={fragment(rootCount)}
                uniforms={{
                  n_steps: ["int", steps],
                  // MAX_DEGREE: ["int", rootCount],

                  color0: ["vec4", colors[0]],
                  color1: ["vec4", colors[1]],
                  color2: ["vec4", colors[2]],
                  color3: ["vec4", colors[3]],
                  color4: ["vec4", colors[4]],

                  coef0: ["vec2", coefficients[0] || [0, 0]],
                  coef1: ["vec2", coefficients[1] || [0, 0]],
                  coef2: ["vec2", coefficients[2] || [0, 0]],
                  coef3: ["vec2", coefficients[3] || [0, 0]],
                  coef4: ["vec2", coefficients[4] || [0, 0]],
                  coef5: ["vec2", coefficients[5] || [0, 0]],

                  root0: ["vec2", root0],
                  root1: ["vec2", root1],
                  root2: ["vec2", root2],
                  root3: ["vec2", root3],
                  root4: ["vec2", root4],

                  minX: ["float", range[0][0]],
                  maxX: ["float", range[0][1]],
                  minY: ["float", range[1][0]],
                  maxY: ["float", range[1][1]],

                  windowWidth: ["float", windowSize.width],
                  windowHeight: ["float", windowSize.height],
                }}
              />
              <GraphLines
                step={0.2}
                color="rgba(255, 255, 255, 0.2)"
                labels={false}
              />
              <GraphLines
                step={1}
                color="rgba(255, 255, 255, 0.5)"
                labels={true}
                labelY={(n) => `${n}i`}
                labelStr={(n, axis) => {
                  let str = new Intl.NumberFormat().format(n);
                  if (axis === "y") str += "i";
                  return str;
                }}
                fontSize={24}
              />

              {roots.map((root, i) => (
                <GraphPoint
                  key={i}
                  x={root[0]}
                  y={root[1]}
                  onDrag={setRoots[i]}
                  color={toRGBStr(colors[i])}
                />
              ))}

              <div className={styles.controls}>
                <div className={styles.buttons}>
                  <button
                    className={styles.homeButton}
                    onClick={() => resetRange()}
                  >
                    <i className="fas fa-home" />
                  </button>
                  <button
                    className={styles.rootsButton}
                    onClick={() => {
                      setRootCount((rootCount) => {
                        if (rootCount >= 5) return 2;
                        return rootCount + 1;
                      });
                    }}
                  >
                    {rootCount} roots
                  </button>
                </div>
                <div className={styles.stepCountBox}>
                  <div>
                    {steps} {steps === 1 ? "iteration" : "iterations"}
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={30}
                    step={1}
                    value={steps}
                    onChange={(event) => {
                      setSteps(Number(event.target.value));
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </GraphWindow>
      </div>
    </div>
  );
}

function getCoefficients(roots) {
  const n = roots.length;

  let coefficients = [];
  for (let k = n - 1; k >= 0; k--) {
    let c = add(...choose(roots, k + 1).map((roots) => multiply(...roots)));

    if ((n - k) % 2 === n % 2) {
      c = c.map((n) => -n);
    }

    coefficients.push(c);
  }

  coefficients.push([1, 0]);

  return coefficients;
}

function choose(array, n) {
  if (n === 0) {
    return [[]];
  }

  let combinations = [];
  for (let i = 0; i < array.length; i++) {
    let chosen = array[i];
    let newOptions = array.slice(i + 1);
    combinations.push(...choose(newOptions, n - 1).map((a) => [chosen, ...a]));
  }
  return combinations;
}

function add(...nums) {
  let a = 0;
  let b = 0;
  for (const num of nums) {
    a += num[0];
    b += num[1];
  }
  return [a, b];
}

function multiply(...nums) {
  if (nums.length === 1) return nums[0];

  return multiply(
    ...[
      [
        nums[0][0] * nums[1][0] - nums[0][1] * nums[1][1],
        nums[0][1] * nums[1][0] + nums[0][0] * nums[1][1],
      ],
      ...nums.slice(2),
    ]
  );
}

function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const updateSize = useCallback(() => {
    setSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  useEffect(() => {
    window.addEventListener("resize", updateSize);
    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, [updateSize]);

  return size;
}

export const vertex = `#version 300 es
  in vec4 aVertexPosition;

  void main() {
    gl_Position = aVertexPosition;
  }
`;

export const fragment = (MAX_DEGREE = 5) => `#version 300 es
  precision mediump float;

  uniform int n_steps;
  const int MAX_DEGREE = ${MAX_DEGREE};

  out vec4 outputColor;
  
  uniform lowp vec4 color0;
  uniform lowp vec4 color1;
  uniform lowp vec4 color2;
  uniform lowp vec4 color3;
  uniform lowp vec4 color4;
  
  uniform highp vec2 coef0;
  uniform highp vec2 coef1;
  uniform highp vec2 coef2;
  uniform highp vec2 coef3;
  uniform highp vec2 coef4;
  uniform highp vec2 coef5;
  
  uniform highp vec2 root0;
  uniform highp vec2 root1;
  uniform highp vec2 root2;
  uniform highp vec2 root3;
  uniform highp vec2 root4;

  uniform highp float minX;
  uniform highp float maxX;
  uniform highp float minY;
  uniform highp float maxY;

  uniform float windowWidth;
  uniform float windowHeight;

  vec2 complex_mult(vec2 z, vec2 w){
      return vec2(z.x * w.x - z.y * w.y, z.x * w.y + z.y * w.x);
  }

  vec2 complex_div(vec2 z, vec2 w){
      float w_norm_squared = w.x * w.x + w.y * w.y;
      return complex_mult(z, vec2(w.x, -w.y)) / w_norm_squared;
  }

  vec2 complex_pow(vec2 z, int n){
      vec2 result = vec2(1.0, 0.0);
      for (int i = 0; i < n; i++) {
          result = complex_mult(result, z);
      }
      return result;
  }

  vec2 poly(vec2 z, vec2[MAX_DEGREE + 1] coefs){
      vec2 result = vec2(0.0);
      for(int n = 0; n < MAX_DEGREE + 1; n++){
          result += complex_mult(coefs[n], complex_pow(z, n));
      }
      return result;
  }

  vec2 dpoly(vec2 z, vec2[MAX_DEGREE + 1] coefs){
      vec2 result = vec2(0.0);
      for(int n = 1; n < MAX_DEGREE + 1; n++){
          result += float(n) * complex_mult(coefs[n], complex_pow(z, n - 1));
      }
      return result;
  }

  vec2 seek_root(vec2 z, vec2[MAX_DEGREE + 1] coefs) {
      for(int i = 0; i < int(n_steps); i++){
          vec2 step = complex_div(poly(z, coefs), dpoly(z, coefs));
          if(length(step) < 1e-2){
              break;
          }
          z = z - step;
      }

      return z;
  }

  void main() {
    vec2[MAX_DEGREE + 1] coefs = vec2[MAX_DEGREE + 1](${range(MAX_DEGREE + 1)
      .map((n) => `coef${n}`)
      .join(", ")});
    vec2[MAX_DEGREE] roots = vec2[MAX_DEGREE](${range(MAX_DEGREE)
      .map((n) => `root${n}`)
      .join(", ")});
    vec4[MAX_DEGREE] colors = vec4[MAX_DEGREE](${range(MAX_DEGREE)
      .map((n) => `color${n}`)
      .join(", ")});

    mediump vec2 uv = gl_FragCoord.xy;
    uv /= vec2(windowWidth, windowHeight);

    vec2 z = uv * vec2(maxX - minX, maxY - minY) + vec2(minX, minY);

    vec2 found_root = seek_root(z, coefs);
    
    outputColor = vec4(0.0);
    float curr_min = 1e10;
    for(int i = 0; i < MAX_DEGREE; i++) {
        float dist = distance(roots[i], found_root);
        if(dist < curr_min){
            curr_min = dist;
            outputColor = colors[i];
        }
    }
  }
`;

function range(n) {
  return new Array(n).fill(null).map((_, i) => i);
}
