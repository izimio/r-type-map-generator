// src/MapEditor.tsx
import React, { useState } from "react";
import { Box } from "@mui/material";
interface Enemy {
  type: string;
  treshold: number;
  height: number;
}

interface Round {
  round: number;
  enemies: Enemy[];
  obstacles: any[]; // You can extend this based on your obstacle structure
}

const MapEditor: React.FC = () => {
  const [rounds, setRounds] = useState<Round[]>([
    {
      round: 1,
      enemies: [],
      obstacles: [],
    },
  ]);

  const [selectedEnemy, setSelectedEnemy] = useState<string | null>(null);
  const [gridWidth, setGridWidth] = useState<number>(10); // Default grid width

  const addRound = () => {
    setRounds((prevRounds) => [
      ...prevRounds,
      {
        round: prevRounds.length + 1,
        enemies: [],
        obstacles: [],
      },
    ]);
  };

  const handleTileClick = (roundIndex: number, tileIndex: number) => {
    if (selectedEnemy !== null) {
      setRounds((prevRounds) => {
        const newRounds = [...prevRounds];
        newRounds[roundIndex].enemies.push({
          type: selectedEnemy,
          treshold: tileIndex * 10,
          height: 0, // You can set the default height as needed
        });
        return newRounds;
      });
    }
  };

  const handleEnemyClick = (enemyType: string) => {
    setSelectedEnemy(enemyType);
  };

  const exportToJson = () => {
    const jsonConfig = JSON.stringify({ rounds }, null, 2);
    console.log(jsonConfig);
    // You can save the JSON to a file or use it as needed
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Map Editor</h1>
      <div>
        <div>
          <h3>Enemy Types</h3>
          {["wave", "normal" /* Add more enemy types as needed */].map(
            (enemyType) => (
              <button
                key={enemyType}
                onClick={() => handleEnemyClick(enemyType)}
                disabled={selectedEnemy === enemyType}
              >
                {enemyType}
              </button>
            )
          )}
        </div>
      </div>
      {rounds.map((round, roundIndex) => (
        <div key={round.round}>
          <div
            style={{ overflowX: "auto", whiteSpace: "nowrap", width: "100%" }}
          >
            <h3>Grid</h3>
            <p>
              Round {round.round} - {round.enemies.length} enemies
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
                gridTemplateColumns: `repeat(${gridWidth}, 100px)`,
              }}
            >
              {Array.from({ length: gridWidth * 10 }).map((_, tileIndex) => (
                <Box
                  key={tileIndex}
                  className={`grid-tile ${
                    tileIndex % 2 === 0 ? "even" : "odd"
                  }`}
                  onClick={() => handleTileClick(roundIndex, tileIndex)}
                  style={{
                    height: 50,
                    width: 100,
                    border: "1px solid black",
                  }}
                  sx={{
                    // "&.even": {
                    //   backgroundColor: "#333",
                    // },
                    // "&.odd": {
                    //   backgroundColor: "#222",
                    // },
                    "&.selected": {
                      backgroundColor: "red",
                    },
                    "&:hover": {
                      backgroundColor: "#444",
                    },
                    
                  }}
                ></Box>
              ))}
            </div>
          </div>
        </div>
      ))}
      <label>
        Grid Width:
        <input
          type="number"
          value={gridWidth}
          onChange={(e) =>
            setGridWidth(Math.max(1, parseInt(e.target.value, 10) || 0))
          }
        />
      </label>
      <button onClick={addRound}>Add Round</button>
      <button onClick={exportToJson}>Export to JSON</button>
    </div>
  );
};

export default MapEditor;
