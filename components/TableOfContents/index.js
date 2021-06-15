import { useCallback, useEffect, useState } from "react";
import Clickable from "../Clickable";
import styles from "./index.module.scss";

const TableOfContents = () => {
  const [open, setOpen] = useState(false); // panel open state
  const [active, setActive] = useState(); // link id in view
  const [headings, setHeadings] = useState([]); // list of headings
  const [downEnough, setDownEnough] = useState(); // whether page is scrolled down far enough
  const [wideEnough, setWideEnough] = useState(); // whether page is wide enough

  // when page first loads
  useEffect(() => {
    setDownEnough(getDownEnough());
    setWideEnough(getWideEnough());
  }, []);

  // when "enough" states change
  useEffect(() => {
    if (wideEnough) {
      setOpen(downEnough);
    }
  }, [downEnough, wideEnough]);

  // listen for scroll
  useEffect(() => {
    const onScroll = () => {
      setDownEnough(getDownEnough());
      setActive(getActive(headings));
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [headings]);

  // listen for resize
  useEffect(() => {
    const onResize = () => setWideEnough(getWideEnough());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // get headings relevant info from page
  useEffect(() => {
    setHeadings(getHeadings());
  }, []);

  // when open state changes
  useEffect(() => {
    document.body.dataset.offset = open && wideEnough;
  }, [open, wideEnough]);

  // when user clicks to on toc entry
  const onNav = useCallback((event) => {
    event.preventDefault();
    document
      .getElementById(event.target.dataset.id.slice(1))
      .scrollIntoView({ behavior: "smooth" });
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
          <Clickable
            icon={open ? "fas fa-times" : "fas fa-list-ul"}
            onClick={({ target }) => {
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
            >
              {content}
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

// get array of document headings and relevant info
const getHeadings = () =>
  Array.from(document.querySelectorAll("h1[id], h2[id], h3[id], h4[id]")).map(
    (heading) => ({
      id: heading.getAttribute("id"),
      content: heading.innerText,
      level: Number(heading.tagName.match(/\d/)[0]),
    })
  );

// get first heading in view
const getActive = (headings) => {
  headings = [...headings].reverse();
  for (const { id } of headings) {
    const heading = document.getElementById(id);
    if (!heading) continue;
    const bbox = heading.getBoundingClientRect();
    if (bbox.top <= 0) return id;
  }
};

// get whether page is scrolled down far enough
const getDownEnough = () =>
  typeof document === "undefined"
    ? false
    : document
        .querySelector("main > section:nth-child(2)")
        .getBoundingClientRect().top < 0;

// get whether page is wide enough
const getWideEnough = () =>
  typeof window === "undefined" ? false : window.innerWidth > 2200;

export default TableOfContents;
