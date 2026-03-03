import type { ReactNode } from "react";
import { Suspense } from "react";
import { Await as _Await } from "react-router";

type Props<Result> = {
  promise: () => Promise<Result>;
  children: (value: NonNullable<Result>) => ReactNode;
};

// convenience wrapper around react router await component
export default function Await<Result>({ promise, children }: Props<Result>) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <_Await resolve={promise()}>
        {(result) => {
          if (result === null || result === undefined) return null;
          return children(result);
        }}
      </_Await>
    </Suspense>
  );
}
