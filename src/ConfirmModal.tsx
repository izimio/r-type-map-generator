import React from "react";
import { Modal, Box, Button } from "@mui/material";

import toast from "react-hot-toast";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  text: string;
  callback: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  text,
  callback,
}) => {
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
        <h3
          style={{
            marginTop: "0px",
            textAlign: "center",
            color: "white",
            fontSize: "20px",
          }}
        >
          {text}
        </h3>
        <Box sx={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <Button color="info" onClick={onClose}>
            No
          </Button>
          <Button
            color="error"
            variant="outlined"
            onClick={() => {
              callback();
              onClose();
              toast.success("Action completed!");
            }}
          >
            Yes
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmModal;
