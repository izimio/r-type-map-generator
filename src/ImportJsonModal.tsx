import React, { useRef, useState } from "react";
import { Modal, Box, Button } from "@mui/material";
import toast from "react-hot-toast";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";

interface ImportJsonModalProps {
  isOpen: boolean;
  onClose: () => void;
  setRoundsContent: (jsonContent: string) => void;
}

const ImportJsonModal: React.FC<ImportJsonModalProps> = ({
  isOpen,
  onClose,
  setRoundsContent,
}) => {
  const [jsonContent, setJsonContent] = useState<string>("");
  const fileInputRef = useRef(null);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        if (e.target?.result) {
          setJsonContent(e.target.result as string);
        }
      };

      reader.readAsText(file);
    }
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
          height: "560px",
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
        <textarea
          value={jsonContent}
          onChange={(e) => setJsonContent(e.target.value)}
          style={{
            width: "100%",
            height: "500px",
            maxHeight: "500px",
            marginBottom: "10px",
            resize: "vertical",
          }}
          placeholder="Enter JSON content here"
        ></textarea>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexGrow: 1,
              "&:hover label": {
                textDecoration: "underline",
                cursor: "pointer",
              },
            }}
          >
            <DriveFolderUploadIcon />
            <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none", width: "100%" }}
            />
            <label
              onClick={() => {
                if (fileInputRef.current) {
                  // @ts-ignore
                  fileInputRef.current.click();
                }
              }}
            >
              Import JSON file
            </label>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "end", gap: "10px" }}>
            <Button
              variant="outlined"
              onClick={() => {
                setRoundsContent(jsonContent);
                onClose();
                toast.success("JSON content imported!");
              }}
              style={{ marginRight: "10px" }}
            >
              Import JSON
            </Button>
            <Button color="warning" onClick={onClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default ImportJsonModal;
