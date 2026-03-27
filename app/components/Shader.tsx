import { useLayoutEffect, useMemo, useRef } from "react";
import { color } from "d3-color";
import { Canvas } from "glsl-canvas-js";

export type Props = {
  source: string;
  constants: Record<string, string | number>;
  uniforms: Record<string, NonNullable<unknown>>;
  className?: string;
};

// glsl pixel shader
export default function Shader({
  source,
  constants,
  uniforms,
  className,
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const shader = useRef<Canvas>(null);

  // replace constants in shader source
  const fragment = useMemo(() => {
    let fragment = source;
    for (const [name, value] of Object.entries(constants))
      fragment = replaceConstant(fragment, name, `${value}`);
    return fragment;
  }, [source, constants]);

  // initialize shader canvas
  useLayoutEffect(() => {
    if (!ref.current) return;

    // shader options
    const options = {
      fragmentString: fragment,
      alpha: true,
      antialias: true,
      depth: false,
      desynchronized: false,
      doubleSided: false,
      failIfMajorPerformanceCaveat: true,
      premultipliedAlpha: true,
      preserveDrawingBuffer: false,
      stencil: false,
    };

    // create canvas
    shader.current = new Canvas(ref.current, options);

    return () => {
      // clean up canvas
      shader.current?.destroy();
    };
  }, [fragment]);

  // update uniform vars in shader
  useLayoutEffect(() => {
    for (const [name, value] of Object.entries(uniforms)) {
      // array values
      if (Array.isArray(value)) shader.current?.setUniform(name, ...value);
      // other values
      else shader.current?.setUniform(name, value);
    }
  });

  return <canvas ref={ref} className={className} />;
}

// inject constant variable into glsl shader source code
const replaceConstant = (source: string, name: string, value: string) => {
  // const someType NAME = VALUE;
  const regex = new RegExp(String.raw`const (.+) ${name} = (.+);`, "g");
  return source.replaceAll(regex, `const $1 ${name} = ${value};`);
};

// flexibly parse color string into vec4 rgba
export const normalizeColor = (str: string) => {
  const { r = 0, g = 0, b = 0 } = color(str)?.rgb() ?? {};
  return [r / 255, g / 255, b / 255, 1];
};
