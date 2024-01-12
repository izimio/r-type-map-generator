import React, { useEffect, useState } from "react";
import { Modal, Box, Button } from "@mui/material";
import toast from "react-hot-toast";
import { ImageInfos } from "../SpriteEditor";
import SpriteImage from "../modules/SpriteImage";
import RectangleDrawer from "../modules/RectangleDrawer";
import RectangleConfigurator from "../modules/RectangleConfigurator";

type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

interface HitboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  spriteRect: Rect;
  hitboxRect: Rect;
  setHitboxRect: (rect: Rect) => void;
  imageInfos: ImageInfos;
}

const HitboxModal: React.FC<HitboxModalProps> = ({
  isOpen,
  onClose,
  spriteRect,
  hitboxRect,
  setHitboxRect,
  imageInfos,
}) => {
  const { path: src } = imageInfos;
  const [rect, setRect] = useState<Rect>(hitboxRect);
  const [scale, setScale] = useState(2);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      switch (e.key) {
        case "ArrowUp":
          setRect({ ...rect, y: rect.y - 1 });
          break;
        case "ArrowDown":
          setRect({ ...rect, y: rect.y + 1 });
          break;
        case "ArrowLeft":
          setRect({ ...rect, x: rect.x - 1 });
          break;
        case "ArrowRight":
          setRect({ ...rect, x: rect.x + 1 });
          break;
        case "+":
          setRect({ ...rect, width: rect.width + 1, height: rect.height + 1 });
          break;
        case "-":
          setRect({ ...rect, width: rect.width - 1, height: rect.height - 1 });
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [rect]);

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
        <h2 style={{ textAlign: "center", color: "white" }}>Hitbox Editor </h2>
        <Box
          sx={{
            flex: 1,
            overflow: "hidden",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <RectangleDrawer {...rect} />
          <SpriteImage
            src={src}
            rectX={spriteRect.x}
            rectY={spriteRect.y}
            rectWidth={spriteRect.width}
            rectHeight={spriteRect.height}
            scale={scale}
          />
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
          <RectangleConfigurator
            x={rect.x}
            y={rect.y}
            width={rect.width}
            height={rect.height}
            onConfigChange={setRect}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                textAlign: "center",
                color: "white",
              }}
            >
              Zoom: {scale}x
            </span>
            <input
              type="range"
              min="1"
              max="10"
              value={scale}
              onChange={(e) => setScale(parseInt(e.target.value))}
              style={{
                width: "75px",
              }}
            />
          </Box>

          <Button
            variant="outlined"
            onClick={() => {
              const newRect = {
                x: Math.round(rect.x / scale),
                y: Math.round(rect.y / scale),
                width: Math.round(rect.width / scale),
                height: Math.round(rect.height / scale),
              };
              setHitboxRect(newRect);
              onClose();
              toast.success("Hitbox saved!");
            }}
          >
            Proceed
          </Button>
          <Button
            color="warning"
            onClick={() => {
              onClose();
            }}
          >
            Back
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default HitboxModal;
