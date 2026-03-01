import React, { useState, useRef, useEffect } from "react";
import { defaultSketchpadPoints } from "./data";
import SketchPad from "./SketchPad";
import { render, useFrame, events, extend, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import styles from "./index.module.scss";

extend({ OrbitControls });

export default function SurfaceInteractive() {
  const [sketchpadPoints, setSketchpadPoints] = useState(
    defaultSketchpadPoints
  );

  const [canvas, setCanvas] = useState();
  useEffect(() => {
    if (!canvas) return;

    // Use render() instead of <Canvas> to prevent scaling
    // issues inside of <Interactive>
    render(<SurfaceVisualization points={sketchpadPoints} />, canvas, {
      events,
      size: { width: 880, height: 500 },
    });

    // return () => { unmountComponentAtNode(canvas); };
  }, [canvas, sketchpadPoints]);

  return (
    <div className={styles.interactive}>
      <canvas ref={setCanvas} style={{ width: 880, height: 500 }} />

      <SketchPad
        points={sketchpadPoints}
        setPoints={setSketchpadPoints}
        width={250}
        height={250}
      />
    </div>
  );
}

function SurfaceVisualization({ points }) {
  let lineSegments = [];
  for (let i = 0; i < points.length; i++) {
    const a = points[i];
    const b = points[(i + 1) % points.length];

    lineSegments.push(
      new THREE.LineCurve3(
        new THREE.Vector3(a[0], a[1], 0),
        new THREE.Vector3(b[0], b[1], 0)
      )
    );
  }

  const curvePath = new THREE.CurvePath();
  curvePath.autoClose = true;
  curvePath.curves = lineSegments;

  return (
    <>
      <CameraControls
        prepCamera={(camera) => {
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
              color: new THREE.Color(0xa0a0a0).convertSRGBToLinear(),
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
              color: new THREE.Color(0xffffff).convertSRGBToLinear(),
              side: THREE.DoubleSide,
            },
          ]}
        />
      </mesh>

      <mesh position={new THREE.Vector3(0, 0, -0.25)}>
        <meshPhysicalMaterial
          args={[
            {
              color: new THREE.Color(0x6ebf).convertSRGBToLinear(),
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
            (u, v, vec) => {
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

function CameraControls({ prepCamera }) {
  const {
    camera,
    gl: { domElement },
  } = useThree();

  const [cameraReady, setCameraReady] = useState(false);

  useEffect(() => {
    prepCamera(camera);
    setCameraReady(true);
  }, [camera, prepCamera]);

  const controls = useRef();
  useFrame((state) => {
    if (controls.current) {
      controls.current.update();
    }
  });

  if (!cameraReady) return null;
  return (
    <orbitControls
      ref={controls}
      args={[camera, domElement]}
      enableDamping={true}
    />
  );
}
