export const MONSTER_TYPES = ["wave", "normal", "boss"];
export const ALL_TYPES = [...MONSTER_TYPES, "obstacles"];

export const ALL_BONUS = ["invincible", "health", "damage"];
export const SPRITES_NAMES = ["ennemy", "boss"];

export const ENTITIES_COLORS: { [key: string]: string } = {
  wave: "#74546a",
  boss: "#843b62",
  normal: "#f67e7d",
  obstacles: "#0b032d",
  none: "transparent",
};

export const DEFAULT_ENTITY_ATTRIBUTES = {
  speed: 1,
  health: 1,
  bonus: [],
  sprite: "ennemy",
  config: {},
};

export const SMOOTH_ORANGE = "rgba(255, 165, 0, 0.5)";
