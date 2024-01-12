import { Box } from "@mui/material";
import React from "react";

interface RectangleDrawerProps {
  x: number;
  y: number;
  width: number;
  height: number;
}

const RectangleDrawer: React.FC<RectangleDrawerProps> = ({
  x,
  y,
  width,
  height,
}) => {
  return (
    <Box sx={{ position: "absolute", zIndex: 100 }}>
      <div
        style={{
          flex: 1,
        }}
      >
        <span
          style={{
            border: "1px solid red",
            position: "absolute",
            top: y,
            left: x,
            width: width,
            height: height,
            color: "red",
            fontWeight: "bold",
          }}
        >
        </span>
      </div>
    </Box>
  );
};

export default RectangleDrawer;
