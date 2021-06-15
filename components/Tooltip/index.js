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
import { usePopper } from "react-popper";
import Markdownify from "../Markdownify";
import classNames from "./index.module.scss";

const placement = "top";
const delay = 100;

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
  const { styles, attributes, forceUpdate } = usePopper(
    target,
    popper,
    options
  );

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
    "aria-label": content,
    ref: (el) => {
      setTarget(el);
      return ref;
    },
  };
  children = Children.map(children, (element, index) => {
    if (index > 0) return element;
    if (isValidElement(element)) return cloneElement(element, props);
    if (typeof element === "string")
      return (
        <span {...props} tabIndex="0" className={classNames.span}>
          {element}
        </span>
      );
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
            style={{ ...styles.popper }}
            {...attributes.popper}
          >
            {typeof content === "string" && (
              <div className={classNames.content}>
                <Markdownify>{content}</Markdownify>
              </div>
            )}
            {typeof content !== "string" && content}
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
