// utils/colorHelper.js
import { COLORS } from "../constants/bgShortColor";

export const getColorById = (entity) => {
  const id = typeof entity === "object" ? (entity?.userId || entity?.id) : entity;
  if (!id) return "bg-secondary";
  const hash = id.toString().split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return COLORS[hash % COLORS.length];
};
