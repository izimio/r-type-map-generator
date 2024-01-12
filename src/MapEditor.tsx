// src/MapEditor.tsx
import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

import JsonModal from "./modals/JsonModal";
import PaletteModal from "./modals/ImportPaletModal";
import WrappedIcon from "./modules/WrappedIcon";

import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import DeleteIcon from "@mui/icons-material/Delete";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import GetAppIcon from "@mui/icons-material/GetApp";
import DataObjectIcon from "@mui/icons-material/DataObject";
import BackspaceIcon from "@mui/icons-material/Backspace";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";


import {
  getLocalStorageItem,
  saveLocalStorageItem,
} from "./utils/localStorage";
import {
  MONSTER_TYPES,
  ALL_TYPES,
  ENTITIES_COLORS,
  SMOOTH_ORANGE,
  DEFAULT_ENTITY_ATTRIBUTES,
} from "./utils/constants";
import ConfirmeModal from "./modals/ConfirmModal";
import toast from "react-hot-toast";
import ImportJsonModal from "./modals/ImportJsonModal";
import EditDefaultEntityAttributsModal, {
  IEntityAttributes,
} from "./modals/EditDefaultEntityAttributsModal";
import EditEntityAttributsModal from "./modals/EditEntityAttributsModal";

interface ColorPalette {
  [key: string]: string;
}

export interface Entity {
  type: string;
  threshold: number;
  height: number;
  speed: number;
  health: number;
  bonus: string[];
  sprite: string;
  config: {
    range?: number;
  };
}

interface Round {
  round: number;
  entities: Record<string, Entity>;
  gridWidth: number;
}

interface JsonMap {
  base_health: number;
  rounds:
    | [
        {
          round: number;
          enemies: Entity[];
          obstacles: Entity[];
        }
      ]
    | [];
}

interface EntityElement {
  type: string;
  color: string;
}

const getKey = (threshold: number, height: number) => `${threshold}:${height}`;

const MapEditor: React.FC = () => {
  const navigate = useNavigate();
  const [rounds, setRounds] = useState<Round[]>(() => {
    const roundsFromLocalStorage = getLocalStorageItem("rounds");
    if (roundsFromLocalStorage) {
      return roundsFromLocalStorage;
    }
    return [
      {
        round: 1,
        entities: {},
        gridWidth: 10,
      },
    ];
  });
  const [baseHealth, setBaseHealth] = useState<number>(5);
  const [selectedKey, setSelectedKey] = useState("");
  const [selectedEntityType, setselectedEntityType] =
    useState<EntityElement | null>(null);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [isImportJsonModalOpen, setIsImportJsonModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isPaletteModalOpen, setIsPaletteModalOpen] = useState(false);
  const [
    isEditDefaultEntityAttributsModalOpen,
    setIsEditDefaultEntityAttributsModalOpen,
  ] = useState(false);

  const [isEditEntityAttributsModalOpen, setIsEditEntityAttributsModalOpen] =
    useState(false);

  const [confirmInfos, setConfirmInfos] = useState<{
    text: string;
    callback: () => void;
  }>({
    text: "",
    callback: () => {},
  });
  // =========================================== //
  const [jsonContent, setJsonContent] = useState("");
  const [roundSelectedIdx, setRoundSelectedIdx] = useState(0);
  const [defaultEntityAttributes, setDefaultEntityAttributes] =
    useState<IEntityAttributes>(() => {
      const defaultEntityAttributesFromLocalStorage = getLocalStorageItem(
        "defaultEntityAttributes"
      );
      if (defaultEntityAttributesFromLocalStorage) {
        return defaultEntityAttributesFromLocalStorage;
      }
      return DEFAULT_ENTITY_ATTRIBUTES;
    });
  const [colorPalette, setColorPalette] = useState<ColorPalette>(() => {
    const colorPaletteFromLocalStorage = getLocalStorageItem("colorPalette");
    if (colorPaletteFromLocalStorage) {
      return colorPaletteFromLocalStorage;
    }
    return ENTITIES_COLORS;
  });
  // =========================================== //
  // Independent round selected
  const shownedRound = rounds[roundSelectedIdx];
  const selectedEntity = shownedRound.entities[selectedKey] || {
    type: "none",
    threshold: 0,
    height: 0,
    speed: 0,
    health: 0,
    sprite: "",
    config: {},
  };

  useEffect(() => {
    saveLocalStorageItem("rounds", rounds);
  }, [rounds]);

  useEffect(() => {
    saveLocalStorageItem("defaultEntityAttributes", defaultEntityAttributes);
  }, [defaultEntityAttributes]);

  useEffect(() => {
    const len = Object.keys(colorPalette).length;
    if (len < Object.keys(ENTITIES_COLORS).length) {
      setColorPalette(ENTITIES_COLORS);
    }
    saveLocalStorageItem("colorPalette", colorPalette);
  }, [colorPalette]);

  const SelectEntity = (enemyType: string) => {
    setselectedEntityType({
      type: enemyType,
      color: colorPalette[enemyType],
    });
  };

  const exportToJson = () => {
    const cleanJson: JsonMap = {
      base_health: baseHealth,
      rounds: [],
    };
    const maxRounds = rounds
      .map((round) => round.round)
      .reduce((a, b) => Math.max(a, b));

    for (let i = 0; i < maxRounds; i++) {
      // find all round with round number i
      const idxRounds = rounds.find((round) => round.round === i + 1);
      if (!idxRounds) {
        continue;
      }
      const eachRound: {
        round: number;
        enemies: Entity[];
        obstacles: Entity[];
      } = {
        round: i + 1,
        enemies: [],
        obstacles: [],
      };

      for (const [, value] of Object.entries(idxRounds.entities)) {
        if (!value.config.range) {
          value.config = {};
        }
        if (MONSTER_TYPES.includes(value.type)) {
          eachRound.enemies.push(value);
        }
        if (value.type === "obstacles") {
          eachRound.obstacles.push(value);
        }
      }
      cleanJson.rounds.push(eachRound as never);
    }
    setJsonContent(JSON.stringify(cleanJson, null, 2));
    setIsJsonModalOpen(true);
  };

  const createConfirmation = (text: string, callback: () => void) => {
    setIsConfirmModalOpen(true);
    setConfirmInfos({
      text,
      callback,
    });
  };
  // ===============  Rounds functions  ===============

  const addRound = () => {
    setRounds((prevRounds) => [
      ...prevRounds,
      {
        round: prevRounds.length + 1,
        entities: {}, // Change from [] to {}
        gridWidth: 10,
      },
    ]);
  };

  const changeRoundGridWidth = (roundIndex: number, gridWidth: number) => {
    setRounds((prevRounds) => {
      const newRounds = [...prevRounds];
      newRounds[roundIndex].gridWidth = gridWidth;
      return newRounds;
    });
  };

  const cleanWholeRound = (roundIndex: number) => {
    setRounds((prevRounds) => {
      const newRounds = [...prevRounds];
      newRounds[roundIndex].entities = {};
      return newRounds;
    });
  };

  const deleteRound = (roundIndex: number) => {
    if (rounds.length === 1) {
      toast.error("You can't delete the last round");
      return;
    }
    setRounds((prevRounds) => {
      const newRounds = [...prevRounds];
      newRounds.splice(roundIndex, 1);
      newRounds.forEach((round, idx) => {
        round.round = idx + 1;
      });
      return newRounds;
    });
    setRoundSelectedIdx(0);
  };

  // function to import json
  const setRoundsFromText = (jsonContent: string): boolean => {
    try {
      const parsedJson = JSON.parse(jsonContent);
      if (!parsedJson.rounds) {
        return false;
      }
      setBaseHealth(parsedJson.base_health);
      const newObj = parsedJson.rounds.map((round: any) => {
        const entities: Record<string, Entity> = {};
        round.enemies.forEach((entity: Entity) => {
          entities[getKey(entity.threshold, entity.height)] = entity;
        });
        round.obstacles.forEach((entity: Entity) => {
          entities[getKey(entity.threshold, entity.height)] = entity;
        });
        let maxThreshold = Math.max(
          ...round.enemies.map((entity: Entity) => entity.threshold),
          ...round.obstacles.map((entity: Entity) => entity.threshold)
        );
        if (
          maxThreshold == -Infinity ||
          maxThreshold == Infinity ||
          maxThreshold == null ||
          maxThreshold == undefined ||
          maxThreshold == 0 ||
          maxThreshold < 100
        ) {
          maxThreshold = 100;
        }
        return {
          round: round.round,
          entities: entities,
          gridWidth: maxThreshold / 10,
        };
      });

      setRounds(newObj);

      return true;
    } catch (e) {
      return false;
    }
  };

  const handleCtrTileClick = (roundIndex: number, key: string) => {
    const tile = rounds[roundIndex].entities[key];
    if (!tile) {
      return;
    }
    if (tile.type === "none" || tile.type === "obstacles") {
      return;
    }

    setSelectedKey(key);
    setIsEditEntityAttributsModalOpen(true);
  };
  const handleTileClick = (
    roundIndex: number,
    threshold: number,
    height: number
  ) => {
    if (selectedEntityType === null) {
      toast("You need to select an entity first", {
        icon: "ℹ️",
      });
      return;
    }

    if (selectedEntityType.type === "Eraser") {
      setRounds((prevRounds: Round[]) => {
        const newRounds = [...prevRounds];
        const key = getKey(threshold, height);
        delete newRounds[roundIndex].entities[key];
        return newRounds;
      });
      return;
    }
    setRounds((prevRounds: Round[]) => {
      const newRounds = [...prevRounds];
      const key = getKey(threshold, height);

      newRounds[roundIndex].entities = {
        ...newRounds[roundIndex].entities,
        [key]: {
          type: selectedEntityType.type,
          threshold: threshold,
          height: height,
          speed: defaultEntityAttributes.speed,
          health: defaultEntityAttributes.health,
          sprite: defaultEntityAttributes.sprite,
          bonus: defaultEntityAttributes.bonus,
          config: defaultEntityAttributes.config,
        },
      };
      return newRounds;
    });
  };
  // ===============  Rounds functions  ===============
  return (
    <div>
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
            color: SMOOTH_ORANGE
          },
        }}
      >
        <WrappedIcon
          title="Sprite editor"
          icon={<AddPhotoAlternateIcon sx={{
            transition: "all 0.2s ease-in-out",
          }}/>}
          callback={() => {
            navigate("/sprite");
          }}
        />
      </Box>
      <div style={{ margin: 20 }}>
        <JsonModal
          isOpen={isJsonModalOpen}
          onClose={() => setIsJsonModalOpen(false)}
          jsonContent={jsonContent}
        />
        <ImportJsonModal
          isOpen={isImportJsonModalOpen}
          onClose={() => setIsImportJsonModalOpen(false)}
          setRoundsContent={setRoundsFromText}
        />
        <PaletteModal
          isOpen={isPaletteModalOpen}
          onClose={() => setIsPaletteModalOpen(false)}
          colorPalette={colorPalette}
          onPaletteChange={(newColorPalette) => {
            setColorPalette(newColorPalette);
          }}
        />
        <ConfirmeModal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          text={confirmInfos.text}
          callback={confirmInfos.callback}
        />
        {/* To edit a tile*/}
        {selectedEntity.type !== "none" && (
          <EditEntityAttributsModal
            isOpen={isEditEntityAttributsModalOpen}
            onClose={() => setIsEditEntityAttributsModalOpen(false)}
            defaultEntityAttributes={{
              health: selectedEntity.health,
              speed: selectedEntity.speed,
              sprite: selectedEntity.sprite,
              bonus: selectedEntity.bonus,
              config: selectedEntity.config,
            }}
            setDefaultEntityAttributs={(
              entityAttributes: IEntityAttributes
            ) => {
              setRounds((prevRounds: Round[]) => {
                const newRounds = [...prevRounds];
                const key = getKey(
                  selectedEntity.threshold,
                  selectedEntity.height
                );
                newRounds[roundSelectedIdx].entities[key] = {
                  ...newRounds[roundSelectedIdx].entities[key],
                  ...entityAttributes,
                };
                return newRounds;
              });
            }}
          />
        )}

        {/* To edit defautl one*/}
        <EditDefaultEntityAttributsModal
          isOpen={isEditDefaultEntityAttributsModalOpen}
          onClose={() => setIsEditDefaultEntityAttributsModalOpen(false)}
          defaultEntityAttributes={defaultEntityAttributes}
          setDefaultEntityAttributs={setDefaultEntityAttributes}
        />

        {/* ============== end of modal ============ */}

        <h1>R-TYPE | Map Editor</h1>
        <div
          style={{
            marginBottom: "20px",
          }}
        >
          <div>
            <h3>Entity Type</h3>
            <Box
              sx={{
                display: "flex",
                gap: "10px",
              }}
            >
              {ALL_TYPES.map((enemyType) => (
                <button
                  key={enemyType}
                  onClick={() => SelectEntity(enemyType)}
                  disabled={
                    !!(
                      selectedEntityType &&
                      selectedEntityType.type === enemyType
                    )
                  }
                  style={{
                    backgroundColor: colorPalette[enemyType],
                    height: 50,
                    width: 110,
                    cursor: "pointer",
                    border:
                      selectedEntityType &&
                      selectedEntityType.type === enemyType
                        ? "1px solid white"
                        : "1px solid transparent",
                  }}
                >
                  {enemyType}
                </button>
              ))}
              <button
                onClick={() => SelectEntity("Eraser")}
                disabled={
                  !!(selectedEntityType && selectedEntityType.type === "Eraser")
                }
                style={{
                  backgroundColor: colorPalette["Eraser"],
                  height: 50,
                  width: 110,
                  cursor: "pointer",
                  border:
                    selectedEntityType && selectedEntityType.type === "Eraser"
                      ? "1px solid white"
                      : "1px solid transparent",
                }}
              >
                <BackspaceIcon />
              </button>
              <WrappedIcon
                title="Change color palette"
                icon={<ColorLensIcon />}
                callback={() => {
                  setIsPaletteModalOpen(true);
                }}
              />
              <WrappedIcon
                title="Edit default entity attributes"
                icon={<DesignServicesIcon />}
                callback={() => {
                  setIsEditDefaultEntityAttributsModalOpen(true);
                }}
              />
            </Box>
          </div>
          <h3
            style={{
              marginBottom: "-5px",
            }}
          >
            Default attributes:
          </h3>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <ul style={{ listStyle: "" }}>
              <li>
                Health:{" "}
                <span style={{ fontWeight: "bold", color: "cyan" }}>
                  {defaultEntityAttributes.health}
                </span>
              </li>
              <li>
                Speed:{" "}
                <span style={{ fontWeight: "bold", color: "cyan" }}>
                  {defaultEntityAttributes.speed}
                </span>
              </li>
              <li>
                Sprite:{" "}
                <span style={{ fontWeight: "bold", color: "cyan" }}>
                  {defaultEntityAttributes.sprite}
                </span>
              </li>
              <li>
                Bonus:{" "}
                <span style={{ fontWeight: "bold", color: "cyan" }}>
                  {defaultEntityAttributes?.bonus !== undefined ? (
                    defaultEntityAttributes.bonus.join(", ")
                  ) : (
                    "None"
                  )}
                </span>
              </li>
              <li>
                Range:{" "}
                <span style={{ fontWeight: "bold", color: "cyan" }}>
                  {defaultEntityAttributes.config.range || "None"}
                </span>
              </li>
              <li>
                Player base Health:{" "}
                <input
                  type="number"
                  min={1}
                  value={baseHealth}
                  placeholder="Player base health"
                  onChange={(e) => {
                    setBaseHealth(Number(e.target.value));
                  }}
                  style={{
                    width: "39px",
                    margin: 0,
                  }}
                />
              </li>
            </ul>
          </Box>

          <p>
            Selected entity:{" "}
            <span style={{ fontWeight: "bold", color: "red" }}>
              {selectedEntityType === null ? "None" : selectedEntityType.type}
            </span>
          </p>
        </div>
        <Box
          sx={{
            display: "flex",
            gap: "10px",
          }}
        >
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
          <button onClick={exportToJson}>
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
        <div>
          <div
            style={{
              overflowX: "auto",
              whiteSpace: "nowrap",
              width: "calc(100vw - 40px)",
            }}
          >
            <h2
              style={{
                marginBottom: 0,
                paddingBottom: 0,
              }}
            >
              Round {shownedRound.round}
            </h2>

            <p
              style={{
                marginTop: 0,
              }}
            >
              Entities:{" "}
              <span style={{ fontWeight: "bold" }}>
                {Object.keys(shownedRound.entities).length}
              </span>
            </p>
            <Box
              sx={{
                display: "flex",
                gap: "10px",
                marginBottom: "10px",
                alignItems: "center",
              }}
            >
              <Box>
                <label
                  style={{
                    marginRight: 10,
                    marginBottom: "20px",
                  }}
                >
                  Grid Width:
                  <input
                    style={{
                      marginLeft: 10,
                      border: "1px solid black",
                      height: 20,
                      width: 100,
                      cursor: "pointer",
                    }}
                    type="number"
                    value={shownedRound.gridWidth}
                    onChange={(e) =>
                      changeRoundGridWidth(
                        roundSelectedIdx,
                        Number(e.target.value)
                      )
                    }
                  />
                </label>
              </Box>

              <WrappedIcon
                title="Delete all entities in the current round"
                icon={
                  <CleaningServicesIcon
                    sx={{
                      color: "#0096D6",
                    }}
                  />
                }
                callback={() => {
                  createConfirmation(
                    "Are you sure you want to delete all entities in this round?",
                    () => cleanWholeRound(roundSelectedIdx)
                  );
                }}
              />
              <WrappedIcon
                title="Delete current round"
                icon={
                  <DeleteIcon
                    sx={{
                      color: "#bb2124",
                    }}
                  />
                }
                callback={() => {
                  createConfirmation(
                    "Are you sure you want to delete this round?",
                    () => deleteRound(roundSelectedIdx)
                  );
                }}
              />
            </Box>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${shownedRound.gridWidth}, 100px)`,
              }}
            >
              {Array.from({ length: shownedRound.gridWidth * 10 }).map(
                (_, tileIndex) => {
                  const ratio = Math.floor(tileIndex / shownedRound.gridWidth);

                  const threshold =
                    (tileIndex % shownedRound.gridWidth) * 10 + 10;
                  const height = 1100 - (ratio * 100 + 100);

                  const key = getKey(threshold, height);
                  const entity = shownedRound.entities[key];
                  const type = (entity && entity.type) || "none";

                  return (
                    <Box
                      key={tileIndex}
                      onClick={(e) => {
                        if (e.ctrlKey) {
                          handleCtrTileClick(roundSelectedIdx, key);
                          return;
                        }
                        handleTileClick(roundSelectedIdx, threshold, height);
                      }}
                      onMouseOver={(e) => {
                        if (e.buttons === 1) {
                          handleTileClick(roundSelectedIdx, threshold, height);
                        }
                      }}
                      sx={{
                        height: 50,
                        width: 100,
                        position: "relative",
                        border: "1px solid black",
                        backgroundColor: colorPalette[type],

                        "&:hover": {
                          borderColor: SMOOTH_ORANGE,
                        },

                        "&:hover > *": {
                          opacity: 1,
                          transition: "opacity 0.3s ease-in-out",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          color: "white",
                          fontSize: 11,
                          userSelect: "none",
                          position: "absolute",
                          opacity: 0,
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        h:{height} <br></br>t:{threshold}
                      </Box>
                    </Box>
                  );
                }
              )}
            </div>
          </div>
          <div
            style={{
              height: "20px",
            }}
          ></div>
          {/* <hr
            style={{
              border: "1px solid black",
              marginTop: "20px",
              marginBottom: "20px",
            }}
          /> */}
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          {rounds.map((round, roundIndex) => {
            return (
              <button
                key={round.round}
                onClick={() => setRoundSelectedIdx(roundIndex)}
                style={{
                  border:
                    roundSelectedIdx === roundIndex
                      ? "1px solid white"
                      : "1px solid transparent",
                  cursor: "pointer",
                }}
              >
                {round.round}
              </button>
            );
          })}
          <button onClick={addRound}>+</button>
          <span style={{ opacity: 0.5, display: "flex", alignItems: "end" }}>
            Total rounds: <strong>{rounds.length}</strong>
          </span>
        </div>
      </div>
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

export default MapEditor;
