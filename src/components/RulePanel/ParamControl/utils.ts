import { ParamValue } from "./types";

// Helpers to normalize input values by control type (no `unknown`)
export const toNumberInput = (v: ParamValue): number | "" => {
  if (typeof v === "number") return v;
  if (v === null || v === undefined || v === "") return "";
  const n = Number(v as string);
  return Number.isFinite(n) ? n : "";
};

export const toStringInput = (v: ParamValue): string => {
  if (v === null || v === undefined) return "";
  return String(v);
};
