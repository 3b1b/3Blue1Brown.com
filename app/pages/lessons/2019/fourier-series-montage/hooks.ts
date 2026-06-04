import type { Vector } from "~/util/vector";
import type * as ComputationAPI from "./computation";
import type { Epicycle } from "./computation";
import { useEffect, useMemo, useState } from "react";
import { wrap } from "comlink";
import { useClient } from "~/util/hooks";
import ComputationWorker from "./computation?worker";

export const useComputation = (points: Vector[], count: number) => {
  const client = useClient();

  // create web worker thread
  const worker = useMemo(
    () =>
      client ? wrap<typeof ComputationAPI>(new ComputationWorker()) : undefined,
    [client],
  );

  // result
  const [epicycles, setEpicycles] = useState<Epicycle[]>([]);

  // re-search when search changes
  useEffect(() => {
    if (!worker) return;
    let latest = true;

    (async () => {
      const epicycles = await worker.getEpicycles(points, count);
      if (!latest) return;
      setEpicycles(epicycles);
    })();

    return () => {
      latest = false;
    };
  }, [worker, points, count]);

  return epicycles;
};
