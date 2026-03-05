import type { Atom, PrimitiveAtom, SetStateAction } from "jotai";
import { atom, getDefaultStore } from "jotai";
import { debounce } from "lodash-es";
import { addListen, navigate, removeListen } from "~/components/Navigate";

// convenient storeless atom getter
export const getAtom = <Value>(atom: Atom<Value>) =>
  getDefaultStore().get(atom);

// convenient storeless atom setter
export const setAtom = <Value>(
  atom: PrimitiveAtom<Value>,
  update: SetStateAction<Value>,
) => getDefaultStore().set(atom, update);

// create atom that syncs with url search param
export const atomWithQuery = (key: string, delay = 0) => {
  // https://jotai.org/docs/recipes/atom-with-listeners
  const base = atom("");

  // atom value
  const _atom = atom(
    (get) => get(base),
    (get, set, arg: SetStateAction<string>) => {
      set(base, arg);
      updateUrl(get(base));
    },
  );

  // update url when atom changes, debounced to avoid excessive history entries
  const updateUrl = debounce((value: string) => {
    const url = new URL(window.location.href);
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
    navigate(url.toString(), { state: key });
  }, delay);

  // update atom when url changes
  _atom.onMount = (set) => {
    const updateAtom = () => {
      // ignore if url change was caused by this atom
      if (history.state === key) return;
      const url = new URL(window.location.href);
      const value = url.searchParams.get(key) ?? "";
      set(value);
      updateUrl.cancel();
    };
    updateAtom();
    addListen(updateAtom);
    return () => removeListen(updateAtom);
  };

  return _atom;
};
