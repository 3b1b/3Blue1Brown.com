import React from "react";
import {
  useState,
  useRef,
  isValidElement,
  cloneElement,
  forwardRef,
} from "react";
import { createPortal } from "react-dom";
import { usePopper } from "react-popper";
import classNames from "./index.module.scss";

const placement = "top";
const delay = 100;

const Tooltip = forwardRef(({ content, children, ...rest }) => {
  // popper elements
  const [target, setTarget] = useState(null);
  const [popper, setPopper] = useState(null);
  const [arrow, setArrow] = useState(null);

  // open state
  const [isOpen, setOpen] = useState(false);

  // open delay timer
  const timer = useRef();

  const open = () => {
    window.clearTimeout(timer?.current);
    timer.current = window.setTimeout(() => setOpen(true), delay);
  };

  const close = () => {
    window.clearTimeout(timer?.current);
    setOpen(false);
  };

  // popper.js options
  let options = {
    placement,
    modifiers: [
      // https://github.com/popperjs/popper-core/issues/1138
      { name: "computeStyles", options: { adaptive: false } },
      { name: "offset", options: { offset: [0, 10] } },
      { name: "arrow", options: { element: arrow, padding: 10 } },
    ],
  };
  const { styles, attributes } = usePopper(target, popper, options);

  // attach props to child
  const props = {
    ...rest,
    onMouseEnter: open,
    onMouseLeave: close,
    onFocus: open,
    onBlur: close,
    "aria-label": content,
    ref: setTarget,
  };
  children = React.Children.map(children, (element, index) => {
    if (index > 0) return element;
    if (isValidElement(element)) return cloneElement(element, props);
    if (typeof element === "string") return <span {...props}>{element}</span>;
    return element;
  });

  return (
    <>
      {children}
      {isOpen &&
        createPortal(
          <div
            ref={setPopper}
            className={classNames.tooltip}
            style={styles.popper}
            {...attributes.popper}
          >
            <div className={classNames.content}>{content}</div>
            <div
              ref={setArrow}
              className={classNames.arrow}
              style={styles.arrow}
            />
          </div>,
          document.body
        )}
    </>
  );
});

export default Tooltip;
