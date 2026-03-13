import { useLayoutEffect, useMemo, useRef } from "react";
import { Canvas } from "glsl-canvas-js";

type Props = {
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
      if (Array.isArray(value)) shader.current?.setUniform(name, ...value);
      else shader.current?.setUniform(name, String(value));
    }
  });

  return <canvas ref={ref} className={className} />;
}

// inject constant variable into glsl shader source code
const replaceConstant = (source: string, name: string, value: string) => {
  const regex = new RegExp(String.raw`const (.+) ${name} = (.+);`, "g");
  return source.replaceAll(regex, `const $1 ${name} = ${value};`);
};
