import React, { useEffect, useState } from "react";
import { Box, Icon } from "@mui/material";

import { SPRITES_NAMES, ALL_BONUS, SMOOTH_ORANGE } from "../utils/constants";
import { IEntityAttributes } from "../EditDefaultEntityAttributsModal";

import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import FlashOnIcon from "@mui/icons-material/FlashOn";
// Icons

interface IEditDefaultEntityAttributsModal {
  EntityAttributes: IEntityAttributes;
  setEntityAttributs: (entityAttributes: IEntityAttributes) => void;
}

const returnRightIcons = (bonus: string) => {
  switch (bonus) {
    case "health":
      return <HealthAndSafetyIcon />;
    case "damage":
      return <FlashOnIcon />;
    case "invincible":
      return <AllInclusiveIcon />;
    default:
      return <Icon sx={{ color: SMOOTH_ORANGE }}>Oups</Icon>;
  }
};

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
      <label
        style={{
          marginRight: 10,
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
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
      <label
        style={{
          marginRight: 10,
          textAlign: "center",
        }}
      >
        <span
          style={{
            marginBottom: "20px",
          }}
        >
          Bonus
        </span>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            marginTop: "10px",
          }}
        >
          {ALL_BONUS.map((bonus) => (
            <Icon
              key={bonus}
              title={bonus}
              sx={{
                float: "right",
                cursor: "pointer",
                marginTop: "10px",
                marginRight: "10px",
                paddingBottom: "10px",
                borderBottom: `1px solid transparent`,
                "&>*": {
                  color: defaultEntityAttributs.bonus?.includes(bonus)
                    ? SMOOTH_ORANGE
                    : "white",
                },
                "&:hover": {
                  color: "#ccd",
                  borderBottom: `1px solid ${SMOOTH_ORANGE}`,
                },
              }}
              onClick={() => {
                if (defaultEntityAttributs.bonus?.includes(bonus)) {
                  setDefaultEntityAttributs((prevState: IEntityAttributes) => ({
                    ...prevState,
                    bonus: prevState.bonus.filter((b) => b !== bonus),
                  }));

                  return;
                }
                setDefaultEntityAttributs((prevState: IEntityAttributes) => ({
                  ...prevState,
                  bonus: prevState.bonus
                    ? [...prevState.bonus, bonus]
                    : [bonus],
                }));
              }}
            >
              {returnRightIcons(bonus)}
            </Icon>
          ))}
        </Box>
      </label>
    </Box>
  );
};

export default UpdateTileAttributes;
