import { useEffect } from "react";
import { random } from "lodash-es";
import { celebrate } from "~/components/Celebrate";
import { sleep } from "~/util/async";
import { Vector } from "~/util/vector";

// ???
export const useEgg = () => {
  useEffect(() => {
    (async () => {
      const today = new Date();
      let shape = "";
      if (today.getMonth() + 1 === 3 && today.getDate() === 14) shape = "pi";
      if (today.getMonth() + 1 === 6 && today.getDate() === 28) shape = "tau";
      // shape = "pi";
      if (!shape) return;
      for (let bursts = 20; bursts > 0; bursts--) {
        celebrate(shape, new Vector(random(-1, 1, true), random(-1, 1, true)));
        await sleep(250);
      }
      await sleep(500);
      celebrate(shape, new Vector(0, 0), 1);
    })();
  }, []);
};
