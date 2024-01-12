import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import {
  SMOOTH_ORANGE,
  SMOOTH_BLUE,
  ALL_ANIMATIONS,
  ANIMATIONS_COLORS,
} from "./utils/constants";
import { useNavigate } from "react-router-dom";
import {
  getLocalStorageItem,
  saveLocalStorageItem,
} from "./utils/localStorage";

import GetAppIcon from "@mui/icons-material/GetApp";
import DataObjectIcon from "@mui/icons-material/DataObject";
import MapIcon from "@mui/icons-material/Map";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import InfoIcon from "@mui/icons-material/Info";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import HeightIcon from "@mui/icons-material/Height";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";

import JsonModal from "./modals/JsonModal";
import ImportJsonModal from "./modals/ImportJsonModal";
import ImportImageModal from "./modals/ImportImageModal";
import WrappedIcon from "./modules/WrappedIcon";
import Quadrillage from "./modules/Quadrillage";
import PositionStyledInput from "./modules/positionStyledInput";
import PaletteModal from "./modals/ImportPaletModal";
import HitboxModal from "./modals/HitboxModal";
import TitleBack from "./modules/Title";

export interface ColorPalette {
  [key: string]: string;
}

export interface ImageInfos {
  path: string;
  width: number;
  height: number;
  name: string;
  projectPath: string;
}

type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export interface IAnimation {
  type: string;
  start: number;
  end: number;
}

export interface IAnimations {
  [key: string]: IAnimation;
  idle: IAnimation;
  move: IAnimation;
  attack: IAnimation;
  death: IAnimation;
}
interface SpriteSheet {
  path: string;
  scale: number;
  Rect: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  numberOfFrame: number;
  framePerLine: number;
  animations: IAnimation[];
}

interface HitBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Sprite {
  spriteName: string;
  spriteSheet: SpriteSheet;
  hitBox?: HitBox;
}

const SpriteEditor: React.FC = () => {
  const navigate = useNavigate();

  // ============= Modal states =============
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [isImportJsonModalOpen, setIsImportJsonModalOpen] = useState(false);
  const [isImportImageModalOpen, setIsImportImageModalOpen] = useState(false);
  const [isPaletteModalOpen, setIsPaletteModalOpen] = useState(false);
  const [isHitboxModalOpen, setIsHitboxModalOpen] = useState(false);
  // ============= Modal states =============

  const [selectedAnimation, setSelectedAnimation] = useState("");
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
      name: "",
      projectPath: "",
    };
  });
  const [spriteRect, setSpriteRect] = useState<Rect>(() => {
    const spriteRect = getLocalStorageItem("spriteRect");
    if (spriteRect) {
      return spriteRect;
    }
    return {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    };
  });
  const [hitboxRect, setHitboxRect] = useState<Rect>(() => {
    const hitboxRect = getLocalStorageItem("hitboxRect");
    if (hitboxRect) {
      return hitboxRect;
    }
    return {
      x: 50,
      y: 50,
      width: 50,
      height: 50,
    };
  });

  const [animations, setAnimations] = useState<IAnimations>(() => {
    const animations = getLocalStorageItem("animations");
    if (animations) {
      return animations;
    }
    return {
      idle: {
        type: "1",
        start: 0,
        end: 0,
      },
      move: {
        type: "2",
        start: 0,
        end: 0,
      },
      attack: {
        type: "3",
        start: 0,
        end: 0,
      },
      death: {
        type: "4",
        start: 0,
        end: 0,
      },
    };
  });

  const [colorPaletteSprite, setColorPaletteSprite] = useState<ColorPalette>(
    () => {
      const colorPaletteFromLocalStorage =
        getLocalStorageItem("colorPaletteSprite");
      if (colorPaletteFromLocalStorage) {
        return colorPaletteFromLocalStorage;
      }
      return ANIMATIONS_COLORS;
    }
  );
  // ============== UseEffect ===============
  useEffect(() => {
    saveLocalStorageItem("imgInfos", imgInfos);
  }, [imgInfos]);

  useEffect(() => {
    saveLocalStorageItem("spriteRect", spriteRect);
  }, [spriteRect]);

  useEffect(() => {
    saveLocalStorageItem("animations", animations);
  }, [animations]);

  useEffect(() => {
    saveLocalStorageItem("hitboxRect", hitboxRect);
  }, [hitboxRect]);
  useEffect(() => {
    const len = Object.keys(colorPaletteSprite).length;
    if (len < Object.keys(ANIMATIONS_COLORS).length) {
      setColorPaletteSprite(ANIMATIONS_COLORS);
    }
    saveLocalStorageItem("colorPaletteSprite", colorPaletteSprite);
  }, [colorPaletteSprite]);
  // ============== UseEffect ===============

  const changeSpriteRect = (key: string, value: number) => {
    // if this would cause too much lag we can refuse
    if (key === "width") {
      if (imgInfos.width / value > 100) {
        toast.error("Too many columns");
        return;
      }
    }
    if (key === "height") {
      if (imgInfos.height / value > 100) {
        toast.error("Too many rows");
        return;
      }
    }
    if (!value || isNaN(value) || !isFinite(value)) {
      toast.error("Invalid value");
      return;
    }
    setSpriteRect({
      ...spriteRect,
      [key]: value,
    });
  };

  const ExportToJson = () => {
    const nbFrame =
      Math.floor(imgInfos.width / spriteRect.width) *
      Math.floor(imgInfos.height / spriteRect.height);
    const jsonObj: Sprite = {
      spriteName: imgInfos.name,
      spriteSheet: {
        path: imgInfos.projectPath,
        scale: 1,
        Rect: spriteRect,
        numberOfFrame: nbFrame,
        framePerLine: Math.floor(imgInfos.width / spriteRect.width),
        animations: [],
      },
    };
    let type = 0;
    for (const [, value] of Object.entries(animations)) {
      type++;
      if (value.start === 0 && value.end === 0) {
        continue;
      }
      jsonObj.spriteSheet.animations.push({
        type: type.toString(),
        start: value.start,
        end: value.end,
      });
    }
    if (hitboxRect.width && hitboxRect.height) {
      jsonObj.hitBox = hitboxRect;
    }
    setJsonContent(JSON.stringify(jsonObj, null, 2));
    setIsJsonModalOpen(true);
  };

  const ImportFromJson = (jsonContent: string): boolean => {
    try {
      const jsonObj = JSON.parse(jsonContent);
      const { spriteSheet } = jsonObj;
      const { Rect } = spriteSheet;
      setSpriteRect(Rect);
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
      <HitboxModal
        isOpen={isHitboxModalOpen}
        onClose={() => setIsHitboxModalOpen(false)}
        spriteRect={spriteRect}
        hitboxRect={hitboxRect}
        setHitboxRect={setHitboxRect}
        imageInfos={imgInfos}
      />
      <PaletteModal
        isOpen={isPaletteModalOpen}
        onClose={() => setIsPaletteModalOpen(false)}
        colorPalette={colorPaletteSprite}
        onPaletteChange={(newColorPalette) => {
          setColorPaletteSprite(newColorPalette);
        }}
      />
      <ImportImageModal
        isOpen={isImportImageModalOpen}
        onClose={() => setIsImportImageModalOpen(false)}
        imageInfos={imgInfos}
        onImageChange={(newImageInfos: ImageInfos) => {
          setImgInfos(newImageInfos);
        }}
      />
      <TitleBack title="R-TYPE | Spritesheet Editor" />

      <div>
        <h3>Animation Type</h3>
        <Box
          sx={{
            display: "flex",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          {ALL_ANIMATIONS.map((anim) => (
            <button
              key={anim}
              onClick={() => {
                setSelectedAnimation(anim);
              }}
              disabled={!!(selectedAnimation && selectedAnimation === anim)}
              style={{
                backgroundColor: colorPaletteSprite[anim],
                height: 50,
                width: 110,
                cursor: "pointer",
                border:
                  selectedAnimation && selectedAnimation === anim
                    ? "1px solid white"
                    : "none",
              }}
            >
              {anim}
            </button>
          ))}
          <WrappedIcon
            title="Change color palette"
            icon={<ColorLensIcon />}
            callback={() => {
              setIsPaletteModalOpen(true);
            }}
          />
        </Box>
      </div>
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
            navigate("/map");
          }}
        />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <InfoIcon
          sx={{
            color: SMOOTH_BLUE,
          }}
        />
        <span>
          <b>Info:</b> If your spritesheet is too big for your screen, you can
          press <b>CTRL + Scroll</b> to zoom in/out and adjust the size of the
          squares.
        </span>
      </Box>
      <h3
        style={{
          marginBottom: "-5px",
        }}
      >
        Animations range
      </h3>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ul style={{ listStyle: "" }}>
          <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            IDLE:{" "}
            <span
              style={{ fontWeight: "bold", color: colorPaletteSprite.idle }}
            >
              {animations.idle.start} - {animations.idle.end}
            </span>
            <WrappedIcon
              title="Reset"
              icon={<RestartAltIcon />}
              callback={() => {
                setAnimations({
                  ...animations,
                  idle: {
                    type: "2",
                    start: 0,
                    end: 0,
                  },
                });
              }}
            />
          </li>
          <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            MOVE:{" "}
            <span
              style={{ fontWeight: "bold", color: colorPaletteSprite.move }}
            >
              {animations.move.start} - {animations.move.end}
            </span>
            <WrappedIcon
              title="Reset"
              icon={<RestartAltIcon />}
              callback={() => {
                setAnimations({
                  ...animations,
                  move: {
                    type: "2",
                    start: 0,
                    end: 0,
                  },
                });
              }}
            />
          </li>
          <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            ATTACK:{" "}
            <span
              style={{ fontWeight: "bold", color: colorPaletteSprite.attack }}
            >
              {animations.attack.start} - {animations.attack.end}
            </span>
            <WrappedIcon
              title="Reset"
              icon={<RestartAltIcon />}
              callback={() => {
                setAnimations({
                  ...animations,
                  attack: {
                    type: "2",
                    start: 0,
                    end: 0,
                  },
                });
              }}
            />
          </li>
          <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            DEATH:{" "}
            <span
              style={{ fontWeight: "bold", color: colorPaletteSprite.death }}
            >
              {animations.death.start} - {animations.death.end}
            </span>
            <WrappedIcon
              title="Reset"
              icon={<RestartAltIcon />}
              callback={() => {
                setAnimations({
                  ...animations,
                  death: {
                    type: "2",
                    start: 0,
                    end: 0,
                  },
                });
              }}
            />
          </li>
        </ul>
      </Box>
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

        {imgInfos.path && (
          <button
            onClick={() => {
              setIsHitboxModalOpen(true);
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
              <AspectRatioIcon
                sx={{
                  transition: "color 0.3s ease-in-out",
                }}
              />
              Resize Hitbox
            </Box>
          </button>
        )}

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

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          justifyContent: "center",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <SquareFootIcon />
          <span>Sprite position:</span>
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
              color: SMOOTH_ORANGE,
              transform: "rotate(90deg)",
            }}
          />
          <input
            style={{
              width: "200px",
            }}
            type="range"
            min={Math.ceil(imgInfos.width / 50)}
            max={imgInfos.width / 2}
            step="1"
            value={spriteRect.width}
            onChange={(e) => changeSpriteRect("width", Number(e.target.value))}
          />
          <PositionStyledInput
            value={spriteRect.width.toString()}
            callback={(newValue: string) => {
              const value = Number(newValue);
              if (isNaN(value)) {
                toast.error("Invalid value");
                return;
              }
              changeSpriteRect("width", value);
            }}
          />
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
              color: SMOOTH_ORANGE,
            }}
          />
          <input
            style={{
              width: "200px",
            }}
            type="range"
            min={Math.ceil(imgInfos.height / 20)}
            max={imgInfos.height / 2}
            step="1"
            value={spriteRect.height}
            onChange={(e) => changeSpriteRect("height", Number(e.target.value))}
          />
          <PositionStyledInput
            value={spriteRect.height.toString()}
            callback={(newValue: string) => {
              const value = Number(newValue);
              if (isNaN(value)) {
                toast.error("Invalid value");
                return;
              }
              changeSpriteRect("height", value);
            }}
          />
        </Box>
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
              flex: 1,
            }}
          >
            <Box
              sx={{
                position: "relative",
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
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
              >
                <Quadrillage
                  x={spriteRect.x}
                  y={spriteRect.y}
                  width={spriteRect.width}
                  height={spriteRect.height}
                  color={SMOOTH_ORANGE}
                  nbRows={Math.floor(imgInfos.height / spriteRect.height)}
                  nbCols={Math.floor(imgInfos.width / spriteRect.width)}
                  imgSize={{
                    width: imgInfos.width,
                    height: imgInfos.height,
                  }}
                  animations={animations}
                  selectedAnimation={selectedAnimation}
                  colorPalette={colorPaletteSprite}
                  changeAnimation={setAnimations}
                />
              </Box>
            </Box>
          </Box>
        )}
      </Box>
      <p
        style={{
          textAlign: "center",
        }}
      >
        Made with ❤️ by <a href="https://github.com/izimio">izimio</a>
      </p>
      <p style={{ textAlign: "center", fontSize: 11 }}>
        R-Type 2024 - Paul Laban, Baptiste Leroyer, Loïs Maneux, Arthur Pahon,
        Joshua Brionne
      </p>
    </div>
  );
};

export default SpriteEditor;
