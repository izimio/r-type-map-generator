import React from "react";
import { Box } from "@mui/system";
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import WrappedIcon from "./WrappedIcon";
import { SMOOTH_ORANGE } from "../utils/constants";

interface RectangleConfiguratorProps {
  x: number;
  y: number;
  width: number;
  height: number;
  onConfigChange: (config: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => void;
}

const RectangleConfigurator: React.FC<RectangleConfiguratorProps> = ({
  x,
  y,
  width,
  height,
  onConfigChange,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <WrappedIcon
        icon={
          <RemoveIcon
            sx={{
              padding: "0.5rem",
              "&:hover": {
                cursor: "pointer",
                borderRadius: "50%",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
              color: SMOOTH_ORANGE,
            }}
          />
        }
        title="Up"
        callback={() => onConfigChange({ x, y, width: width - 1, height: height - 1 })}
      />
      <WrappedIcon
        icon={
          <AddIcon
            sx={{
              padding: "0.5rem",
              "&:hover": {
                cursor: "pointer",
                borderRadius: "50%",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
              color: SMOOTH_ORANGE,
            }}
          />
        }
        title="Down"
        callback={() => onConfigChange({ x, y, width: width + 1, height: height + 1 })}
      />
    </Box>
  );
};

export default RectangleConfigurator;
