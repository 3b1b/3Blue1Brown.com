import {
  useState,
  useEffect,
  useRef,
  isValidElement,
  cloneElement,
  forwardRef,
  Children,
} from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import { usePopper } from "react-popper";
import Markdownify from "../Markdownify";
import classNames from "./index.module.scss";

// settings
const placement = "top";
const delay = 100;

// tooltip component that wraps around a target element (children) and displays
// a popup over it with content
const Tooltip = forwardRef(({ content, children, ...rest }, ref) => {
  // popper elements
  const [target, setTarget] = useState(null);
  const [popper, setPopper] = useState(null);
  const [arrow, setArrow] = useState(null);

  // open state
  const [isOpen, setOpen] = useState(false);

  // open delay timer
  const timer = useRef();

  // open tooltip
  const open = () => {
    // don't open if no content
    if (!content) return;
    window.clearTimeout(timer?.current);
    timer.current = window.setTimeout(() => setOpen(true), delay);
  };

  // close tooltip
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

  // get positioning from popper.js
  const { styles, attributes, forceUpdate } = usePopper(
    target,
    popper,
    options
  );
  // nudge tooltip 1px to left to avoid popper.js bug causing screen overflow
  styles.popper.left = Number(styles.popper.left) - 1;

  // update popper position when contents change
  useEffect(() => {
    if (forceUpdate) forceUpdate();
  }, [content, forceUpdate]);

  // attach props to child
  const props = {
    ...rest,
    onMouseEnter: open,
    onMouseLeave: close,
    onFocus: open,
    onBlur: close,
    ref: (el) => {
      setTarget(el);
      return ref;
    },
  };
  children = Children.map(children, (element, index) => {
    // only attach props to first child
    if (index > 0) return element;
    // if cchild is react element
    if (isValidElement(element)) return cloneElement(element, props);
    // if child is plain text
    if (typeof element === "string") {
      return (
        <span
          {...props}
          tabIndex="0"
          className={
            classNames.span + (props.className ? ` ${props.className}` : "")
          }
        >
          {element}
        </span>
      );
    }
    // otherwise, pass child through untouched
    return element;
  });

  // if child no longer exists, close tooltip
  if (!children) close();

  // if content is plain string, convert to markdown and wrap
  if (typeof content === "string")
    content = (
      <div className={classNames.content}>
        <Markdownify>{content}</Markdownify>
      </div>
    );

  return (
    <>
      {children}
      {isOpen &&
        content &&
        createPortal(
          <div
            ref={setPopper}
            className={classNames.tooltip}
            style={{ ...styles.popper }}
            {...attributes.popper}
          >
            {content}
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

Tooltip.propTypes = {
  content: PropTypes.node,
  children: PropTypes.node.isRequired,
};

export default Tooltip;
