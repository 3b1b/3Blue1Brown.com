import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { ArrowDownIcon, LineVerticalIcon } from "@phosphor-icons/react";

export const useHash = (message: string) => {
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

export function Arrow() {
  return (
    <div className="flex animate-pulse flex-col items-center text-success">
      <LineVerticalIcon />
      SHA256
      <ArrowDownIcon />
    </div>
  );
}

export function Hash({ children }: { children: ReactNode }) {
  return (
    <pre className="whitespace-normal">
      <code className="wrap-anywhere">{children}</code>
    </pre>
  );
}
