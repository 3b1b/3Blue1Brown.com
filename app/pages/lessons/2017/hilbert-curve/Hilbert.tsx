import { useState } from "react";
import _Hilbert from "~/components/Hilbert";
import NumberBox from "~/components/NumberBox";

export default function Hilbert() {
  const [depth, setDepth] = useState(5);
  const [angle, setAngle] = useState(90);
  const [breaks, setBreaks] = useState(4);

  return (
    <>
      <_Hilbert depth={depth} angle={angle} breaks={breaks} />

      <div className="absolute top-0 left-0 flex items-end gap-4 p-4 text-black">
        <NumberBox
          label="Depth"
          value={depth}
          onChange={setDepth}
          min={1}
          max={8}
        />
        <NumberBox
          label="Angle"
          value={angle}
          onChange={setAngle}
          min={0}
          max={360}
        />
        <NumberBox
          label="Breaks"
          value={breaks}
          onChange={setBreaks}
          min={0}
          max={10}
        />
      </div>
    </>
  );
}
