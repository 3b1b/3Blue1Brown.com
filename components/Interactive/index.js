import { useContext, useEffect, useRef } from "react";
import { PageContext } from "../../pages/_app";
import { useForceUpdate } from "../../util/hooks";
import styles from "./index.module.scss";

// component to dynamically load and embed a react component in a frame
const Interactive = ({ filename, children = [] }) => {
  const { dir } = useContext(PageContext);
  const forceUpdate = useForceUpdate();
  // store dynamically loaded component in ref because react doesn't like a
  // component being stored with useState
  const ref = useRef();

  // dynamically load component from provided filename
  useEffect(() => {
    import(`../../public${dir}${filename}.js`)
      .then((module) => (ref.current = module.default))
      .then(forceUpdate);
  }, [dir, filename, forceUpdate]);

  // get component to render
  const Component = ref.current || (() => <></>);

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
