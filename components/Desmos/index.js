import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { useDesmos } from "./useDesmos";

const Desmos = ({ options, settings, expressions }) => {
  /* Get the desmos object from context */
  const desmos = useDesmos();
  /* Setup a ref for the desmos graph element. */
  const ref = useRef(null);
  /* The local state of this calculator instance. */
  const [graph, setGraph] = useState(null);

  /* Instantiate the graph if element and desmos are available
   * and the graph has not been defined already.
   */
  useEffect(() => {
    if (ref.current && desmos && !graph) {
      setGraph(
        desmos.GraphingCalculator(ref.current, { ...options, ...settings }),
      );
    }
    return () => {};
  }, [desmos, graph, options, settings]);

  /* Set the graph's expressions if graph exists and trigger
   * rerender when the prop is changed.
   */
  useEffect(() => {
    if (graph) {
      graph.setExpressions([]);
      expressions.forEach((expr) => {
        graph.setExpression(expr);
      });
    }
    () => {
      graph.destroy();
    };
  }, [graph, expressions]);

  /* Return the desmos element to bind the graph. */
  return (
    <div
      ref={ref}
      style={{ width: "100%", height: "500px", margin: "0px auto" }}
    ></div>
  );
};

export default Desmos;
