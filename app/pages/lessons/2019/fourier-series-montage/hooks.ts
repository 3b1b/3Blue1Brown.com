import type * as ComputationAPI from "./computation";
import { useEffect, useState } from "react";
import { wrap } from "comlink";
import { useClient } from "~/util/hooks";
import { Vector } from "~/util/vector";
import ComputationWorker from "./computation?worker";

export const useComputation = (list: string, count: number, basic = false) => {
  // status
  const [computing, setComputing] = useState(false);

  const client = useClient();

  // result
  const [result, setResult] = useState<
    Awaited<ReturnType<typeof ComputationAPI.compute>>
  >({ points: [], epicycles: [] });

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
        const { points, epicycles } = await thread.compute(list, count, basic);
        // if this computation stale, ignore
        if (!latest) return;
        // set results
        setResult({
          points:
            // convert back to vector (class cannot be serialized across web worker boundary)
            points.map(Vector.fromObject),
          epicycles,
        });
        // done
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
  }, [client, list, count, basic]);

  return { ...result, computing };
};
