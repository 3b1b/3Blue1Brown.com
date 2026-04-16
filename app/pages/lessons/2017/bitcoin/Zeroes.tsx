import { useEffect, useState } from "react";
import { celebrate } from "~/components/Celebrate";
import { Arrow, Hash, useHash } from "./Common";

export default function Zeroes() {
  const [nonce, setNonce] = useState("0");

  const prefix =
    "Alice pays Bob 100 LD\nBob pays Charlie 20 LD\nCharlie pays You 50 LD\n";
  const message = prefix + nonce;

  const hash = useHash(message);

  const count = (hash || "").split("1")[0]?.length ?? 0;

  useEffect(() => {
    if (count >= 6) celebrate();
  }, [count]);

  return (
    <div className="flex w-84 flex-col gap-2 self-center p-8">
      <pre>
        {prefix}
        <input
          type="number"
          step="1"
          min="0"
          aria-label="Nonce"
          className="mt-1 rounded-md bg-dark-gray p-1"
          value={nonce}
          onInput={(event) => setNonce(event.currentTarget.value)}
        />
      </pre>

      <Arrow />

      <div className="text-center text-success">
        {count >= 6
          ? `${count} zeroes! 🎉`
          : count > 1
            ? `${count} zeroes`
            : count === 1
              ? "1 zero"
              : "No zeroes"}
      </div>

      <Hash>
        <span className="text-white">{hash.substring(0, count)}</span>
        <span className="text-gray">{hash.substring(count)}</span>
      </Hash>
    </div>
  );
}
