import type { RuleParamSpec } from "@src/lib/types";

export interface ParamControlProps<T extends RuleParamSpec = RuleParamSpec> {
  spec: T;
  value: T["default"];
  onChange: (v: T["default"]) => void;
}

export type ParamValue =
  | string
  | number
  | boolean
  | string[]
  | null
  | undefined;
