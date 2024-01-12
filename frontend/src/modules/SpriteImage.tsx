import { Box } from "@mui/material";
import React from "react";

interface SpriteImageProps {
  src: string;
  scale: number;
  rectX?: number;
  rectY?: number;
  rectWidth?: number;
  rectHeight?: number;
}

const SpriteImage: React.FC<SpriteImageProps> = ({
  src,
    scale,
  rectX = 0,
  rectY = 0,
  rectWidth = 0,
  rectHeight = 0,
}) => {
  return (
    <Box sx={{
        position: "absolute",
    }}>
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          width: rectWidth,
          height: rectHeight,
          margin: "auto", // Center horizontally
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: "scale" + `(${scale})`,
          backgroundImage: `url(${src})`,
          backgroundPosition: `-${rectX}px -${rectY}px`,
          border: "1px solid lightgray",
        }}
      />
    </Box>
  );
};

export default SpriteImage;
