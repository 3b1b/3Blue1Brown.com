import type { Vector } from "~/util/vector";
import type * as ComputationAPI from "./computation";
import { useEffect, useState } from "react";
import { wrap } from "comlink";
import { useClient } from "~/util/hooks";
import ComputationWorker from "./computation?worker";

export const useComputation = (points: Vector[], count: number) => {
  // status
  const [computing, setComputing] = useState(false);

  const client = useClient();

  // result
  const [epicycles, setEpicycles] = useState<
    Awaited<ReturnType<typeof ComputationAPI.compute>>
  >([]);

  // re-search when search changes
  useEffect(() => {
    if (!client) return;
    // is this computation latest
    let latest = true;

    // create new worker thread
    const worker = new ComputationWorker();
    const thread = wrap<typeof ComputationAPI>(worker);

    (async () => {
      // in progress
      setComputing(true);

      try {
        const epicycles = await thread.compute(points, count);
        // if this computation stale, ignore
        if (!latest) return;
        // set results
        setEpicycles(epicycles);
        setComputing(false);
      } catch (error) {
        console.error(error);
      }
    })();

    // clean-up
    return () => {
      // mark local computation as stale
      latest = false;
      // abort any pending work
      worker.terminate();
    };
  }, [client, points, count]);

  return { epicycles, computing };
};
