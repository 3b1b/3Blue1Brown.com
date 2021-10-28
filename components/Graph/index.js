import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const graphContext = createContext(null);

export default function GraphWindow({
  children,
  width = 640,
  height = 480,
  center: defaultCenter = [0, 0],
  radius: defaultRadius = 5, // Just a number to keep the aspect ratio square, otherwise an array of two numbers
}) {
  const [center, setCenter] = useState(defaultCenter);
  const [radius, setRadius] = useState(defaultRadius);

  /*
      This was originally written to use
      const [range, setRange] = useState([[-1, 1], [-1, 1]]);
      Where the range is essentially the window that is
      visible: [[minX, maxX], [minY, maxY]]
  
      But with that structure, changing the width/height
      of the component stretches the view rather than
      changing how it's cropped, which is undesirable.
  
      So I changed it to use center and radius behind
      the scenes, but to then convert those values back
      into a range and setRange function for the rest
      of the components to use.
    */

  const range = useMemo(() => {
    let effectiveRadius = radius;
    if (typeof effectiveRadius === "number") {
      const rx = effectiveRadius;
      const ry = (rx / width) * height;
      effectiveRadius = [rx, ry];
    }
    return [
      [center[0] - effectiveRadius[0], center[0] + effectiveRadius[0]],
      [center[1] - effectiveRadius[1], center[1] + effectiveRadius[1]],
    ];
  }, [center, radius, width, height]);

  const setRange = useCallback(
    (input) => {
      if (typeof input === "function") {
        input = input(range);
      }

      const [[x1, x2], [y1, y2]] = input;

      setCenter([(x1 + x2) / 2, (y1 + y2) / 2]);
      setRadius((x2 - x1) / 2);
    },
    [range]
  );

  const resetRange = useCallback(() => {
    setCenter(defaultCenter);
    setRadius(defaultRadius);
  }, [defaultCenter, defaultRadius]);

  const windowSize = { width, height };

  const windowRef = useRef(null);

  return (
    <graphContext.Provider
      value={{ range, setRange, resetRange, windowSize, windowRef }}
    >
      <div
        ref={windowRef}
        style={{
          width,
          height,
          position: "relative",
          background: "black",
          overflow: "hidden",
          userSelect: "none",
          touchAction: "none",
        }}
      >
        {typeof children === "function"
          ? children({ range, setRange, resetRange, windowSize })
          : children}
      </div>
    </graphContext.Provider>
  );
}

export function useGraph() {
  return useContext(graphContext);
}

function toRelativePos(value, range) {
  return (value - range[0]) / (range[1] - range[0]);
}

function fromRelativePos(value, range) {
  return value * (range[1] - range[0]) + range[0];
}

export function GraphPoint({
  x = 0,
  y = 0,
  color = "white",
  size = 24,
  onDrag = null,
}) {
  const { range, windowRef } = useGraph();

  const [dragStart, setDragStart] = useState(null);

  const getRelMousePos = useCallback(
    (event) => {
      const { clientX, clientY } = event.changedTouches
        ? event.changedTouches[0]
        : event;

      const box = windowRef.current.getBoundingClientRect();
      return [
        (clientX - box.left) / box.width,
        1 - (clientY - box.top) / box.height,
      ];
    },
    [windowRef]
  );

  const updatePointPos = useCallback(
    (event) => {
      if (!onDrag) return;
      if (!dragStart) return;

      const oldMousePos = dragStart.relMousePos;
      const newMousePos = getRelMousePos(event);
      const oldMouseCoords = [
        fromRelativePos(oldMousePos[0], range[0]),
        fromRelativePos(oldMousePos[1], range[1]),
      ];
      const newMouseCoords = [
        fromRelativePos(newMousePos[0], range[0]),
        fromRelativePos(newMousePos[1], range[1]),
      ];
      const dx = newMouseCoords[0] - oldMouseCoords[0];
      const dy = newMouseCoords[1] - oldMouseCoords[1];

      onDrag([dragStart.pointPos[0] + dx, dragStart.pointPos[1] + dy]);
    },
    [onDrag, dragStart, getRelMousePos, range]
  );

  const onMouseDown = useCallback(
    (event) => {
      if (!onDrag) return;

      setDragStart({
        pointPos: [x, y],
        relMousePos: getRelMousePos(event),
      });
    },
    [x, y, onDrag, getRelMousePos]
  );

  const onMouseMove = useCallback(
    (event) => {
      if (onDrag && dragStart) {
        updatePointPos(event);
      }
    },
    [onDrag, dragStart, updatePointPos]
  );

  const onMouseUp = useCallback(
    (event) => {
      if (onDrag && dragStart) {
        updatePointPos(event);
      }
      setDragStart(null);
    },
    [onDrag, dragStart, updatePointPos]
  );

  useEffect(() => {
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("touchmove", onMouseMove);
    document.addEventListener("touchend", onMouseUp);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("touchmove", onMouseMove);
      document.removeEventListener("touchend", onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  return (
    <div
      onMouseDown={onMouseDown}
      onTouchStart={onMouseDown}
      style={{
        width: size,
        height: size,
        background: color,
        borderRadius: 9999,
        border: `${size / 8}px solid white`,
        boxShadow: `0 0 0 ${size / 8}px black`,

        position: "absolute",
        left: `${toRelativePos(x, range[0]) * 100}%`,
        bottom: `${toRelativePos(y, range[1]) * 100}%`,
        transform: "translate(-50%, 50%)",

        zIndex: 20,
        cursor: onDrag ? "move" : undefined,
      }}
    />
  );
}

export function GraphLines({
  step = 1,
  color = "white",
  thickness = 1,
  labels = true,
  labelStr = (n, axis) => new Intl.NumberFormat().format(n),
  fontSize = 36,
}) {
  const { range, windowSize } = useGraph();

  step = 2 ** Math.floor(Math.log2((0.4 * (range[0][1] - range[0][0])) / 2));

  let vertPositions = [];
  for (
    let x = Math.floor(range[0][0] / step);
    x <= Math.ceil(range[0][1] / step);
    x++
  ) {
    vertPositions.push(x * step);
  }

  let horizPositions = [];
  for (
    let y = Math.floor(range[1][0] / step);
    y <= Math.ceil(range[1][1] / step);
    y++
  ) {
    horizPositions.push(y * step);
  }

  return (
    <svg
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      }}
      viewBox={`0 0 ${windowSize.width} ${windowSize.height}`}
      preserveAspectRatio="none"
    >
      {vertPositions.map((x) => {
        const relX = toRelativePos(x, range[0]);
        return (
          <line
            key={x}
            x1={relX * windowSize.width}
            x2={relX * windowSize.width}
            y1={0}
            y2={windowSize.height}
            stroke={color}
            strokeWidth={thickness}
          />
        );
      })}

      {horizPositions.map((y) => {
        const relY = toRelativePos(y, range[1]);
        return (
          <line
            key={y}
            x1={0}
            x2={windowSize.width}
            y1={(1 - relY) * windowSize.height}
            y2={(1 - relY) * windowSize.height}
            stroke={color}
            strokeWidth={thickness}
          />
        );
      })}

      {labels &&
        vertPositions.map((x) => {
          const relX = toRelativePos(x, range[0]);
          let relY = toRelativePos(0, range[1]);
          if (relY < 0.05) relY = 0.05;
          if (relY > 0.95) relY = 0.95;
          return (
            <text
              key={x}
              x={relX * windowSize.width}
              y={(1 - relY) * windowSize.height}
              fontSize={fontSize}
              fill="white"
              stroke="black"
              strokeWidth={fontSize / 7}
              paintOrder="stroke"
              dominantBaseline="middle"
              textAnchor="middle"
            >
              {labelStr(x, "x")}
            </text>
          );
        })}

      {labels &&
        horizPositions.map((y) => {
          if (y === 0) return null;

          let relX = toRelativePos(0, range[0]);
          const relY = toRelativePos(y, range[1]);
          if (relX < 0.05) relX = 0.05;
          if (relX > 0.95) relX = 0.95;
          return (
            <text
              key={y}
              x={relX * windowSize.width}
              y={(1 - relY) * windowSize.height}
              fontSize={fontSize}
              fill="white"
              stroke="black"
              strokeWidth={fontSize / 7}
              paintOrder="stroke"
              dominantBaseline="middle"
              textAnchor="middle"
            >
              {labelStr(y, "y")}
            </text>
          );
        })}
    </svg>
  );
}

const uniformSetters = {
  float: (gl, loc, value) => gl.uniform1f(loc, value),
  vec2: (gl, loc, value) => gl.uniform2fv(loc, value),
  vec3: (gl, loc, value) => gl.uniform3fv(loc, value),
  vec4: (gl, loc, value) => gl.uniform4fv(loc, value),

  mat2: (gl, loc, value) => gl.uniformMatrix2fv(loc, false, value),
  mat3: (gl, loc, value) => gl.uniformMatrix3fv(loc, false, value),
  mat4: (gl, loc, value) => gl.uniformMatrix4fv(loc, false, value),

  int: (gl, loc, value) => gl.uniform1i(loc, value),
  ivec2: (gl, loc, value) => gl.uniform2iv(loc, value),
  ivec3: (gl, loc, value) => gl.uniform3iv(loc, value),
  ivec4: (gl, loc, value) => gl.uniform4iv(loc, value),

  uint: (gl, loc, value) => gl.uniform1u(loc, value),
  uvec2: (gl, loc, value) => gl.uniform2uv(loc, value),
  uvec3: (gl, loc, value) => gl.uniform3uv(loc, value),
  uvec4: (gl, loc, value) => gl.uniform4uv(loc, value),
};

export function GraphShader({ vertex, fragment, uniforms = {} }) {
  const { windowSize } = useGraph();

  const canvasRef = useRef();

  const [gl, setGl] = useState(null);
  useEffect(() => {
    const gl = canvasRef.current.getContext("webgl2");
    if (gl === null) {
      console.error("WebGL is not supported in this browser.");
      return;
    }

    setGl(gl);
  }, []);

  const [shaderProgram, setShaderProgram] = useState(null);
  useEffect(() => {
    if (!gl) return;

    function loadShader(gl, type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(
          `An error occurred compiling the shaders: ${gl.getShaderInfoLog(
            shader
          )}`
        );
        gl.deleteShader(shader);
        return null;
      }

      return shader;
    }

    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertex);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragment);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error(
        `Unable to initialize the shader program: ${gl.getProgramInfoLog(
          shaderProgram
        )}`
      );
      return null;
    }

    gl.useProgram(shaderProgram);

    setShaderProgram(shaderProgram);
  }, [gl, vertex, fragment]);

  // Update uniform values
  useLayoutEffect(() => {
    if (!gl) return;
    if (!shaderProgram) return;

    for (const [name, data] of Object.entries(uniforms)) {
      const [type, value] = data;
      const location = gl.getUniformLocation(shaderProgram, name);
      uniformSetters[type](gl, location, value);
    }
  }, [gl, shaderProgram, uniforms]);

  // Render loop
  useEffect(() => {
    if (!gl) return;
    if (!shaderProgram) return;

    let request = null;
    function render() {
      request = requestAnimationFrame(render);

      const vertexPosition = gl.getAttribLocation(
        shaderProgram,
        "aVertexPosition"
      );

      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0]),
        gl.STATIC_DRAW
      );

      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      // Tell WebGL how to pull out the positions from the position
      // buffer into the vertexPosition attribute.
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(vertexPosition);

      // Render
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    request = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(request);
    };
  }, [gl, shaderProgram]);

  useEffect(() => {
    if (gl) {
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    }
  }, [gl, windowSize.width, windowSize.height]);

  return (
    <canvas
      ref={canvasRef}
      width={windowSize.width}
      height={windowSize.height}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        // zIndex: 10
      }}
    />
  );
}

export function InteractiveWindow({ minR, maxR }) {
  const touchData = useRef([]);
  const [isDragging, setIsDragging] = useState(false);

  const { setRange, windowRef } = useGraph();

  const ref = useRef(null);

  const toGraphPos = useCallback((clientX, clientY, range) => {
    const rect = ref.current.getBoundingClientRect();
    let x = (clientX - rect.left) / rect.width;
    let y = (clientY - rect.top) / rect.height;
    x = fromRelativePos(x, range[0]);
    y = fromRelativePos(1 - y, range[1]);
    return { x, y };
  }, []);

  const handleStart = useCallback((id, clientX, clientY) => {
    // Do not handle more than two touches at once
    // (Ignore any additional touches)
    if (touchData.current.length < 2) {
      touchData.current.push({ id, clientX, clientY });
      setIsDragging(true);
    }
  }, []);

  const handleMove = useCallback(
    (newTouches) => {
      const oldTouchData = touchData.current;
      if (oldTouchData.length === 0) {
        // There are no touches currently down.
        // This movement must be the mouse just hovering.
        return;
      }

      const newTouchData = oldTouchData.map((touch) => {
        const updated = newTouches.find(({ id }) => id === touch.id);
        if (!updated) return { ...touch };

        return {
          id: touch.id,
          clientX: updated.clientX,
          clientY: updated.clientY,
        };
      });

      // Compare old and new touch data to update range
      setRange((range) => {
        // One finger touch
        if (oldTouchData.length === 1) {
          const oldPos = toGraphPos(
            oldTouchData[0].clientX,
            oldTouchData[0].clientY,
            range
          );

          const newPos = toGraphPos(
            newTouchData[0].clientX,
            newTouchData[0].clientY,
            range
          );

          const dx = newPos.x - oldPos.x;
          const dy = newPos.y - oldPos.y;

          return shiftRange(range, dx, dy);
        }

        // Two finger touch
        const touchToGraphPos = ({ clientX, clientY }) =>
          toGraphPos(clientX, clientY, range);

        const oldPositions = oldTouchData.map(touchToGraphPos);
        const newPositions = newTouchData.map(touchToGraphPos);

        const oldCenter = {
          x: (oldPositions[0].x + oldPositions[1].x) / 2,
          y: (oldPositions[0].y + oldPositions[1].y) / 2,
        };

        const newCenter = {
          x: (newPositions[0].x + newPositions[1].x) / 2,
          y: (newPositions[0].y + newPositions[1].y) / 2,
        };

        const dx = newCenter.x - oldCenter.x;
        const dy = newCenter.y - oldCenter.y;

        const oldDist = Math.hypot(
          oldPositions[1].x - oldPositions[0].x,
          oldPositions[1].y - oldPositions[0].y
        );

        const newDist = Math.hypot(
          newPositions[1].x - newPositions[0].x,
          newPositions[1].y - newPositions[0].y
        );

        let newRange = shiftRange(range, dx, dy);
        let zoomAmount = 1 - oldDist / newDist;
        zoomAmount = normalizeZoomAmount(range, zoomAmount, minR, maxR);
        newRange = zoomRange(newRange, zoomAmount, [newCenter.x, newCenter.y]);

        return newRange;
      });

      // Update touchData to reflect most recent changes
      touchData.current = newTouchData;
    },
    [setRange, toGraphPos, minR, maxR]
  );

  const handleEnd = useCallback((endedTouches) => {
    for (const endedTouch of endedTouches) {
      touchData.current = touchData.current.filter(
        (touch) => touch.id !== endedTouch.id
      );
      if (touchData.current.length === 0) {
        setIsDragging(false);
      }
    }
  }, []);

  const onMouseDown = useCallback(
    (event) => {
      handleStart("mouse", event.clientX, event.clientY);
    },
    [handleStart]
  );

  const onTouchStart = useCallback(
    (event) => {
      for (const touch of event.changedTouches) {
        handleStart(touch.identifier, touch.clientX, touch.clientY);
      }
    },
    [handleStart]
  );

  const onMouseMove = useCallback(
    (event) => {
      handleMove([
        {
          id: "mouse",
          clientX: event.clientX,
          clientY: event.clientY,
        },
      ]);
    },
    [handleMove]
  );

  const onTouchMove = useCallback(
    (event) => {
      handleMove(
        Array.from(event.changedTouches).map((touch) => ({
          id: touch.identifier,
          clientX: touch.clientX,
          clientY: touch.clientY,
        }))
      );
    },
    [handleMove]
  );

  const onMouseUp = useCallback(
    (event) => {
      handleEnd([{ id: "mouse" }]);
    },
    [handleEnd]
  );

  const onTouchEnd = useCallback(
    (event) => {
      handleEnd(
        Array.from(event.changedTouches).map((touch) => ({
          id: touch.identifier,
        }))
      );
    },
    [handleEnd]
  );

  const onWheel = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();

      setRange((range) => {
        const { x, y } = toGraphPos(event.clientX, event.clientY, range);

        let zoomAmount = -event.deltaY / 100;
        zoomAmount = normalizeZoomAmount(range, zoomAmount, minR, maxR);
        return zoomRange(range, zoomAmount, [x, y]);
      });

      return false;
    },
    [setRange, toGraphPos, minR, maxR]
  );

  useEffect(() => {
    const win = windowRef.current;

    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("touchmove", onTouchMove);
    document.addEventListener("touchend", onTouchEnd);
    win.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
      if (win) {
        win.removeEventListener("wheel", onWheel, { passive: false });
      }
    };
  }, [onMouseUp, onMouseMove, onTouchEnd, onTouchMove, onWheel, windowRef]);

  return (
    <div
      ref={ref}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 10,
        cursor: isDragging ? "grabbing" : "grab",
      }}
    />
  );
}

function normalizeZoomAmount(range, zoomAmount, minR, maxR) {
  const currentR = Math.min(
    (range[0][1] - range[0][0]) / 2,
    (range[1][1] - range[1][0]) / 2
  );
  if (minR) {
    if ((1 - zoomAmount) * currentR < minR) {
      zoomAmount = 1 - minR / currentR;
    }
  }
  if (maxR) {
    if ((1 - zoomAmount) * currentR > maxR) {
      zoomAmount = 1 - maxR / currentR;
    }
  }
  return zoomAmount;
}

function zoomRange(range, amount, center = [0, 0]) {
  return [
    [
      (range[0][0] - center[0]) * (1 - amount) + center[0],
      (range[0][1] - center[0]) * (1 - amount) + center[0],
    ],
    [
      (range[1][0] - center[1]) * (1 - amount) + center[1],
      (range[1][1] - center[1]) * (1 - amount) + center[1],
    ],
  ];
}

function shiftRange(range, dx, dy) {
  return [range[0].map((x) => x - dx), range[1].map((y) => y - dy)];
}
