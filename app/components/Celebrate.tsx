import gsap from "gsap";
import { atom, useAtomValue } from "jotai";
import { isEmpty, random, sample, uniqueId } from "lodash-es";
import Canvas from "~/components/Canvas";
import { setAtom } from "~/util/atom";
import { samplePath } from "~/util/dom";
import { Vector } from "~/util/vector";

// number of particles (before excluding those outside of shape)
const count = 1000;
// color of particles
const colors = ["#3187ca"];
// total length of animation, in sec
const length = 1;
// size of shape
const scale = 150;
// size of particles
const size = 3;
// phosphor icons pi bold path
const shape = `M236,172a40,40,0,0,1-80,0V76H100V200a12,12,0,0,1-24,0V76H72a36,36,0,0,0-36,36,12,12,0,0,1-24,0A60.07,60.07,0,0,1,72,52H224a12,12,0,0,1,0,24H180v96a16,16,0,0,0,32,0,12,12,0,0,1,24,0Z`;

// particle type
type Particle = {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
};

// list of particles
const particlesAtom = atom<Record<string, Particle>>({});

// add particle to list
const addParticle = (particle: Particle) =>
  setAtom(particlesAtom, (particles) => ({
    ...particles,
    [particle.id]: particle,
  }));

// remove particle from list
const removeParticle = (id: string) =>
  setAtom(particlesAtom, (particles) => {
    const newParticles = { ...particles };
    delete newParticles[id];
    return newParticles;
  });

// fire particles
export const celebrate = (randPos = false) => {
  // disable for users with reduced motion preference
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // half screen dimensions
  const width = window.innerWidth / 2;
  const height = window.innerHeight / 2;

  // center of explosion
  const centerX = randPos ? random(-width, width) : 0;
  const centerY = randPos ? random(-height, height) : 0;

  // get random points in shape
  const rotate = random(-25, 25);
  const points = samplePath(shape, count).map(({ x, y }) =>
    Vector.fromObject({ x: x * scale, y: y * scale }).rotate(rotate),
  );

  // create particle from each point
  for (const { x, y } of points) {
    // starting props
    const particle: Particle = {
      id: uniqueId(),
      x: centerX,
      y: centerY,
      size: 0,
      color: sample(colors)!,
    };
    const duration = random(length * 0.5, length);
    // animate to end props
    gsap
      .timeline({
        delay: random(0.25, true),
        // delete self on finish
        onComplete: () => removeParticle(particle.id),
      })
      // animate position
      .to(particle, {
        x: centerX + x,
        y: centerY + y,
        duration,
        ease: "circ.out",
      })
      // animate size
      .to(
        particle,
        {
          size: random(size * 0.5, size),
          duration: duration * 0.5,
          ease: "linear",
        },
        0,
      )
      .to(
        particle,
        {
          size: 0,
          duration: duration * 0.5,
          ease: "linear",
        },
        ">",
      );

    // add self
    addParticle(particle);
  }
};

// render particles
export default function Celebrate() {
  const particles = useAtomValue(particlesAtom);

  if (isEmpty(particles)) return null;

  return (
    <Canvas
      className="pointer-events-none fixed inset-0 z-100 size-full select-none"
      render={(ctx) => {
        // draw each particle
        for (const { x, y, size, color } of Object.values(particles)) {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, 2 * Math.PI);
          ctx.fill();
        }
      }}
    />
  );
}
