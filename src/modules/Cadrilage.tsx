import { Box } from "@mui/material";
import React from "react";

interface IQadrillageProps {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  size: number;
}

const Quadrillage: React.FC<IQadrillageProps> = ({
  x,
  y,
  width,
  height,
  color,
  size,
}) => {
  const tileStyle = {
    position: "absolute",
    top: y,
    left: x,
    width: width,
    height: height,
    backgroundColor: "red",
    border: `1px solid ${color}`,
  };

  const tiles = [];

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const tileKey = `${i}-${j}`;
      const tileX = x + i * width;
      const tileY = y + j * height;
      tiles.push(
        <Box key={tileKey} sx={{ ...tileStyle, top: tileY, left: tileX }} />
      );
    }
  }

  return <div style={{ position: "relative" }}>{tiles}</div>;
};

export default Quadrillage;
