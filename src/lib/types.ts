// export type Transaction = {
//   transaction_id: string;
//   txn_date_time: string;
//   sender_account_id: string;
//   receiver_account_id: number;
//   amount: number;
//   currency: string;
//   transaction_type: string;
//   terminal_id: number;
//   merchant_city: string;
//   merchant_country: string;
//   merchant_postcode: any;
//   merchant_description_condensed: string;
// };

export type Transaction = {
  transaction_id: string;
  txn_date_time: string;
  sender_account_id: string;
  receiver_account_id: number;
  amount: number;
  currency: string;
  transaction_type: string;
  terminal_id: number;
  merchant_city: string;
  merchant_country: string;
  merchant_postcode: string | number | null; // ← replaces `any`
  merchant_description_condensed: string;
};

export type FeatureVector = {
  transaction_id: string;
  sender_account_id: string;
  receiver_account_id: number;
  amount: number;
  currency: string;
  transaction_type: string;
  transaction_count: number;
  avg_transaction_amount: number;
  hour_of_day: number;
  day_of_week: number;
  merchant_avg_transaction_amount: number;
};

export type RuleMeta = {
  rule_id: string;
  name: string;
  description: string;
  action: "Alert" | "Review" | "Investigate" | "Block" | string;
  severity: "Low" | "Medium" | "High" | "Critical" | string;
};

// export type RuleParamSpec = {
//   key: string;
//   label: string;
//   type: "number" | "string" | "select" | "multiselect" | "boolean";
//   options?: string[];
//   default?: any;
//   help?: string;
// };

export type RuleParamSpec = {
  key: string;
  label: string;
  type: "number" | "string" | "select" | "multiselect" | "boolean";
  options?: string[];
  default?: string | number | boolean | string[] | null; // ← replaces `any`
  help?: string;
};

// Define a stricter record type instead of Record<string, any>
export type RuleParamValues = Record<
  string,
  string | number | boolean | string[] | null | undefined
>;

// export type RuleTemplate = {
//   rule_id: string;
//   title: string;
//   params: RuleParamSpec[];
//   evaluator: (
//     tx: Transaction,
//     fv: FeatureVector | undefined,
//     params: Record<string, any>
//   ) => {
//     fired: boolean;
//     reasons: string[];
//     facts: Record<string, any>;
//   };
// };

export type RuleTemplate = {
  rule_id: string;
  title: string;
  params: RuleParamSpec[];
  evaluator: (
    tx: Transaction,
    fv: FeatureVector | undefined,
    params: RuleParamValues // ← replaces `Record<string, any>`
  ) => {
    fired: boolean;
    reasons: string[];
    facts: Record<string, string | number | boolean | string[] | null>; // ← replaces `Record<string, any>`
  };
};

// export type EvaluatedRow = {
//   tx: Transaction;
//   fv?: FeatureVector;
//   result: {
//     fired: boolean;
//     reasons: string[];
//     facts: Record<string, any>;
//     score?: number;
//   };
// };

export type EvaluatedRow = {
  tx: Transaction;
  fv?: FeatureVector;
  result: {
    fired: boolean;
    reasons: string[];
    facts: Record<string, string | number | boolean | string[] | null>; // ← replaces `Record<string, any>`
    score?: number;
  };
};

export type RuleTemplateMeta = Omit<RuleTemplate, "evaluator">;

// Shapes straight from JSON where numeric fields may arrive as string/number/null
export type RawTransaction = Omit<
  Transaction,
  "receiver_account_id" | "terminal_id" | "amount"
> & {
  receiver_account_id: number | string | null;
  terminal_id: number | string | null;
  amount: number | string | null;
};

export type RawFeatureVector = Omit<
  FeatureVector,
  | "receiver_account_id"
  | "transaction_count"
  | "avg_transaction_amount"
  | "hour_of_day"
  | "day_of_week"
  | "merchant_avg_transaction_amount"
  | "amount"
> & {
  receiver_account_id: number | string | null;
  transaction_count: number | string | null;
  avg_transaction_amount: number | string | null;
  hour_of_day: number | string | null;
  day_of_week: number | string | null;
  merchant_avg_transaction_amount: number | string | null;
  amount: number | string | null;
};
