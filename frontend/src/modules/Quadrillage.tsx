import { Box } from "@mui/material";
import React from "react";
import { IAnimations, IAnimation, ColorPalette } from "../SpriteEditor";

interface IQadrillageProps {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  nbRows: number;
  nbCols: number;
  imgSize: {
    width: number;
    height: number;
  };
  animations: IAnimations;
  selectedAnimation: string;
  colorPalette: ColorPalette;
  changeAnimation: React.Dispatch<React.SetStateAction<IAnimations>>;
}

const isIncluded = (animation: IAnimation, idx: number) => {
  if (!animation) return false;
  if (animation.start <= idx && animation.end > idx) {
    return true;
  }
  return false;
};

const hexToRGBA = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
};

const Quadrillage: React.FC<IQadrillageProps> = ({
  x,
  y,
  width,
  height,
  color,
  nbRows,
  nbCols,
  imgSize,
  animations,
  selectedAnimation,
  colorPalette,
  changeAnimation,
}) => {
  const tileStyle = {
    position: "absolute",
    top: y,
    left: x,
    width: width,
    height: height,
    border: `1px solid ${color}`,
  };

  const [hoveredTile, setHoveredTile] = React.useState<number | null>(null);

  const returnBgColor = (index: number) => {
    if (!animations) return "transparent";
    if (animations.idle) {
      if (isIncluded(animations.idle, index)) {
        return colorPalette.idle;
      }
    }
    if (animations.move) {
      if (isIncluded(animations.move, index)) {
        return colorPalette.move;
      }
    }
    if (animations.death) {
      if (isIncluded(animations.death, index)) {
        return colorPalette.death;
      }
    }
    if (animations.attack) {
      if (isIncluded(animations.attack, index)) {
        return colorPalette.attack;
      }
    }
    return "transparent";
  };

  const handleTileClick = (index: number, action: string) => {
    if (!animations) {
      return;
    }
    let start = animations[selectedAnimation].start;
    let end = animations[selectedAnimation].end;

    if (action === "click") {
      start = index;
      end = index;
    } else {
      end = index;
      if (index < start) {
        start = index;
      }
      if (index > end) {
        end = index;
      }
      if (index === start) {
        start = index;
      }
      if (index === end) {
        end = index;
      }
    }
    changeAnimation((prev) => {
      return {
        ...prev,
        [selectedAnimation]: {
          ...prev[selectedAnimation],
          start: start,
          end: end,
        },
      };
    });
  };
  const tiles = [];

  for (let j = 0; j < nbRows; j++) {
    for (let i = 0; i < nbCols; i++) {
      const idx = j * nbCols + i;
      const tileX = x + i * width;
      const tileY = y + j * height;
      tiles.push(
        <Box
          onMouseMove={(e) => {
            if (e.buttons === 1 && hoveredTile) {
              handleTileClick(hoveredTile, "drag");
            }
          }}
          onMouseEnter={() => setHoveredTile(idx)}
          key={idx}
          sx={{
            ...tileStyle,
            top: tileY,
            left: tileX,
            userSelect: "none",
            backgroundColor:
              returnBgColor(idx) !== "transparent"
                ? hexToRGBA(returnBgColor(idx), 0.4)
                : "transparent",
            "&:hover": {
              border: "1px solid rgba(255,255,255,1)",
            },
          }}
        >
          {idx}
        </Box>
      );
    }
  }

  return (
    <Box
      sx={{
        position: "absolute",
        width: imgSize.width,
        height: imgSize.height,
        userSelect: "none",
      }}
      onMouseLeave={() => setHoveredTile(null)}
      onMouseDown={() => {
        if (hoveredTile) {
          handleTileClick(hoveredTile, "click");
        }
      }}
      onMouseUp={() => {
        if (hoveredTile) {
          handleTileClick(hoveredTile, "release");
        }
      }}
    >
      <Box
        sx={{
          border: `1px solid transparent`,
        }}
      >
        {tiles}
      </Box>
    </Box>
  );
};

export default Quadrillage;
