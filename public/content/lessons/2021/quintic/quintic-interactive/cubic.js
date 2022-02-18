import { useState, useEffect, Fragment } from "react";
import styles from "./index.module.scss";
import {
  Complex,
  useRootsAndCoeffs,
  usePointCycler,
  restrictPointValue,
  sortToMinimizeDistances,
} from "./common";

import GraphWindow, {
  GraphPoint,
  GraphTrail,
  GraphLines,
} from "../../../../../../components/Graph";

import Markdownify from "../../../../../../components/Markdownify";

export default function CubicInteractive({
  initialRoots = [
    [-1.3247, 0.0],
    [0.66236, -0.56228],
    [0.66236, 0.56228],
  ],
}) {
  const {
    roots,
    setRoots,
    setRoot,
    coefficients,
    setCoefficient,
    setCoefficients,
  } = useRootsAndCoeffs(initialRoots);

  const [isSelecting, setIsSelecting] = useState(false);
  const [selection, setSelection] = useState({ coeffs: [], roots: [] });

  const togglePointSelected = (type, point) => {
    const otherType = type === "coeffs" ? "roots" : "coeffs";
    setSelection((selection) => {
      const isSelected = selection[type].includes(point);
      return {
        [otherType]: [],
        [type]: isSelected
          ? selection[type].filter((p) => p !== point)
          : [...selection[type], point],
      };
    });
  };

  const [cyclePoints, isCycling] = usePointCycler(
    roots,
    setRoots,
    coefficients,
    setCoefficients
  );

  const parts = useCubicParts(coefficients[1], coefficients[0]);

  return (
    <div className={styles.container + " " + styles.cubic}>
      <div className={styles.controls}>
        <div>
          <button
            className={styles.controlButton}
            disabled={!isSelecting}
            onClick={() => {
              setIsSelecting(false);
              setSelection({ coeffs: [], roots: [] });
            }}
          >
            <i className="fas fa-arrows-alt"></i> Move
          </button>
          <button
            className={styles.controlButton}
            disabled={isSelecting}
            onClick={() => setIsSelecting(true)}
          >
            <i className="fas fa-hand-pointer"></i> Select
          </button>
        </div>
      </div>
      <div className={styles.coeffs}>
        <div className={styles.cubicHeader}>
          <Markdownify
            noParagraph={true}
          >{String.raw`$\text{Coefficients}$`}</Markdownify>
          <div style={{ position: "relative", left: 12 }}>
            <Markdownify noParagraph={true}>
              {String.raw`$ {\small x^3 +
\textcolor{red}{0} x^2 +
\textcolor{red}{p} x +
\textcolor{red}{q} =}$`}
            </Markdownify>
          </div>
        </div>
        <div className={styles.graph}>
          <GraphWindow width={300} height={250} center={[0, 0]} radius={3.5}>
            <GraphLines step={0.2} color="#1b1b1b" labels={false} />
            <GraphLines
              step={1}
              color="#3d3d3d"
              labels={true}
              labelY={(n) => `${n}i`}
              labelStr={(n, axis) => {
                let str = new Intl.NumberFormat().format(n);
                if (axis === "y") str += "i";
                return str;
              }}
              fontSize={18}
            />

            {coefficients.slice(0, -1).map((coeff, i) => (
              <Fragment key={i}>
                <GraphPoint
                  x={coeff[0]}
                  y={coeff[1]}
                  onDrag={
                    !isSelecting && i !== 2
                      ? (newValue) => {
                          newValue = restrictPointValue(newValue, -3.5, 3.5);
                          setCoefficient(i, newValue);
                        }
                      : undefined
                  }
                  onClick={
                    isSelecting && i !== 2
                      ? () => togglePointSelected("coeffs", i)
                      : undefined
                  }
                  selected={isSelecting && selection.coeffs.includes(i)}
                  size={12}
                  color="red"
                  label={
                    <Markdownify noParagraph={true}>
                      {String.raw`$${["q", "p", "0", ""][i]}$`}
                    </Markdownify>
                  }
                />
                <GraphTrail
                  x={coeff[0]}
                  y={coeff[1]}
                  size={6}
                  color="red"
                  duration={800}
                />
              </Fragment>
            ))}

            {isSelecting && selection.coeffs.length > 0 && (
              <button
                className={styles.actionButton}
                disabled={isCycling}
                onClick={() => cyclePoints("coeffs", selection.coeffs)}
              >
                <i className="fas fa-sync-alt"></i> Cycle{" "}
                {selection.coeffs.length}{" "}
                {selection.coeffs.length === 1 ? "coefficient" : "coefficients"}
              </button>
            )}
          </GraphWindow>
        </div>
      </div>
      <div className={styles.roots}>
        <div className={styles.cubicHeader}>
          <div style={{ position: "relative", left: 8 }}>
            <Markdownify noParagraph={true}>
              {String.raw`$ {\small
(x - \textcolor{gold}{r_0})
(x - \textcolor{gold}{r_1})
(x - \textcolor{gold}{r_2})}$`}
            </Markdownify>
          </div>
          <Markdownify
            noParagraph={true}
          >{String.raw`$\text{Roots}$`}</Markdownify>
        </div>
        <div className={styles.graph}>
          <GraphWindow width={300} height={250} center={[0, 0]} radius={2.5}>
            <GraphLines step={0.2} color="#222" labels={false} />
            <GraphLines
              step={1}
              color="#444"
              labels={true}
              labelY={(n) => `${n}i`}
              labelStr={(n, axis) => {
                let str = new Intl.NumberFormat().format(n);
                if (axis === "y") str += "i";
                return str;
              }}
              fontSize={18}
            />

            {roots.map((root, i) => (
              <Fragment key={i}>
                <GraphPoint
                  x={root[0]}
                  y={root[1]}
                  onClick={
                    isSelecting
                      ? () => togglePointSelected("roots", i)
                      : undefined
                  }
                  selected={isSelecting && selection.roots.includes(i)}
                  size={12}
                  color="yellow"
                  label={
                    <Markdownify noParagraph={true}>
                      {String.raw`$r_{${i}}$`}
                    </Markdownify>
                  }
                />
                <GraphTrail
                  x={root[0]}
                  y={root[1]}
                  size={6}
                  color="yellow"
                  duration={800}
                />
              </Fragment>
            ))}

            {isSelecting && selection.roots.length > 1 && (
              <button
                className={styles.actionButton}
                disabled={isCycling}
                onClick={() => cyclePoints("roots", selection.roots)}
              >
                <i className="fas fa-sync-alt"></i> Cycle{" "}
                {selection.roots.length}{" "}
                {selection.roots.length === 1 ? "root" : "roots"}
              </button>
            )}
          </GraphWindow>
        </div>
      </div>
      <div className={styles.part1}>
        <div className={styles.graph}>
          <GraphWindow width={195} height={150} center={[0, 0]} radius={1}>
            <GraphLines step={0.25} color="#222" labels={false} />
            <GraphLines
              step={0.5}
              color="#444"
              labels={true}
              labelY={(n) => `${n}i`}
              labelStr={(n, axis) => {
                let str = new Intl.NumberFormat().format(n);
                if (axis === "y") str += "i";
                return str;
              }}
              fontSize={12}
            />

            {parts.a.map((point, i) => (
              <Fragment key={i}>
                <GraphPoint
                  x={point[0]}
                  y={point[1]}
                  size={12}
                  color="green"
                  label={
                    <Markdownify noParagraph={true}>
                      {String.raw`$\delta_{${i}}$`}
                    </Markdownify>
                  }
                />
                <GraphTrail
                  x={point[0]}
                  y={point[1]}
                  size={6}
                  color="green"
                  duration={800}
                />
              </Fragment>
            ))}
          </GraphWindow>
        </div>
        <Markdownify noParagraph={true}>
          {String.raw`$ {\scriptsize
\textcolor{green}{\delta_1}, \textcolor{green}{\delta_2} = \sqrt{
  \frac{q^2}{4} + \frac{p^3}{27}
}}$`}
        </Markdownify>
      </div>
      <div className={styles.part2}>
        <div className={styles.graph}>
          <GraphWindow width={195} height={150} center={[0, 0]} radius={2}>
            <GraphLines step={0.2} color="#222" labels={false} />
            <GraphLines
              step={1}
              color="#444"
              labels={true}
              labelY={(n) => `${n}i`}
              labelStr={(n, axis) => {
                let str = new Intl.NumberFormat().format(n);
                if (axis === "y") str += "i";
                return str;
              }}
              fontSize={12}
            />

            {parts.b.red.map((point, i) => (
              <Fragment key={i}>
                <GraphPoint x={point[0]} y={point[1]} size={12} color="red" />
                <GraphTrail
                  x={point[0]}
                  y={point[1]}
                  size={6}
                  color="red"
                  duration={800}
                />
              </Fragment>
            ))}
            {parts.b.blue.map((point, i) => (
              <Fragment key={i}>
                <GraphPoint x={point[0]} y={point[1]} size={12} color="blue" />
                <GraphTrail
                  x={point[0]}
                  y={point[1]}
                  size={6}
                  color="blue"
                  duration={800}
                />
              </Fragment>
            ))}
          </GraphWindow>
        </div>
        <Markdownify noParagraph={true}>
          {String.raw`$ {\scriptsize
\textcolor{red}{\bullet} = \sqrt[3]{-\frac{q}{2} + \textcolor{green}{\delta_1}}
\quad
\textcolor{blue}{\bullet} = \sqrt[3]{-\frac{q}{2} + \textcolor{green}{\delta_2}}
}$`}
        </Markdownify>
      </div>
      <div className={styles.part3}>
        <div className={styles.graph}>
          <GraphWindow width={195} height={150} center={[0, 0]} radius={2}>
            <GraphLines step={0.2} color="#222" labels={false} />
            <GraphLines
              step={1}
              color="#444"
              labels={true}
              labelY={(n) => `${n}i`}
              labelStr={(n, axis) => {
                let str = new Intl.NumberFormat().format(n);
                if (axis === "y") str += "i";
                return str;
              }}
              fontSize={12}
            />

            {parts.c.map(({ point, correct }, i) => (
              <Fragment key={i}>
                <GraphPoint
                  x={point[0]}
                  y={point[1]}
                  size={12}
                  color={correct ? "yellow" : "#7f7f0e"}
                  glow={correct}
                />
                <GraphTrail
                  x={point[0]}
                  y={point[1]}
                  size={6}
                  color={correct ? "yellow" : "#7f7f0e"}
                  duration={800}
                />
              </Fragment>
            ))}
          </GraphWindow>
        </div>
        <Markdownify noParagraph={true}>
          {String.raw`$ {\scriptsize
\sqrt[3]{-\frac{q}{2} + \delta_1} +
\sqrt[3]{-\frac{q}{2} + \delta_2}
}$`}
        </Markdownify>
      </div>
    </div>
  );
}

function cubicParts(p, q, prevParts = null) {
  let deltas = Complex.roots(
    2,
    Complex.add(
      Complex.scale(1 / 4, Complex.power(q, 2)),
      Complex.scale(1 / 27, Complex.power(p, 3))
    )
  );

  if (prevParts) {
    deltas = sortToMinimizeDistances(deltas, prevParts.a);
  }

  let [red, blue] = deltas.map((delta) =>
    Complex.roots(3, Complex.subtract(delta, Complex.scale(1 / 2, q)))
  );

  if (prevParts) {
    red = sortToMinimizeDistances(red, prevParts.b.red);
    blue = sortToMinimizeDistances(blue, prevParts.b.blue);
  }

  let possibleRoots = red.flatMap((r) => blue.map((b) => Complex.add(r, b)));

  if (prevParts) {
    possibleRoots = sortToMinimizeDistances(
      possibleRoots,
      prevParts.c.map(({ point }) => point)
    );
  }

  // Of the possible roots, we need to find the three
  // which are closest to the actual roots.
  const getRootCorrectness = (point) => {
    return Complex.abs(
      Complex.add(Complex.power(point, 3), Complex.multiply(p, point), q)
    )[0];
  };

  possibleRoots = possibleRoots.map((point) => ({
    point,
    correctness: getRootCorrectness(point),
  }));

  const topThree = [...possibleRoots]
    .sort((a, b) => a.correctness - b.correctness)
    .slice(0, 3)
    .map(({ point }) => point);

  possibleRoots = possibleRoots.map((option) => ({
    ...option,
    correct: topThree.includes(option.point),
  }));

  console.log(possibleRoots);

  return {
    a: deltas,
    b: { red, blue },
    c: possibleRoots,
  };
}

function useCubicParts(p, q) {
  const [parts, setParts] = useState(cubicParts(p, q));

  useEffect(() => {
    setParts((prevParts) => {
      return cubicParts(p, q, prevParts);
    });
  }, [p, q]);

  return parts;
}
