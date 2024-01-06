import React from "react";
import { Modal, Box, Button } from "@mui/material";

interface JsonModalProps {
  isOpen: boolean;
  onClose: () => void;
  jsonContent: string;
}

const JsonModal: React.FC<JsonModalProps> = ({
  isOpen,
  onClose,
  jsonContent,
}) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          width: 400,
          bgcolor: "#1a1a1a",
          boxShadow: 24,
          p: 2,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div
          style={{
            maxHeight: "800px", // Set a maximum height for scrolling
            overflow: "auto",
            borderBottom: "1px solid white",
            scrollbarWidth: "thin", // For Firefox
            scrollbarColor: "#ccc #1a1a1a", // For Firefox

          }}
        >
          <pre
            style={{
              color: "white",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
            }}
          >
            {jsonContent}
          </pre>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            marginTop: "30px",
          }}
        >
          <Button color="warning" onClick={onClose}>
            Back
          </Button>
          <Button 
          variant="outlined"    
          onClick={() => downloadJson(jsonContent)}>Download</Button>
        </div>
      </Box>
    </Modal>
  );
};

const downloadJson = (jsonContent: string) => {
  const blob = new Blob([jsonContent], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "map_config.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export default JsonModal;
