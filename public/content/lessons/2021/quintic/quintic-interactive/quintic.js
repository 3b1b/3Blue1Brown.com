import { useState, Fragment } from "react";
import styles from "./index.module.scss";
import {
  useRootsAndCoeffs,
  usePointCycler,
  restrictPointValue,
} from "./common";

import GraphWindow, {
  GraphPoint,
  GraphTrail,
  GraphLines,
} from "../../../../../../components/Graph";

import Markdownify from "../../../../../../components/Markdownify";

export default function QuinticInteractive({
  initialRoots = [
    [-1.3247, 0.0],
    [0.0, 1.0],
    [0.0, -1.0],
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

  return (
    <div className={styles.container}>
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
        <Markdownify noParagraph={true}>
          {String.raw`$\text{Coefficients} \\
{\scriptsize x^5 +
\textcolor{red}{c_4} x^4 +
\textcolor{red}{c_3} x^3 +
\textcolor{red}{c_2} x^2 +
\textcolor{red}{c_1} x +
\textcolor{red}{c_0}}$`}
        </Markdownify>
        <div className={styles.graph}>
          <GraphWindow width={300} height={300} center={[0, 0]} radius={3.5}>
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

            {coefficients.slice(0, -1).map((coeff, i) => (
              <Fragment key={i}>
                <GraphPoint
                  x={coeff[0]}
                  y={coeff[1]}
                  onDrag={
                    !isSelecting
                      ? (newValue) => {
                          newValue = restrictPointValue(newValue, -3.5, 3.5);
                          setCoefficient(i, newValue);
                        }
                      : undefined
                  }
                  onClick={
                    isSelecting
                      ? () => togglePointSelected("coeffs", i)
                      : undefined
                  }
                  selected={isSelecting && selection.coeffs.includes(i)}
                  size={12}
                  color="red"
                  label={
                    <Markdownify noParagraph={true}>
                      {String.raw`$c_{${i}}$`}
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
        <Markdownify noParagraph={true}>
          {String.raw`$\text{Roots} \\
{\scriptsize (x - \textcolor{gold}{r_0})
(x - \textcolor{gold}{r_1})
(x - \textcolor{gold}{r_2})
(x - \textcolor{gold}{r_3})
(x - \textcolor{gold}{r_4})}$`}
        </Markdownify>
        <div className={styles.graph}>
          <GraphWindow width={300} height={300} center={[0, 0]} radius={2.5}>
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
                  onDrag={
                    !isSelecting
                      ? (newValue) => {
                          newValue = restrictPointValue(newValue, -2.5, 2.5);
                          setRoot(i, newValue);
                        }
                      : undefined
                  }
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

            {isSelecting && selection.roots.length > 0 && (
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
    </div>
  );
}
