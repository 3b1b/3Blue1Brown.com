import React, { useState } from "react";
import { Tooltip as MUITooltip, Typography } from "@mui/material";

const Tooltip = React.forwardRef((props, ref) => {
  if (props.content && props.children) {
    return (
      <MUITooltip
        arrow
        followCursor
        title={
          <Typography
            sx={{ p: 0.5 }}
            variant="body2"
            fontFamily="Poppins, sans-serif"
            align="left"
          >
            {props.content}
          </Typography>
        }
        sx={{ fontFamily: "Lora, serif", fontSize: 20 }}
      >
        <span ref={ref}>{props.children}</span>
      </MUITooltip>
    );
  }
  return <>{props.children}</>;
});
Tooltip.displayName = "Tooltip";

export default Tooltip;
