import Feedback from "~/components/Feedback";
import Jump from "~/components/Jump";
import Share from "~/components/Share";

// small controls that hover in corner of screen
export default function ViewCorner() {
  const buttons = [
    ["Jump to top", <Jump />],
    ["Share page", <Share />],
    ["Site feedback", <Feedback />],
  ];

  return (
    <aside
      aria-label="Page controls"
      className="fixed right-2 bottom-2 z-20 flex flex-col items-end gap-2 mix-blend-difference **:text-[white] print:hidden"
    >
      {buttons.map(([label, button], index) => (
        <div key={index} className="group flex items-center gap-2 text-right">
          <div className="pointer-events-none opacity-0 transition select-none group-[:has(button:hover,button:focus-visible)]:opacity-100">
            {label}
          </div>
          {button}
        </div>
      ))}
    </aside>
  );
}
