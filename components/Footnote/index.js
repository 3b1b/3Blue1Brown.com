import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { createPortal } from "react-dom";
import { usePopper } from "react-popper";
import styles from "./index.module.scss";

Footnote.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default function Footnote({ label, children }) {
  const [isOpen, setIsOpen] = useState(false);

  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const [arrowElement, setArrowElement] = useState(null);

  const { styles: popperStyles, attributes } = usePopper(
    referenceElement,
    popperElement,
    {
      placement: "top",
      modifiers: [
        // https://github.com/popperjs/popper-core/issues/1138
        { name: "computeStyles", options: { adaptive: false } },
        { name: "offset", options: { offset: [0, 10] } },
        { name: "arrow", options: { element: arrowElement, padding: 10 } },
      ],
    }
  );

  // Close footnote when you click outside (anywhere else on the page)
  useEffect(() => {
    const onClick = (event) => {
      if (popperElement && !popperElement.contains(event.target)) {
        if (referenceElement && !referenceElement.contains(event.target)) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
    };
  }, [popperElement, referenceElement]);

  return (
    <>
      <sup ref={setReferenceElement}>
        <button
          className={styles.footnoteLabel}
          data-open={isOpen}
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          {label}
        </button>
      </sup>

      {isOpen &&
        createPortal(
          <div
            ref={setPopperElement}
            className={styles.popup}
            style={popperStyles.popper}
            {...attributes.popper}
          >
            <div className={styles.popupContent}>{children}</div>
            <div
              ref={setArrowElement}
              className={styles.arrow}
              style={popperStyles.arrow}
            />
          </div>,
          document.body
        )}
    </>
  );
}
