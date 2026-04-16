import type { Point } from "./SketchPad";
import { useEffect, useRef, useState } from "react";
import {
  createRoot,
  events,
  extend,
  useFrame,
  useThree,
} from "@react-three/fiber";
import * as THREE from "three";
import {
  AmbientLight,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  PlaneGeometry,
  PointLight,
  TubeGeometry,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { ParametricGeometry } from "three/examples/jsm/geometries/ParametricGeometry.js";
import { defaultPoints } from "./data";
import SketchPad from "./SketchPad";

extend({
  AmbientLight,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  OrbitControls,
  ParametricGeometry,
  PlaneGeometry,
  PointLight,
  TubeGeometry,
});

export default function Surface() {
  const [points, setPoints] = useState(defaultPoints as Point[]);

  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

  const rootRef = useRef<ReturnType<typeof createRoot> | null>(null);

  useEffect(() => {
    if (!canvas) return;

    // Use a manually managed R3F root instead of <Canvas> to avoid
    // scaling issues inside <Interactive>.
    const root = createRoot(canvas);
    root.configure({
      events,
      size: { width: 880, height: 500, top: 0, left: 0 },
    });
    rootRef.current = root;

    return () => {
      root.unmount();
      rootRef.current = null;
    };
  }, [canvas]);

  useEffect(() => {
    if (!rootRef.current) return;
    rootRef.current.render(<Visualization points={points} />);
  }, [canvas, points]);

  return (
    <div className="relative">
      <canvas ref={setCanvas} style={{ width: 880, height: 500 }} />

      <SketchPad points={points} setPoints={setPoints} />
    </div>
  );
}

function Visualization({ points }: { points: number[][] }) {
  const lineSegments: THREE.LineCurve3[] = [];
  for (let i = 0; i < points.length; i++) {
    const a = points[i]!;
    const b = points[(i + 1) % points.length]!;

    lineSegments.push(
      new THREE.LineCurve3(
        new THREE.Vector3(a[0], a[1], 0),
        new THREE.Vector3(b[0], b[1], 0),
      ),
    );
  }

  const curvePath = new THREE.CurvePath<THREE.Vector3>();
  curvePath.autoClose = true;
  curvePath.curves = lineSegments;

  return (
    <>
      <CameraControls
        prepCamera={(camera: THREE.PerspectiveCamera) => {
          camera.fov = 40;
          camera.up.set(0, 0, 1);
          camera.position.set(1.2, 1.2, 1);
          camera.updateProjectionMatrix();
        }}
      />

      <ambientLight args={[new THREE.Color(0xcccccc).convertSRGBToLinear()]} />
      <pointLight position={new THREE.Vector3(8, 8, 8)} />
      <pointLight position={new THREE.Vector3(-8, 0, 8)} />
      <pointLight position={new THREE.Vector3(0, 8, 8)} />

      <mesh position={new THREE.Vector3(0, 0, -0.25)}>
        <planeGeometry args={[1.5, 1.5, 1, 1]} />
        <meshBasicMaterial
          args={[
            {
              color: new THREE.Color("white").convertSRGBToLinear(),
              side: THREE.DoubleSide,
            },
          ]}
        />
      </mesh>

      <mesh
        renderOrder={Number.MAX_SAFE_INTEGER}
        position={new THREE.Vector3(0, 0, -0.25)}
      >
        <tubeGeometry args={[curvePath, 200, 0.01, 10, true]} />
        <meshBasicMaterial
          args={[
            {
              color: new THREE.Color("deepskyblue").convertSRGBToLinear(),
              side: THREE.DoubleSide,
            },
          ]}
        />
      </mesh>

      <mesh position={new THREE.Vector3(0, 0, -0.25)}>
        <meshPhysicalMaterial
          args={[
            {
              color: new THREE.Color("deepskyblue"),
              side: THREE.DoubleSide,
              opacity: 0.5,
              transparent: true,
              roughness: 0.3,
              metalness: 0.3,
              reflectivity: 0.7,
              clearcoat: 0.5,
              clearcoatRoughness: 1,
            },
          ]}
        />
        <parametricGeometry
          args={[
            (u: number, v: number, vec: THREE.Vector3) => {
              u = (u + v) % 1;

              const point1 = curvePath.getPoint(u);
              const point2 = curvePath.getPoint(v);

              vec.addVectors(point1, point2).divideScalar(2);
              vec.z = point1.distanceTo(point2);
            },
            50,
            50,
          ]}
        />
      </mesh>
    </>
  );
}

function CameraControls({
  prepCamera,
}: {
  prepCamera: (camera: THREE.PerspectiveCamera) => void;
}) {
  const {
    camera,
    gl: { domElement },
  } = useThree();

  useEffect(() => {
    prepCamera(camera as THREE.PerspectiveCamera);
  }, [camera, prepCamera]);

  const controls = useRef<OrbitControls>(null);
  useFrame(() => {
    if (controls.current) {
      controls.current.update();
    }
  });

  return (
    <orbitControls ref={controls} args={[camera, domElement]} enableDamping />
  );
}
