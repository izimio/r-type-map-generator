import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";

import { SPRITES_NAMES } from "../utils/constants";
import { IEntityAttributes } from "../EditDefaultEntityAttributsModal";

interface IEditDefaultEntityAttributsModal {
  EntityAttributes: IEntityAttributes;
  setEntityAttributs: (entityAttributes: IEntityAttributes) => void;
}

const UpdateTileAttributes: React.FC<IEditDefaultEntityAttributsModal> = ({
  EntityAttributes,
  setEntityAttributs,
}) => {
  const [defaultEntityAttributs, setDefaultEntityAttributs] =
    useState<IEntityAttributes>(EntityAttributes);

  const updateEntityAttributs = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
  
    let tmpValue: number | string = value;

    try {
      if (name !== "sprite") {
        tmpValue = parseInt(value);
        if (isNaN(tmpValue)) {
          tmpValue = 0;
        }
      }
    } catch (e) {
      console.error("");
    }
    setDefaultEntityAttributs((prevState) => ({
      ...prevState,
      [name]: tmpValue,
    }));
  };

  useEffect(() => {
    setEntityAttributs(defaultEntityAttributs);
  }, [defaultEntityAttributs, setEntityAttributs]);
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <h2>Entity default attributs</h2>

      <label
        style={{
          marginRight: 10,
          marginBottom: "20px",
        }}
      >
        Health
        <input
          style={{
            marginLeft: 10,
            border: "1px solid black",
            height: 20,
            width: 100,
            cursor: "pointer",
          }}
          type="number"
          min={1}
          value={defaultEntityAttributs.health}
          name="health"
          onChange={(e) => {
            updateEntityAttributs(e);
          }}
        />
      </label>
      <label
        style={{
          marginRight: 10,
          marginBottom: "20px",
        }}
      >
        Speed
        <input
          style={{
            marginLeft: 10,
            border: "1px solid black",
            height: 20,
            width: 100,
            cursor: "pointer",
          }}
          type="number"
          min={1}
          value={defaultEntityAttributs.speed}
          name="speed"
          onChange={(e) => {
            updateEntityAttributs(e);
          }}
        />
      </label>
      <label
        style={{
          marginRight: 10,
          marginBottom: "20px",
        }}
      >
        Range
        <input
          style={{
            marginLeft: 10,
            border: "1px solid black",
            height: 20,
            width: 100,
            cursor: "pointer",
          }}
          type="number"
          min={0}
          value={defaultEntityAttributs.config.range || 0}
          name="range"
          onChange={(e) => {
            let value = 0;
            try {
              value = parseInt(e.target.value);
              if (isNaN(value)) {
                value = 0;
              }
            } catch (e) {
              console.error("");
            }
            if (value < 1) {
              setDefaultEntityAttributs((prevState: IEntityAttributes) => ({
                ...prevState,
                config: {},
              }));
              return;
            }
            setDefaultEntityAttributs((prevState: IEntityAttributes) => ({
              ...prevState,
              config: {
                ...prevState.config,
                range: value,
              },
            }));
          }}
        />
      </label>
      <label
        style={{
          marginRight: 10,
          marginBottom: "20px",
        }}
      >
        Sprite
        <select
          key="sprite"
          name="sprite"
          value={defaultEntityAttributs.sprite}
          onChange={(e) => {
            updateEntityAttributs(e);
          }}
          style={{
            marginLeft: 10,
            border: "1px solid black",
            height: 20,
            width: 100,
            cursor: "pointer",
          }}
        >
          {SPRITES_NAMES.map((sprite) => (
            <option key={sprite} value={sprite}>
              {sprite}
            </option>
          ))}
        </select>
      </label>
    </Box>
  );
};

export default UpdateTileAttributes;
