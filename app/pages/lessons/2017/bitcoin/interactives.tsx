import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { ArrowDownIcon, LineVerticalIcon } from "@phosphor-icons/react";
import { celebrate } from "~/components/Celebrate";
import Textbox from "~/components/Textbox";

export function Sha() {
  const [message, setMessage] = useState(
    "A purely peer-to-peer version of electronic cash would allow online payments to be sent directly from one party to another without going through a financial institution.",
  );

  const hash = useHash(message);

  return (
    <div className="flex w-84 flex-col gap-2 self-center">
      <Textbox
        multi
        placeholder="Message to encode"
        rows={3}
        value={message}
        onChange={setMessage}
      />
      <Arrow />
      <Hash>{hash}</Hash>
    </div>
  );
}

export function Zeroes() {
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
    <div className="flex w-84 flex-col gap-2 self-center">
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

const useHash = (message: string) => {
  const [hash, setHash] = useState("");

  useEffect(() => {
    let latest = true;

    (async () => {
      const encoder = new TextEncoder();
      const data = encoder.encode(message);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashString = hashArray
        .map((byte) => byte.toString(2).padStart(8, "0"))
        .join("");
      if (latest) setHash(hashString);
    })();

    return () => {
      latest = false;
    };
  }, [message]);

  return hash;
};

function Arrow() {
  return (
    <div className="flex animate-pulse flex-col items-center text-success">
      <LineVerticalIcon />
      SHA256
      <ArrowDownIcon />
    </div>
  );
}

function Hash({ children }: { children: ReactNode }) {
  return (
    <pre className="whitespace-normal">
      <code className="wrap-anywhere">{children}</code>
    </pre>
  );
}
