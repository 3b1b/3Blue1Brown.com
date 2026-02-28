import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { ListBulletsIcon, XIcon } from "@phosphor-icons/react";
import {
  useClickOutside,
  useElementSize,
  useEventListener,
  useWindowSize,
} from "@reactuses/core";
import clsx from "clsx";
import { useAtomValue } from "jotai";
import { headingsAtom } from "~/components/Heading";
import Link from "~/components/Link";
import { firstInView, scrollTo } from "~/util/dom";
import { useChanged, useInView } from "~/util/hooks";

// spacing between toc and section content
const spacing = 100;

export default function TableOfContents() {
  const ref = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLAnchorElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // full heading details
  const headings = useAtomValue(headingsAtom);

  // get associated elements
  useEffect(() => {
    headerRef.current = document.querySelector("header");
    sectionRef.current = document.querySelector("section");
  }, []);

  // completely hide if header in view
  const headerInView = useInView(headerRef, true);

  // measure widths
  const { width: windowWidth } = useWindowSize();
  const [tocWidth] = useElementSize(ref);
  const [sectionWidth] = useElementSize(sectionRef);

  // available width in margins
  const availableWidth = (windowWidth - sectionWidth) / 2;

  // view is too narrow to fit toc w/o overlapping content
  const tooNarrow = tocWidth + 2 * spacing > availableWidth;

  // complete hide state
  const hide = headerInView;

  // expanded/collapsed state
  const [open, setOpen] = useState(false);

  // when hide changes, change open
  if (useChanged(hide) && !tooNarrow) setOpen(!hide);

  // when tooNarrow changes, change open
  if (useChanged(tooNarrow)) setOpen(!tooNarrow);

  // when path changes, change open
  const { pathname } = useLocation();
  if (useChanged(pathname, false)) setOpen(false);

  // on click off, change open
  useClickOutside(ref, () => {
    if (tooNarrow) setOpen(false);
  });

  // active index
  const [active, setActive] = useState(0);

  // on window scroll
  useEventListener("scroll", () => {
    // get active heading
    setActive(firstInView(headings.map((heading) => heading.element)));

    if (
      open &&
      // prevent jitter when pinch-zoomed in
      window.visualViewport?.scale === 1
    )
      // scroll active toc item into view
      scrollTo(activeRef.current, { behavior: "instant", block: "center" });
  });

  return (
    <aside
      ref={ref}
      className={clsx(
        "fixed inset-y-0 z-40 flex max-w-80 flex-col bg-white font-sans shadow-md transition",
        hide ? "pointer-events-none opacity-0" : "opacity-100",
        open ? "" : "-translate-x-full",
      )}
      aria-label="Table of contents"
    >
      <div className="mb-4 flex items-center gap-4">
        {/* top text */}
        <span className="grow p-2 font-medium">Table of Contents</span>
        {/* toggle button */}
        <button
          onClick={() => setOpen(!open)}
          className={clsx(
            "size-10 gap-2 bg-white p-2 transition hocus:text-theme",
            open ? "" : "translate-x-full shadow-md",
          )}
          aria-expanded={open}
          aria-label={open ? "Close" : "Table of contents"}
        >
          {open ? <XIcon /> : <ListBulletsIcon />}
        </button>
      </div>

      {/* links */}
      <div ref={listRef} className="flex flex-col overflow-y-auto py-2">
        {headings.map(({ id, level, content }, index) => (
          <Link
            key={index}
            ref={active === index ? activeRef : undefined}
            style={{ "--level": level + 1 } as CSSProperties}
            className={clsx(
              `flex items-center gap-2 py-2 pr-4 pl-[calc(var(--level)*--spacing(2))] text-black no-underline hocus:bg-off-white hocus:text-theme`,
              active === index && "bg-off-white text-theme",
            )}
            to={{ hash: "#" + id }}
            replace
            onClick={() => scrollTo("#" + id)}
          >
            {content}
          </Link>
        ))}
      </div>
    </aside>
  );
}
