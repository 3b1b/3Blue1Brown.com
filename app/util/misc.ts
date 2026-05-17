type Variations = Record<string, readonly unknown[]>;

type Permutations<Type extends Variations> = {
  // go through each array value and convert to union of possible values
  [Key in keyof Type]: Type[Key][number];
};

// get all combinations of props
export const getVariants = <Type extends Variations>(props: Type) =>
  Object.keys(props).reduce<Partial<Permutations<Type>>[]>(
    (combinations, key) =>
      combinations.flatMap(
        (combination) =>
          props[key]?.map((value) => ({ ...combination, [key]: value })) ?? [],
      ),
    [{}],
  ) as Permutations<Type>[];

// type-safe Object.toEntries
export const toEntries = <Key extends PropertyKey, Value>(
  object: Record<Key, Value>,
) => Object.entries(object) as [Key, Value][];

// type-safe Object.fromEntries
export const fromEntries = <Key extends PropertyKey, Value>(
  entries: [Key, Value][],
) => Object.fromEntries(entries) as Record<Key, Value>;

// type-safe object entries map
export const mapEntries = <
  OldKey extends PropertyKey,
  OldValue,
  NewKey extends PropertyKey,
  NewValue,
>(
  object: Record<OldKey, OldValue>,
  func: (key: OldKey, value: OldValue) => [NewKey, NewValue],
) => {
  const entries = toEntries(object);
  const mapped = entries.map(([key, value]) => func(key, value));
  return fromEntries(mapped);
};
