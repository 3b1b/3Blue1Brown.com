import type * as ComputationAPI from "./computation";
import { useEffect, useMemo, useState } from "react";
import { wrap } from "comlink";
import { useClient } from "~/util/hooks";
import { Vector } from "~/util/vector";
import ComputationWorker from "./computation?worker";

export const useComputation = (list: string, count: number, basic = false) => {
  const client = useClient();

  // create web worker thread
  const worker = useMemo(
    () =>
      client ? wrap<typeof ComputationAPI>(new ComputationWorker()) : undefined,
    [client],
  );

  // result
  const [result, setResult] = useState<
    ReturnType<typeof ComputationAPI.compute>
  >({ points: [], epicycles: [] });

  // re-search when search changes
  useEffect(() => {
    if (!worker) return;
    let latest = true;

    (async () => {
      const { points, epicycles } = await worker.compute(list, count, basic);
      if (!latest) return;
      setResult({
        points:
          // convert back to vector (class cannot be serialized across web worker boundary)
          points.map(Vector.fromObject),
        epicycles,
      });
    })();

    return () => {
      latest = false;
    };
  }, [worker, list, count, basic]);

  return result;
};
