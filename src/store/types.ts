import type { RuleParamSpec } from "@src/lib/types";

export type RuleTemplateMeta = {
  rule_id: string;
  title: string;
  params: RuleParamSpec[];
};

export type Filters = {
  search: string;
  type: string | undefined;
  country: string | undefined;
  firedOnly: boolean;
};
