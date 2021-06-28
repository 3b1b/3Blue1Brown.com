import { useCallback, useState } from "react";

// force re-render of component by updating an arbitrary state
export const useForceUpdate = () => {
  const [, setValue] = useState(0);
  return useCallback(() => setValue((value) => value + 1), []);
};
