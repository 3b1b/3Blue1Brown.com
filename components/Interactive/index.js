import { useState, useEffect, useRef, useContext } from "react";
import PropTypes from "prop-types";
import { PageContext } from "../../pages/_app";
import { useForceUpdate } from "../../util/hooks";
import styles from "./index.module.scss";

Interactive.propTypes = {
  filename: PropTypes.string.isRequired,
  children: PropTypes.func,
  aspectRatio: PropTypes.number,
};

// dynamically load (from same directory as page) and embed a react applet
export default function Interactive({
  filename,
  children = [],
  aspectRatio = 16 / 9,
}) {
  const { dir } = useContext(PageContext);
  const forceUpdate = useForceUpdate();
  // store dynamically loaded component in ref because react doesn't like a
  // component being stored with useState
  const ref = useRef();

  // dynamically load component from provided filename
  useEffect(() => {
    if (!filename) return;
    import(`../../public${dir}${filename}.js`)
      .then((module) => (ref.current = module.default))
      .then(forceUpdate)
      .catch(() => console.log(`Couldn't find interactive "./${filename}.js"`));
  }, [dir, filename, forceUpdate]);

  /*
    When creating an interactive, we don't want authors to have to
    worry too much about sizing. But in every location where the interactive
    is used, it should look good. So we allow specifying the desired aspect ratio
    as a prop, and then <Interactive> will scale the component being rendered
    to always fit the container.

    The rescaling algorithm is to set the container to full-width with the
    specified aspect ratio, and then to position the children in the center
    with full width. If that means the contents are too tall, they get
    scaled down until the height is correct.
  */
  const [interactive, setInteractive] = useState(null);
  const [sizer, setSizer] = useState(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    if (!(interactive && sizer)) return;

    const resize = () => {
      const outerBox = interactive.getBoundingClientRect();
      const innerBox = sizer.getBoundingClientRect();

      const newScale = Math.min(
        outerBox.height / innerBox.height,
        outerBox.width / innerBox.width
      );
      setScale(newScale);
    };

    resize();

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    resizeObserver.observe(interactive);
    resizeObserver.observe(sizer);

    return () => {
      resizeObserver.disconnect();
    };
  }, [interactive, sizer]);

  // get component to render
  const Component = ref.current;

  // if no component, don't render
  if (!Component) return null;

  // get props to pass to component by calling first child as function
  let props;
  if (typeof children === "function") props = children();
  if (typeof props !== "object") props = {};

  return (
    // wrapper
    <div
      className={styles.interactive}
      ref={setInteractive}
      style={{ paddingTop: `${(1 / aspectRatio) * 100}%` }}
    >
      <div className={styles.sizer} ref={setSizer}>
        <div style={{ transform: `scale(${scale})` }}>
          <Component {...props} />
        </div>
      </div>
    </div>
  );
}
