import { useState } from "react";
import styles from "./index.module.scss";
import { Tooltip } from "@mui/material";

const Footnote = ({ label, children }) => {
  const [show, setShow] = useState(false);

  return (
    <Tooltip
      open={show}
      onClose={() => {
        setShow(false);
      }}
      arrow
      componentsProps={{
        tooltip: {
          sx: {
            backgroundColor: "#e0e0e0",
            color: "#424242",
            textAlign: "left",
            fontSize: "15px",
            width: "90vw",
            maxWidth: "400px",
            px: 1,
          },
        },
        arrow: {
          sx: {
            "&:before": {
              backgroundColor: "#e0e0e0",
            },
          },
        },
      }}
      title={children}
    >
      <sup
        onClick={() => {
          setShow((st) => !st);
        }}
        className={styles.footnoteLabel}
      >
        {label}
      </sup>
    </Tooltip>
  );
};

export default Footnote;
