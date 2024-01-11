import React from "react";
import { Modal, Box, Button, Icon } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import toast from "react-hot-toast";

interface JsonModalProps {
  isOpen: boolean;
  onClose: () => void;
  jsonContent: string;
}

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

const copyToClipboard = (jsonContent: string) => {
  navigator.clipboard.writeText(jsonContent);
  toast.success("Json copied to clipboard");
};

const JsonModal: React.FC<JsonModalProps> = ({
  isOpen,
  onClose,
  jsonContent,
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
        <div
          style={{
            maxHeight: "600px",
            overflow: "auto",
            borderBottom: "1px solid white",
            scrollbarWidth: "thin",
            scrollbarColor: "#ccc #1a1a1a",
          }}
        >
          <Icon
            sx={{
              color: "white",
              float: "right",
              cursor: "pointer",
              marginTop: "10px",
              marginRight: "10px",
              paddingBottom: "10px",
              "&:hover": {
                color: "#ccd",
                backgroundColor: "#1a1a1a",
              },
            }}
            onClick={() => copyToClipboard(jsonContent)}
          >
            <ContentCopyIcon />
          </Icon>
          <code
            title="jsonContent"
            about="jsonContent"
            style={{
              color: "white",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
            }}
          >
            {jsonContent}
          </code>
        </div>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
            gap: "10px",
            marginTop: "10px",
          }}
        >
          <Button variant="outlined" onClick={() => downloadJson(jsonContent)}>
            Download
          </Button>
          <Button color="warning" onClick={onClose}>
            Back
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default JsonModal;
