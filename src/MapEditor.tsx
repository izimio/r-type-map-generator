// src/MapEditor.tsx
import React, { useState } from "react";
import { Box } from "@mui/material";
import JsonModal from "./JsonModal";

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

const getKey = (threshold: number, height: number) => `${threshold}:${height}`;

const MapEditor: React.FC = () => {
  const [rounds, setRounds] = useState<Round[]>([
    {
      round: 1,
      entities: {}, // Change from [] to {}
      gridWidth: 10,
    },
  ]);

  const [selectedEnemy, setSelectedEnemy] = useState<string | null>(null);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);

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

  const handleTileClick = (
    roundIndex: number,
    threshold: number,
    height: number
  ) => {
    if (selectedEnemy !== null) {
      setRounds((prevRounds) => {
        const newRounds = [...prevRounds];
        const key = getKey(threshold, height);

        newRounds[roundIndex].entities = {
          ...newRounds[roundIndex].entities,
          [key]: {
            type: selectedEnemy,
            threshold: threshold,
            height: height,
          },
        };
        return newRounds;
      });
    }
  };

  const handleEnemyClick = (enemyType: string) => {
    setSelectedEnemy(enemyType);
  };

  const exportToJson = () => {
    setIsJsonModalOpen(true);
  };

  return (
    <div style={{ padding: 20 }}>
      <JsonModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        jsonContent={JSON.stringify({ rounds }, null, 2)}
      />
      <h1>R-TYPE | Map Editor</h1>
      <div>
        <div>
          <h3>Entity Type</h3>
          {["wave", "normal", "obstacle"].map((enemyType) => (
            <button
              key={enemyType}
              onClick={() => handleEnemyClick(enemyType)}
              disabled={selectedEnemy === enemyType}
            >
              {enemyType}
            </button>
          ))}
        </div>
      </div>
      {rounds.map((round, roundIndex) => (
        <div key={round.round} style={{}}>
          <div
            style={{
              overflowX: "auto",
              whiteSpace: "nowrap",
              width: "calc(100vw - 40px)",
            }}
          >
            <h3>Grid</h3>
            <label>
              Grid Width:
              <input
                type="number"
                value={round.gridWidth}
                onChange={(e) =>
                  setRounds((prevRounds) => {
                    const newRounds = [...prevRounds];
                    newRounds[roundIndex].gridWidth = Number(e.target.value);
                    return newRounds;
                  })
                }
              />
            </label>
            <p>Round {round.round}</p>
            <p>
              Entities:{" "}
              <span style={{ fontWeight: "bold" }}>
                {Object.keys(round.entities).length}
              </span>
            </p>
            <p>
              Selected enemy:{" "}
              <span style={{ fontWeight: "bold", color: "red" }}>
                {selectedEnemy === null ? "None" : selectedEnemy}
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
                        backgroundColor:
                          type === "wave"
                            ? "rgba(0, 0, 255, 0.5)"
                            : type === "normal"
                            ? "rgba(0, 255, 0, 0.5)"
                            : type === "obstacle"
                            ? "rgba(255, 0, 0, 0.5)"
                            : "rgba(0, 0, 0, 0.5)",

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
        </div>
      ))}
      <button onClick={addRound}>Add Round</button>
      <button onClick={exportToJson}>Export to JSON</button>
    </div>
  );
};

export default MapEditor;
