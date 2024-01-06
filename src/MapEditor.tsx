// src/MapEditor.tsx
import React, { useState, useEffect } from "react";
import { Box, Icon } from "@mui/material";
import JsonModal from "./JsonModal";
import WrappedIcon from "./Icon";

import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  getLocalStorageItem,
  saveLocalStorageItem,
} from "./utils/localStorage";

const MONSTER_TYPES = ["wave", "normal", "boss"];
const ALL_TYPES = [...MONSTER_TYPES, "obstacles"];

const ENTITIES_COLORS: { [key: string]: string } = {
  wave: "#74546a",
  boss: "#843b62",
  normal: "#f67e7d", // Corrected the extra spaces here
  obstacles: "#0b032d",
  none: "transparent",
};

const SMOOTH_ORANGE = "rgba(255, 165, 0, 0.5)";

interface Entity {
  type: string;
  threshold: number;
  height: number;
}

interface Round {
  round: number;
  entities: Record<string, Entity>; // Change from Entity[] to Record<string, Entity>
  gridWidth: number;
}

interface JsonMap {
  rounds:
    | [
        {
          round: number;
          ennemies: Entity[];
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

  const [selectedEntity, setselectedEntity] = useState<EntityElement | null>(
    null
  );
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [jsonContent, setJsonContent] = useState("");
  const [roundSelectedIdx, setRoundSelectedIdx] = useState(0);
  const shownedRound = rounds[roundSelectedIdx];

  useEffect(() => {
    saveLocalStorageItem("rounds", rounds);
  }, [rounds]);

  const SelectEntity = (enemyType: string) => {
    setselectedEntity({
      type: enemyType,
      color: ENTITIES_COLORS[enemyType],
    });
  };

  const exportToJson = () => {
    const cleanJson: JsonMap = {
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
        ennemies: Entity[];
        obstacles: Entity[];
      } = {
        round: i + 1,
        ennemies: [],
        obstacles: [],
      };

      for (const [, value] of Object.entries(idxRounds.entities)) {
        if (MONSTER_TYPES.includes(value.type)) {
          eachRound.ennemies.push(value);
        }
        if (value.type === "obstacle") {
          eachRound.obstacles.push(value);
        }
      }
      cleanJson.rounds.push(eachRound as never);
    }
    setJsonContent(JSON.stringify(cleanJson, null, 2));
    setIsJsonModalOpen(true);
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
  const handleTileClick = (
    roundIndex: number,
    threshold: number,
    height: number
  ) => {
    if (selectedEntity !== null) {
      setRounds((prevRounds: Round[]) => {
        const newRounds = [...prevRounds];
        const key = getKey(threshold, height);

        newRounds[roundIndex].entities = {
          ...newRounds[roundIndex].entities,
          [key]: {
            type: selectedEntity.type,
            threshold: threshold,
            height: height,
          },
        };
        return newRounds;
      });
    }
  };

  // ===============  Rounds functions  ===============

  return (
    <div>
      <div style={{ padding: 20 }}>
        <JsonModal
          isOpen={isJsonModalOpen}
          onClose={() => setIsJsonModalOpen(false)}
          jsonContent={jsonContent}
        />
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
                    !!(selectedEntity && selectedEntity.type === enemyType)
                  }
                  style={{
                    backgroundColor: ENTITIES_COLORS[enemyType],
                    height: 50,
                    width: 110,
                    cursor: "pointer",
                    border:
                      selectedEntity && selectedEntity.type === enemyType
                        ? "1px solid white"
                        : "1px solid transparent",
                  }}
                >
                  {enemyType}
                </button>
              ))}
            </Box>
          </div>
          <p>
            Selected entity:{" "}
            <span style={{ fontWeight: "bold", color: "red" }}>
              {selectedEntity === null ? "None" : selectedEntity.type}
            </span>
          </p>
        </div>
        <Box
          sx={{
            display: "flex",
            gap: "10px",
          }}
        >
          <button onClick={exportToJson}>Import JSON</button>
          <button onClick={exportToJson}>Export to JSON</button>
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
                icon={<CleaningServicesIcon />}
                callback={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to delete all entities in this round?"
                    )
                  ) {
                    cleanWholeRound(roundSelectedIdx);
                  }
                }}
              />
              <WrappedIcon
                title="Delete current round"
                icon={<DeleteIcon />}
                callback={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to delete all entities in this round?"
                    )
                  ) {
                    deleteRound(roundSelectedIdx);
                  }
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
                  const height = ratio * 100 + 100;

                  const key = getKey(threshold, height);
                  const entity = shownedRound.entities[key];
                  const type = (entity && entity.type) || "none";

                  return (
                    <Box
                      key={tileIndex}
                      onClick={() =>
                        handleTileClick(roundSelectedIdx, threshold, height)
                      }
                      sx={{
                        height: 50,
                        width: 100,
                        position: "relative",
                        border: "1px solid black",
                        backgroundColor: ENTITIES_COLORS[type],

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
