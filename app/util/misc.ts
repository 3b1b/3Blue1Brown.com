// wait ms
export const sleep = async (ms = 0) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// wait for next animation frame (after async tasks like react rendering but before browser repaint)
export const frame = () =>
  new Promise((resolve) => requestAnimationFrame(() => resolve(true)));

// now shorthand
export const now = () => window.performance.now();

// wait for func to return, checking periodically
export const waitFor = async <Return>(
  func: () => Return,
): Promise<Return | undefined> => {
  // custom exponential backoff
  const waits = [
    0, 1, 5, 10, 20, 30, 40, 50, 100, 200, 300, 400, 500, 1000, 2000, 3000,
  ];
  while (waits.length) {
    const result = func();
    if (result !== undefined && result !== null) return result;
    await sleep(waits.shift());
  }
};

// wait for func to return stable value
export const waitForStable = async <Return>(
  func: () => Return,
  // wait until func returns same value for at least this long
  wait = 1000,
  // check value every this many ms
  interval = 10,
  // hard limit on number of checks
  tries = 100,
): Promise<Return | undefined> => {
  let lastChanged = now();
  let prevResult: Return | undefined;
  for (; tries > 0; tries--) {
    const result = func();
    if (result !== prevResult) lastChanged = now();
    prevResult = result;
    if (result !== undefined && now() - lastChanged > wait) return result;
    await sleep(interval);
  }
};

type Variations = Record<string, readonly unknown[]>;

type Permutations<Type extends Variations> = {
  // go through each array value and convert to union of possible values
  [Key in keyof Type]: Type[Key][number];
};

// get all combinations of props
export const getVariants = <Type extends Variations>(
  props: Type,
): Permutations<Type>[] =>
  Object.keys(props).reduce<Partial<Permutations<Type>>[]>(
    (combinations, key) =>
      combinations.flatMap(
        (combination) =>
          props[key]?.map((value) => ({
            ...combination,
            [key]: value,
          })) ?? [],
      ),
    [{}],
  ) as Permutations<Type>[];
