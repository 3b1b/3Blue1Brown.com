import gsap from "gsap";
import { atom, useAtomValue } from "jotai";
import { debounce, isEmpty, random, sample, size, uniqueId } from "lodash-es";
import Canvas from "~/components/Canvas";
import { getAtom, setAtom } from "~/util/atom";
import { samplePath } from "~/util/dom";
import { Vector } from "~/util/vector";

// number of particles to generate (before excluding those outside of shape)
const count = 1000;
// hard limit number of active particles
const maxParticles = 2000;
// color of particles
const colors = ["#3187ca"];
// total length of animation, in sec
const length = 1.5;
// size of shape
const scale = 120;
// radius of particles
const radius = 3;
// phosphor icons pi bold path
const shape = `M236,172a40,40,0,0,1-80,0V76H100V200a12,12,0,0,1-24,0V76H72a36,36,0,0,0-36,36,12,12,0,0,1-24,0A60.07,60.07,0,0,1,72,52H224a12,12,0,0,1,0,24H180v96a16,16,0,0,0,32,0,12,12,0,0,1,24,0Z`;

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
const particlesAtom = atom<Record<string, Particle>>({});

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
export const celebrate = (randPos = false) => {
  // disable for users with reduced motion preference
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // half screen dimensions
  const width = window.innerWidth / 2;
  const height = window.innerHeight / 2;

  // center of burst
  const center = new Vector(
    randPos ? random(-width, width) : 0,
    randPos ? random(-height, height) : 0,
  );

  // get random points in shape
  const points = samplePath(shape, count).map(Vector.fromObject);

  // random rotation per burst
  const rotate = random(-25, 25);

  // burst particles
  const newParticles: Particle[] = [];

  // create particle from each point
  for (const translate of points) {
    // hard limit number of particles
    if (size(getAtom(particlesAtom)) > maxParticles) break;

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
      scale,
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
          radius: random(0.5, 1) * radius,
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
      className="pointer-events-none fixed inset-0 z-100 size-full select-none"
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
