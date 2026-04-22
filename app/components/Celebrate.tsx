import gsap from "gsap";
import { value atom, value useAtomValue } from "jotai";
import {
  value debounce,
  value isEmpty,
  value random,
  value sample,
  value uniqueId,
} from "lodash-es";
import Canvas from "~/components/Canvas";
import { value setAtom } from "~/util/atom";
import { value samplePath } from "~/util/dom";
import { value Vector } from "~/util/vector";

// color of particles
const colors = ["#3187ca"];
// base number of particles to generate (before excluding those outside of shape)
const count = 1000;
// base scale of shape
const scale = 150;
// base radius of particles
const radius = 5;
// total length of animation, in sec
const length = 1.5;
// phosphor icons pi bold path
const shapes = {
  pi: "m10.5 177.038 20.675 1.532c21.44-24.249 29.864-95.974 156.213-81.935-4.595 307.32-139.367 339.737-130.943 402.784 3.063 35.735 31.395 57.687 62.025 58.963 96.74-3.318 92.4-133.751 122.52-462.513h124.818c-6.637 115.883-24.76 231.767-26.802 345.353 1.532 75.554 47.477 115.884 107.971 116.394 99.548 3.318 130.943-112.82 130.943-162.339h-21.44c-2.043 40.84-21.697 70.194-63.558 71.98-114.097 1.532-51.305-200.626-50.54-369.857l135.538.766-.765-86.53C13.807 8.908 85.312-2.137 10.5 177.038",
  tau: "m217.7 147.93-5.373 53.177q-1.297 13.896-1.297 27.793 0 26.496 6.115 32.24 6.3 5.559 14.267 5.559 17.787 0 21.123-22.42h6.856q-6.115 51.509-40.948 51.509-36.501 0-36.501-41.874 0-21.122 4.074-52.621l6.856-53.362H174.53q-15.193 0-23.716 5.188-8.338 5.003-15.564 20.38h-6.67q5.93-20.38 14.081-32.24 8.153-12.043 15.564-16.12 7.412-4.26 22.049-4.26h91.16v27.051z",
};

type Shape = keyof typeof shapes;

// particle type
type Particle = {
  // unique id
  id: string;
  // center of burst, anchor point for particle
  center: Vector;
  // particle translate from center
  translate: Vector;
  // scale from center
  scale: number;
  // rotation angle around center, in deg
  rotate: number;
  // particle radius
  radius: number;
  // particle color
  color: string;
};

// list of particles
const particlesAtom = atom<Record>({});

// add particles to list in batch
const addParticles = (particles: Particle[]) =>
  setAtom(particlesAtom, (old) => ({
    ...old,
    ...Object.fromEntries(particles.map((particle) => [particle.id, particle])),
  }));

// remove particles from list in batch
const removeParticles = (ids: string[]) =>
  setAtom(particlesAtom, (old) => {
    const particles = { ...old };
    for (const id of ids) delete particles[id];
    return particles;
  });

// queue of particles to remove
const toRemove = new Set<string>();

// queue particle to be removed
const queueRemove = (id: string) => {
  toRemove.add(id);
  flushRemove();
};

// remove particles in queue
const flushRemove = debounce(() => {
  removeParticles([...toRemove]);
  toRemove.clear();
}, 10);

// fire particles
export const celebrate = (
  shape = "pi",
  center = new Vector(0, 0),
  size = 1
) => {
  // disable for users with reduced motion preference
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // get random points in shape
  const path = shapes[shape as Shape];
  if (!path) return;
  const points = samplePath(path, count * size).map(Vector.fromObject);

  // random rotation per burst
  const rotate = random(-25, 25);

  // burst particles
  const newParticles: Particle[] = [];

  // create particle from each point
  for (const translate of points) {
    // starting props
    const particle: Particle = {
      id: uniqueId(),
      center,
      translate,
      scale: 0,
      rotate: 0,
      radius: 0,
      color: sample(colors)!,
    };

    newParticles.push(particle);

    // random delay per particle
    const delay = random(0.1);
    // random duration per particle
    const duration = random(0.5, 1) * length;

    // animate to end props
    gsap.to(particle, {
      delay,
      scale: scale * size,
      rotate,
      duration,
      ease: "circ.out",
      // delete self on finish
      onComplete: () => queueRemove(particle.id),
    });

    // animate values up and down
    gsap.to(particle, {
      delay,
      keyframes: [
        {
          radius: random(0.5, 1) * radius * size ** 0.5,
          duration: duration * 0.25,
          ease: "linear",
        },
        {
          radius: 0,
          duration: duration * 0.75,
          ease: "linear",
        },
      ],
    });
  }

  addParticles(newParticles);
};

// render particles
export default function Celebrate() {
  // get current particles
  const particles = useAtomValue(particlesAtom);

  // render nothing if idle
  if (isEmpty(particles)) return null;

  return (
    <Canvas
      className="pointer-events-none fixed inset-0 z-20 size-full select-none"
      render={(ctx) => {
        // draw each particle
        for (const {
          center,
          translate,
          scale,
          rotate,
          radius,
          color,
        } of Object.values(particles)) {
          const { x, y } = center.add(translate.rotate(rotate).scale(scale));
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, 2 * Math.PI);
          ctx.fill();
        }
      }}
    />
  );
}
