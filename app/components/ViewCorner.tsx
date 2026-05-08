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
      className="fixed right-0 bottom-0 z-20 flex flex-col mix-blend-difference transition **:text-[white] max-md:**:text-sm print:hidden"
    >
      {buttons.map(([label, button], index) => (
        <div key={index} className="group flex items-center gap-4 text-right">
          <div className="pointer-events-none grow opacity-0 transition select-none group-[:has(button:hover,button:focus-visible)]:opacity-100">
            {label}
          </div>
          {button}
        </div>
      ))}
    </aside>
  );
}
