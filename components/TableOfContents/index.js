import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Clickable from "../Clickable";
import styles from "./index.module.scss";

// singleton component to read page headings and render table of contents panel
const TableOfContents = () => {
  const [open, setOpen] = useState(false); // panel open state
  const [active, setActive] = useState(); // id of heading in view
  const [headings, setHeadings] = useState([]); // list of headings
  const [downEnough, setDownEnough] = useState(); // whether page is scrolled down far enough
  const [upEnough, setUpEnough] = useState(); // whether page is scrolled up far enough
  const [wideEnough, setWideEnough] = useState(); // whether page is wide enough
  const [clicked, setClicked] = useState(false); // whether user has clicked on the panel button

  // when "enough" states change
  useEffect(() => {
    // don't open automatically if user has already interacted with panel
    if (clicked) return;

    setOpen(downEnough && upEnough && wideEnough);
  }, [clicked, downEnough, upEnough, wideEnough]);

  // when "wide enough" state changes
  useEffect(() => {
    if (!wideEnough) setOpen(false);
  }, [wideEnough]);

  // when page first loads
  const router = useRouter();
  useEffect(() => {
    const initializeToC = () => {
      // set intial "enough" states
      setDownEnough(getDownEnough());
      setUpEnough(getUpEnough());
      setWideEnough(getWideEnough());

      // get headings on page
      setHeadings(getHeadings());
    };

    initializeToC();

    // update after a client-side page transition
    router.events.on("routeChangeComplete", initializeToC);
  }, [router]);

  // listen for scroll
  useEffect(() => {
    // update scroll-related "enough" states
    const onScroll = () => {
      setDownEnough(getDownEnough());
      setUpEnough(getUpEnough());
      setActive(getActive(headings));
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [headings]);

  // listen for resize
  useEffect(() => {
    // update window-size-related "enough" states
    const onResize = () => setWideEnough(getWideEnough());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // when user clicks to on toc entry
  const onNav = useCallback((event) => {
    // prevent browser default link click behavior, which includes instant jump
    event.preventDefault();

    // get target element
    const id = event.currentTarget.dataset?.id?.slice(1) || "";
    if (!id) return;

    // smooth scroll to target
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });

    // manually update url with new hash, since we prevented default
    window.history.pushState(null, null, "#" + id);
  }, []);

  return (
    <>
      <div
        className={styles.overlay}
        data-show={open && !wideEnough}
        onClick={() => setOpen(false)}
      />
      <div className={styles.panel} data-open={open}>
        <div className={styles.heading}>
          <span>Table of Contents</span>
          <Clickable
            icon={open ? "fas fa-times" : "fas fa-list-ul"}
            onClick={({ target }) => {
              setClicked(true);
              setOpen(!open);
              target.blur();
            }}
            tooltip={open ? "Close panel" : "Lesson table of contents"}
            style={{
              opacity: !open && !downEnough ? 0 : 1,
              pointerEvents: !open && !downEnough ? "none" : "",
            }}
          />
        </div>
        <div className={styles.list}>
          {headings.map(({ id, content, level }, index) => (
            <a
              key={index}
              href={"#" + id}
              data-id={"#" + id}
              onClick={onNav}
              className={styles.link}
              data-level={level}
              data-active={id === active}
              dangerouslySetInnerHTML={{ __html: content }}
            ></a>
          ))}
        </div>
      </div>
    </>
  );
};

// get array of document headings and relevant info
const getHeadings = () =>
  Array.from(document.querySelectorAll("h1[id], h2[id], h3[id], h4[id]")).map(
    (heading) => {
      // get clone of heading contents with nothing except plain text and math
      const clone = heading.cloneNode(true);
      for (const node of clone.childNodes) {
        const text = node.nodeType === Node.TEXT_NODE;
        const math = node.classList?.contains("math");
        if (!(text || math)) {
          const innerText = node.innerText;
          if (innerText && node.className === "") {
            clone.replaceChild(document.createTextNode(innerText), node);
          } else {
            node.remove();
          }
        }
      }

      // return helpful relevant info
      return {
        id: heading.getAttribute("id"),
        content: clone.innerHTML,
        level: Number(heading.tagName.match(/\d/)[0]),
      };
    }
  );

// get first heading in view
const getActive = (headings) => {
  headings = [...headings].reverse();
  for (const { id } of headings) {
    const heading = document.getElementById(id);
    if (!heading) continue;
    const bbox = heading.getBoundingClientRect();
    if (bbox.top <= window.innerHeight / 5) return id;
  }
};

// get whether page is scrolled down far enough
const getDownEnough = () => {
  if (typeof document === "undefined") {
    return false;
  }

  const elem = document.querySelector("main > section:nth-child(2)");
  if (!elem) return false;

  return elem.getBoundingClientRect().top < 0;
};

// get whether page is scrolled up far enough
const getUpEnough = () =>
  typeof document === "undefined"
    ? false
    : document.querySelector("footer").getBoundingClientRect().top >
      window.innerHeight;

// get whether page is wide enough
const getWideEnough = () =>
  typeof window === "undefined" ? false : window.innerWidth > 1500;

export default TableOfContents;
