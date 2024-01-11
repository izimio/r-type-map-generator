import React, { useState } from "react";
import { Modal, Box, Button, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import toast from "react-hot-toast";
import { SMOOTH_ORANGE } from "../utils/constants";
import WrappedIcon from "../modules/WrappedIcon";
import { ImageInfos } from "../SpriteEditor";

import HeightIcon from "@mui/icons-material/Height";
import SettingsEthernetIcon from "@mui/icons-material/SettingsEthernet";

type Boundaries = {
  width: number;
  height: number;
};

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageChange: (newImageInfos: ImageInfos) => void;
}

const ImportImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  onImageChange,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [boundaries, setBoundaries] = useState<Boundaries>({
    width: 0,
    height: 0,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log(e.target.files);
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setPreviewUrl(imageUrl);
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        setBoundaries({
          width: img.width,
          height: img.height,
        });
      };
    }
  };

  const handleDeleteImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleProceed = () => {
    if (selectedImage) {
      onImageChange({
        path: selectedImage,
        width: boundaries.width,
        height: boundaries.height,
      });
      onClose();
      toast.success("Image imported successfully");
    } else {
      toast.error("Please select an image first");
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          borderRadius: "10px",
          position: "absolute",
          bgcolor: "#1a1a1a",
          boxShadow: 24,
          maxHeight: "700px",
          minHeight: "450px",
          width: 500,
          p: 2,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
          ref={fileInputRef}
          id="imageInput"
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            flex: 1,
          }}
        >
          {previewUrl && (
            <Box sx={{ position: "relative" }}>
              <img
                src={previewUrl}
                alt="Preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "400px",
                  border: "1px solid white",
                }}
              />
              <p
                style={{
                  color: SMOOTH_ORANGE,
                  textAlign: "center",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
                onClick={handleDeleteImage}
              >
                Delete Image
              </p>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <HeightIcon
                    sx={{
                      color: SMOOTH_ORANGE,
                    }}
                  />
                  <span>{boundaries.height}px</span>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <HeightIcon
                    sx={{
                      transform: "rotate(90deg)",
                      color: SMOOTH_ORANGE,
                    }}
                  />
                  <span>{boundaries.width}px</span>
                </Box>
              </Box>
            </Box>
          )}
          {!previewUrl && (
            <label htmlFor="imageInput" style={{ textAlign: "center" }}>
              <Button variant="outlined" component="span">
                Select Image
              </Button>
            </label>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "10px",
            marginTop: "10px",
          }}
        >
          <Button variant="outlined" onClick={handleProceed}>
            Proceed
          </Button>
          <Button
            color="warning"
            onClick={() => {
              onClose();
              handleDeleteImage();
            }}
          >
            Back
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ImportImageModal;
