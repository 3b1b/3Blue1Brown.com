import { useContext, useEffect, useRef } from "react";
import { PageContext } from "../../pages/_app";
import { useForceUpdate } from "../../util/hooks";
import styles from "./index.module.scss";

// dynamically load (from same directory as page) and embed a react applet
const Interactive = ({ filename, children = [] }) => {
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
    <div className={styles.interactive}>
      <Component {...props} />
    </div>
  );
};

export default Interactive;
