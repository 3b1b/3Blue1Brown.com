import { PiIcon } from "@phosphor-icons/react";
import { mapValues, orderBy, range } from "lodash-es";
import { pathToPoints } from "~/util/dom";
import { Vector } from "~/util/vector";

const examples = mapValues(
  {
    pi: "m10.5 177.038 20.675 1.532c21.44-24.249 29.864-95.974 156.213-81.935-4.595 307.32-139.367 339.737-130.943 402.784 3.063 35.735 31.395 57.687 62.025 58.963 96.74-3.318 92.4-133.751 122.52-462.513h124.818c-6.637 115.883-24.76 231.767-26.802 345.353 1.532 75.554 47.477 115.884 107.971 116.394 99.548 3.318 130.943-112.82 130.943-162.339h-21.44c-2.043 40.84-21.697 70.194-63.558 71.98-114.097 1.532-51.305-200.626-50.54-369.857l135.538.766-.765-86.53C13.807 8.908 85.312-2.137 10.5 177.038",
    tau: "m217.7 147.93-5.373 53.177q-1.297 13.896-1.297 27.793 0 26.496 6.115 32.24 6.3 5.559 14.267 5.559 17.787 0 21.123-22.42h6.856q-6.115 51.509-40.948 51.509-36.501 0-36.501-41.874 0-21.122 4.074-52.621l6.856-53.362H174.53q-15.193 0-23.716 5.188-8.338 5.003-15.564 20.38h-6.67q5.93-20.38 14.081-32.24 8.153-12.043 15.564-16.12 7.412-4.26 22.049-4.26h91.16v27.051z",
  },
  (path) => pathToPoints(path, 200),
);

console.log(examples);

export default function Fourier() {
  return <div></div>;
}

// discrete fourier transform
const dft = (points: Vector[]) =>
  orderBy(
    range(points.length).map((frequency) => {
      let result = new Vector();
      points.forEach((point, index) => {
        result = result.add(
          point.rotate((360 * frequency * index) / points.length),
        );
      });
      result = result.scale(1 / points.length);
      return {
        frequency,
        amplitude: result.length(),
        phase: result.angle(),
      };
    }),
    (point) => point.amplitude,
  );
