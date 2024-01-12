import React, { useState } from "react";
import { Modal, Box, Button } from "@mui/material";

import toast from "react-hot-toast";

interface PaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  colorPalette: {
    [key: string]: string;
  };
  onPaletteChange: (newColorPalette: { [key: string]: string }) => void;
}

const PaletteModal: React.FC<PaletteModalProps> = ({
  isOpen,
  onClose,
  colorPalette,
  onPaletteChange,
}) => {
  const [updatedColorPalette, setUpdatedColorPalette] = useState({
    ...colorPalette,
  });

  const handleColorChange = (color: string, key: string) => {
    setUpdatedColorPalette((prevPalette) => ({
      ...prevPalette,
      [key]: color,
    }));
  };

  const handleSaveChanges = () => {
    onPaletteChange(updatedColorPalette);
    toast.success("Color palette updated!");
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          borderRadius: "10px",
          position: "absolute",
          width: 500,
          maxHeight: "700px",
          bgcolor: "#1a1a1a",
          boxShadow: 24,
          p: 2,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          "&:focus": {
            outline: "none",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "start",
            justifyContent: "start",
            flexWrap: "wrap",
            flexGrow: 1,
            flexShrink: 1,
            marginBottom: "10px",
          }}
        >
          {Object.entries(updatedColorPalette).map(([key, value]) => {
            if (key === "none") {
              return null;
            }
            return (
              <Box
                key={key}
                sx={{
                  marginBottom: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "start",
                  gap: "10px",
                  width: "33%",

                  "&:hover p": {
                    textDecoration: "underline",
                  },
                }}
              >
                <input
                  type="color"
                  value={value}
                  onChange={(e) => handleColorChange(e.target.value, key)}
                  style={{
                    marginRight: "10px",
                    cursor: "pointer",
                    border: "none",
                  }}
                />
                <label>{key}</label>
              </Box>
            );
          })}
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
            gap: "10px",
          }}
        >
          <Button variant="outlined" onClick={handleSaveChanges}>
            Save Changes
          </Button>
          <Button color="warning" onClick={onClose}>
            Back
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default PaletteModal;
