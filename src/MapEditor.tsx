// src/MapEditor.tsx
import React, { useState } from "react";
import { Box } from "@mui/material";
import JsonModal from "./JsonModal";

const MONSTER_TYPES = ["wave", "normal", "boss"];
const ALL_TYPES = [...MONSTER_TYPES, "obstacles"];

const ENTITIES_COLORS: { [key: string]: string } = {
  wave: "#ffb997",
  boss: "#843b62",
  normal: "#f67e7d", // Corrected the extra spaces here
  obstacles: "#0b032d",
  none: "transparent",
};

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

interface Element {
  type: string;
  color: string;
}

const getKey = (threshold: number, height: number) => `${threshold}:${height}`;

const MapEditor: React.FC = () => {
  const [rounds, setRounds] = useState<Round[]>([
    {
      round: 1,
      entities: {}, // Change from [] to {}
      gridWidth: 10,
    },
  ]);

  const [selectedEnemy, setSelectedEnemy] = useState<Element | null>(null);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [jsonContent, setJsonContent] = useState("");

  const handleEnemyClick = (enemyType: string) => {
    setSelectedEnemy({
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
      if (cleanJson.rounds.length === 0) continue;
      cleanJson.rounds.push(eachRound);
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

  const handleTileClick = (
    roundIndex: number,
    threshold: number,
    height: number
  ) => {
    if (selectedEnemy !== null) {
      setRounds((prevRounds: Round[]) => {
        const newRounds = [...prevRounds];
        const key = getKey(threshold, height);

        newRounds[roundIndex].entities = {
          ...newRounds[roundIndex].entities,
          [key]: {
            type: selectedEnemy.type,
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
                  onClick={() => handleEnemyClick(enemyType)}
                  disabled={
                    !!(selectedEnemy && selectedEnemy.type === enemyType)
                  }
                  style={{
                    backgroundColor: ENTITIES_COLORS[enemyType],
                    border: "1px solid black",
                    height: 50,
                    width: 100,
                    cursor: "pointer",
                  }}
                >
                  {enemyType}
                </button>
              ))}
            </Box>
          </div>
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
        {rounds.map((round, roundIndex) => (
          <div key={round.round} style={{}}>
            <div
              style={{
                overflowX: "auto",
                whiteSpace: "nowrap",
                width: "calc(100vw - 40px)",
              }}
            >
              <label style={{ marginRight: 10 }}>
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
                  value={round.gridWidth}
                  onChange={(e) =>
                    changeRoundGridWidth(roundIndex, Number(e.target.value))
                  }
                />
              </label>
              <h2>Round {round.round}</h2>
              <p>
                Entities:{" "}
                <span style={{ fontWeight: "bold" }}>
                  {Object.keys(round.entities).length}
                </span>
              </p>
              <p>
                Selected enemy:{" "}
                <span style={{ fontWeight: "bold", color: "red" }}>
                  {selectedEnemy === null ? "None" : selectedEnemy.type}
                </span>
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${round.gridWidth}, 100px)`,
                }}
              >
                {Array.from({ length: round.gridWidth * 10 }).map(
                  (_, tileIndex) => {
                    const ratio = Math.floor(tileIndex / round.gridWidth);

                    const threshold = (tileIndex % round.gridWidth) * 10 + 10;
                    const height = ratio * 100 + 100;

                    const key = getKey(threshold, height);
                    const entity = round.entities[key];
                    const type = (entity && entity.type) || "none";

                    return (
                      <Box
                        key={tileIndex}
                        onClick={() =>
                          handleTileClick(roundIndex, threshold, height)
                        }
                        sx={{
                          height: 50,
                          width: 100,
                          position: "relative",
                          border: "1px solid black",
                          backgroundColor: ENTITIES_COLORS[type],

                          "&:hover": {
                            borderColor: "rgba(255, 165, 0, 0.5)",
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
            <hr
              style={{
                border: "1px solid black",
                marginTop: "20px",
                marginBottom: "20px",
              }}
            />
          </div>
        ))}
        <button onClick={addRound}>Add Round</button>
        <span style={{ marginLeft: 10 }}>
          Total rounds: <strong>{rounds.length}</strong>
        </span>
      </div>
      <p
        style={{
          textAlign: "center",
        }}
      >
        Made with ❤️ by <a href="https://github.com/izimio">izimio</a>
      </p>
      <p style={{ textAlign: "center", fontSize: 11 }}>
        R-Type 2024 - Paul Laban, Baptiste Leroyer, Lois Maneux, Arthur Pahon,
        Joshua Brionne
      </p>
    </div>
  );
};

export default MapEditor;
