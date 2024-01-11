import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { SMOOTH_ORANGE } from "./utils/constants";
import { useNavigate } from "react-router-dom";
import {
  getLocalStorageItem,
  saveLocalStorageItem,
} from "./utils/localStorage";

import GetAppIcon from "@mui/icons-material/GetApp";
import DataObjectIcon from "@mui/icons-material/DataObject";
import MapIcon from "@mui/icons-material/Map";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

import JsonModal from "./modals/JsonModal";
import ImportJsonModal from "./modals/ImportJsonModal";
import ImportImageModal from "./modals/ImportImageModal";
import WrappedIcon from "./modules/WrappedIcon";
import Quadrillage from "./modules/Cadrilage";

enum AnimationType {
  IDLE = 0,
  MOVE = 1,
  ATTACK = 2,
  DEATH = 3,
}

export interface ImageInfos {
  path: string;
  width: number;
  height: number;
}

type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type Animation = {
  type: AnimationType;
  frames: number[];
};

type ISpriteSheet = {
  spriteName: string;
  rect: Rect;
  scale: number;
  spritePath: string;
  hitbox: Rect;
  animation: Animation[];
  numberOfFrames: number;
  framePerLine: number;
};

const SpriteEditor: React.FC = () => {
  const navigate = useNavigate();

  // ============= Modal states =============
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [isImportJsonModalOpen, setIsImportJsonModalOpen] = useState(false);
  const [isImportImageModalOpen, setIsImportImageModalOpen] = useState(false);
  // ============= Modal states =============

  const [jsonContent, setJsonContent] = useState("");
  const [imgInfos, setImgInfos] = useState<ImageInfos>(() => {
    const imgInfos = getLocalStorageItem("imgInfos");
    if (imgInfos) {
      return imgInfos;
    }
    return {
      path: "",
      width: 0,
      height: 0,
    };
  })
  const [spriteRect, setSpriteRect] = useState<Rect>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  // ============== UseEffect ===============
  useEffect(() => {
    saveLocalStorageItem("imgInfos", imgInfos);
  }, [imgInfos]);
  // ============== UseEffect ===============
  const ExportToJson = () => {};
  const ImportFromJson = (jsonContent: string): boolean => {
    try {
      return true;
    } catch (e) {
      toast.error("Invalid JSON format");
      return false;
    }
  };
  return (
    <div
      style={{
        margin: 20,
      }}
    >
      <JsonModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        jsonContent={jsonContent}
      />
      <ImportJsonModal
        isOpen={isImportJsonModalOpen}
        onClose={() => setIsImportJsonModalOpen(false)}
        setRoundsContent={ImportFromJson}
      />
      <ImportImageModal
        isOpen={isImportImageModalOpen}
        onClose={() => setIsImportImageModalOpen(false)}
        onImageChange={(newImageInfos: ImageInfos) => {
          setImgInfos(newImageInfos);
        }}
      />

      <Box
        sx={{
          position: "absolute",
          top: "20px",
          right: "20px",
          scale: "1.5",
          "&:hover": {
            cursor: "pointer",
          },
          "&:hover > *": {
            color: SMOOTH_ORANGE,
          },
        }}
      >
        <WrappedIcon
          title="Map Editor"
          icon={
            <MapIcon
              sx={{
                transition: "all 0.2s ease-in-out",
              }}
            />
          }
          callback={() => {
            navigate("/");
          }}
        />
      </Box>
      <h1>R-TYPE | Spritesheet Editor</h1>
      <div
        style={{
          marginBottom: "20px",
        }}
      ></div>
      <Box
        sx={{
          display: "flex",
          gap: "10px",
        }}
      >
        <button
          onClick={() => {
            setIsImportImageModalOpen(true);
          }}
        >
          <Box
            sx={{
              display: "flex",
              height: "100%",
              width: "100%",
              alignItems: "center",
              gap: "10px",
              transition: "200ms ease-in-out",
              "&:hover > *": {
                color: SMOOTH_ORANGE,
              },
            }}
          >
            <AddPhotoAlternateIcon
              sx={{
                transition: "color 0.3s ease-in-out",
              }}
            />
            Import Image
          </Box>
        </button>

        <button
          onClick={() => {
            setIsImportJsonModalOpen(true);
          }}
        >
          <Box
            sx={{
              display: "flex",
              height: "100%",
              width: "100%",
              alignItems: "center",
              gap: "10px",
              transition: "200ms ease-in-out",
              "&:hover > *": {
                color: SMOOTH_ORANGE,
              },
            }}
          >
            <DataObjectIcon
              sx={{
                transition: "color 0.3s ease-in-out",
              }}
            />
            Import from JSON
          </Box>
        </button>
        <button
          onClick={() => {
            setIsJsonModalOpen(true);
            ExportToJson();
          }}
        >
          <Box
            sx={{
              display: "flex",
              height: "100%",
              width: "100%",
              alignItems: "center",
              gap: "10px",
              transition: "200ms ease-in-out",
              "&:hover > *": {
                color: SMOOTH_ORANGE,
              },
            }}
          >
            <GetAppIcon
              sx={{
                transition: "color 0.3s ease-in-out",
              }}
            />
            Export to JSON
          </Box>
        </button>
      </Box>

      <hr
        style={{
          border: "1px solid black",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      />
      <Box sx={{ display: "flex", gap: "10px", flex: 1 }}>
        {!imgInfos.path && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              flex: 1,
            }}
          >
            <h2>Import an image to start editing your spritesheet!</h2>
          </Box>
        )}
        {imgInfos.path && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              minHeight: "500px",
              flex: 1,
            }}
          >
            <img
              src={imgInfos.path}
              alt="Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                border: "1px solid white",
              }}
            />
            <Quadrillage
              x={spriteRect.x}
              y={spriteRect.y}
              width={spriteRect.width}
              height={spriteRect.height}
              color="white"
              size={10}
            />
          </Box>
        )}
      </Box>
    </div>
  );
};

export default SpriteEditor;
