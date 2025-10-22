// import type { RuleTemplate, Transaction, FeatureVector } from "@src/lib/types";

// function inSet(val: string, set: string[]) {
//   return set?.map((s) => s?.toLowerCase())?.includes(val?.toLowerCase());
// }

// function evaluateHighValue(
//   tx: Transaction,
//   _fv: FeatureVector | undefined,
//   params: Record<string, any>
// ) {
//   const threshold = Number(params?.threshold) || 1000;
//   const fired = tx?.amount > threshold;
//   return {
//     fired,
//     reasons: [
//       fired
//         ? `amount ${tx?.amount} > threshold ${threshold}`
//         : `amount ${tx?.amount} ≤ threshold ${threshold}`,
//     ],
//     facts: { amount: tx?.amount, threshold },
//   };
// }

// function evaluateManySmalls(
//   tx: Transaction,
//   fv: FeatureVector | undefined,
//   params: Record<string, any>
// ) {
//   const maxAmount = Number(params?.maxAmount) || 20;
//   const minCount = Number(params?.minCount) || 3;
//   const fired =
//     (fv?.avg_transaction_amount ?? 0) <= maxAmount &&
//     (fv?.transaction_count ?? 0) >= minCount;
//   return {
//     fired,
//     reasons: [
//       (fv?.avg_transaction_amount ?? 0) <= maxAmount
//         ? `avg_amount ${fv?.avg_transaction_amount} ≤ ${maxAmount}`
//         : `avg_amount ${fv?.avg_transaction_amount} > ${maxAmount}`,
//       (fv?.transaction_count ?? 0) >= minCount
//         ? `count ${fv?.transaction_count} ≥ ${minCount}`
//         : `count ${fv?.transaction_count} < ${minCount}`,
//     ],
//     facts: {
//       avg_amount: fv?.avg_transaction_amount,
//       count: fv?.transaction_count,
//       maxAmount,
//       minCount,
//     },
//   };
// }

// function evaluateUnusualType(
//   tx: Transaction,
//   _fv: FeatureVector | undefined,
//   params: Record<string, any>
// ) {
//   const usualTypes: string[] = params?.usualTypes || ["online", "contactless"];
//   const fired = !inSet(tx?.transaction_type, usualTypes);
//   return {
//     fired,
//     reasons: [
//       fired
//         ? `type ${tx?.transaction_type} ∉ usualTypes`
//         : `type ${tx?.transaction_type} ∈ usualTypes`,
//     ],
//     facts: { transaction_type: tx.transaction_type, usualTypes },
//   };
// }

// function evaluateHighRiskMerchant(
//   tx: Transaction,
//   _fv: FeatureVector | undefined,
//   params: Record<string, any>
// ) {
//   const highRiskCountries: string[] = params?.highRiskCountries || [
//     "BRA",
//     "MEX",
//   ];
//   const fired = inSet(tx?.merchant_country, highRiskCountries);
//   return {
//     fired,
//     reasons: [
//       fired
//         ? `merchant_country ${tx?.merchant_country} ∈ highRiskCountries`
//         : `merchant_country ${tx?.merchant_country} ∉ highRiskCountries`,
//     ],
//     facts: { merchant_country: tx?.merchant_country, highRiskCountries },
//   };
// }

// function evaluateCrossBorder(
//   tx: Transaction,
//   _fv: FeatureVector | undefined,
//   params: Record<string, any>
// ) {
//   const userHomeCountries: string[] = params?.userHomeCountries || ["PAN"];
//   const minAmount = Number(params?.minAmount) || 100;
//   const fired =
//     !inSet(tx?.merchant_country, userHomeCountries) && tx?.amount >= minAmount;
//   return {
//     fired,
//     reasons: [
//       !inSet(tx?.merchant_country, userHomeCountries)
//         ? `merchant_country ${tx?.merchant_country} ∉ userHomeCountries`
//         : `merchant_country ${tx?.merchant_country} ∈ userHomeCountries`,
//       tx?.amount >= minAmount
//         ? `amount ${tx?.amount} ≥ ${minAmount}`
//         : `amount ${tx?.amount} < ${minAmount}`,
//     ],
//     facts: {
//       merchant_country: tx?.merchant_country,
//       userHomeCountries,
//       amount: tx?.amount,
//       minAmount,
//     },
//   };
// }

// function evaluateOffHours(
//   tx: Transaction,
//   fv: FeatureVector | undefined,
//   params: Record<string, any>
// ) {
//   const start = Number(params?.start) || 22; // 10PM
//   const end = Number(params?.end) || 6; // 6AM
//   const hour = fv?.hour_of_day ?? new Date(tx?.txn_date_time).getHours();
//   const fired = start <= hour || hour < end;
//   return {
//     fired,
//     reasons: [
//       fired
//         ? `hour ${hour} is between ${start}:00-06:00 (wrap)`
//         : `hour ${hour} is within normal hours`,
//     ],
//     facts: { hour, start, end },
//   };
// }

// function evaluateLargeATM_correct(
//   tx: Transaction,
//   _fv: FeatureVector | undefined,
//   params: Record<string, any>
// ) {
//   const minAmount = Number(params?.minAmount) || 300;
//   const fired =
//     tx?.transaction_type?.toLowerCase() === "atm" && tx?.amount >= minAmount;
//   return {
//     fired,
//     reasons: [
//       fired
//         ? `ATM withdrawal ≥ ${minAmount}`
//         : `Not ATM or amount < ${minAmount}`,
//     ],
//     facts: { type: tx?.transaction_type, amount: tx?.amount, minAmount },
//   };
// }

// export const RULE_TEMPLATES: RuleTemplate[] = [
//   {
//     rule_id: "RULE_001",
//     title: "High Value Transaction Alert",
//     params: [
//       {
//         key: "threshold",
//         label: "Threshold Amount",
//         type: "number",
//         default: 100.0,
//         help: "Fire if tx.amount > threshold",
//       },
//     ],
//     evaluator: evaluateHighValue,
//   },
//   {
//     rule_id: "RULE_002",
//     title: "Multiple Small Txns (Short Period)",
//     params: [
//       {
//         key: "maxAmount",
//         label: "Max Amount (avg)",
//         type: "number",
//         default: 20,
//       },
//       {
//         key: "minCount",
//         label: "Min Count in Window",
//         type: "number",
//         default: 3,
//         help: "Use feature_vectors.transaction_count",
//       },
//     ],
//     evaluator: evaluateManySmalls,
//   },
//   {
//     rule_id: "RULE_003",
//     title: "Unusual Transaction Type for User",
//     params: [
//       {
//         key: "usualTypes",
//         label: "Usual Types",
//         type: "multiselect",
//         options: ["online", "contactless", "chip", "swipe", "atm"],
//         default: ["online", "contactless"],
//       },
//     ],
//     evaluator: evaluateUnusualType,
//   },
//   {
//     rule_id: "RULE_004",
//     title: "Transaction to High-Risk Merchant",
//     params: [
//       {
//         key: "highRiskCountries",
//         label: "High-Risk Countries",
//         type: "multiselect",
//         options: ["BRA", "MEX", "CRI", "PAN"],
//         default: ["BRA", "MEX"],
//       },
//     ],
//     evaluator: evaluateHighRiskMerchant,
//   },
//   {
//     rule_id: "RULE_005",
//     title: "Cross-Border Transaction Anomaly",
//     params: [
//       {
//         key: "userHomeCountries",
//         label: "User Home Countries",
//         type: "multiselect",
//         options: ["PAN", "BRA", "MEX", "CRI", "GTM"],
//         default: ["PAN"],
//       },
//       { key: "minAmount", label: "Min Amount", type: "number", default: 100 },
//     ],
//     evaluator: evaluateCrossBorder,
//   },
//   {
//     rule_id: "RULE_006",
//     title: "Transaction Outside Normal Hours",
//     params: [
//       { key: "start", label: "Night Start Hour", type: "number", default: 22 },
//       { key: "end", label: "Night End Hour", type: "number", default: 6 },
//     ],
//     evaluator: evaluateOffHours,
//   },
//   {
//     rule_id: "RULE_007",
//     title: "Large Cash Withdrawal",
//     params: [
//       {
//         key: "minAmount",
//         label: "Min ATM Amount",
//         type: "number",
//         default: 300,
//       },
//     ],
//     evaluator: evaluateLargeATM_correct,
//   },
// ];

// // after export const RULE_TEMPLATES = [...]
// export const RULE_TEMPLATES_MAP = Object.fromEntries(
//   RULE_TEMPLATES?.map((t) => [t?.rule_id, t])
// ) as Record<string, RuleTemplate>;

import type {
  RuleTemplate,
  Transaction,
  FeatureVector,
  RuleParamValues,
} from "@src/lib/types";
// import type { RuleParamValues } from "@src/lib/types";
// Narrow, safe param bag (no `any`)
// type RuleParams = Record<
//   string,
//   string | number | boolean | string[] | undefined
// >;

function inSet(val: string, set: string[]) {
  return set?.map((s) => s?.toLowerCase())?.includes(val?.toLowerCase());
}

function evaluateHighValue(
  tx: Transaction,
  _fv: FeatureVector | undefined,
  params: RuleParamValues
) {
  const threshold = Number(params?.threshold) || 1000;
  const fired = tx?.amount > threshold;
  return {
    fired,
    reasons: [
      fired
        ? `amount ${tx?.amount} > threshold ${threshold}`
        : `amount ${tx?.amount} ≤ threshold ${threshold}`,
    ],
    facts: { amount: tx?.amount, threshold },
  };
}

function evaluateManySmalls(
  tx: Transaction,
  fv: FeatureVector | undefined,
  params: RuleParamValues
) {
  const maxAmount = Number(params?.maxAmount) || 20;
  const minCount = Number(params?.minCount) || 3;
  const fired =
    (fv?.avg_transaction_amount ?? 0) <= maxAmount &&
    (fv?.transaction_count ?? 0) >= minCount;
  return {
    fired,
    reasons: [
      (fv?.avg_transaction_amount ?? 0) <= maxAmount
        ? `avg_amount ${fv?.avg_transaction_amount} ≤ ${maxAmount}`
        : `avg_amount ${fv?.avg_transaction_amount} > ${maxAmount}`,
      (fv?.transaction_count ?? 0) >= minCount
        ? `count ${fv?.transaction_count} ≥ ${minCount}`
        : `count ${fv?.transaction_count} < ${minCount}`,
    ],
    // facts: {
    //   avg_amount: fv?.avg_transaction_amount,
    //   count: fv?.transaction_count,
    //   maxAmount,
    //   minCount,
    // },
    facts: {
      avg_amount: fv?.avg_transaction_amount ?? null,
      count: fv?.transaction_count ?? null,
      maxAmount,
      minCount,
    },
  };
}

function evaluateUnusualType(
  tx: Transaction,
  _fv: FeatureVector | undefined,
  params: RuleParamValues
) {
  const usualTypes: string[] = (params?.usualTypes as string[]) || [
    "online",
    "contactless",
  ];
  const fired = !inSet(tx?.transaction_type, usualTypes);
  return {
    fired,
    reasons: [
      fired
        ? `type ${tx?.transaction_type} ∉ usualTypes`
        : `type ${tx?.transaction_type} ∈ usualTypes`,
    ],
    facts: { transaction_type: tx.transaction_type, usualTypes },
  };
}

function evaluateHighRiskMerchant(
  tx: Transaction,
  _fv: FeatureVector | undefined,
  params: RuleParamValues
) {
  const highRiskCountries: string[] =
    (params?.highRiskCountries as string[]) || ["BRA", "MEX"];
  const fired = inSet(tx?.merchant_country, highRiskCountries);
  return {
    fired,
    reasons: [
      fired
        ? `merchant_country ${tx?.merchant_country} ∈ highRiskCountries`
        : `merchant_country ${tx?.merchant_country} ∉ highRiskCountries`,
    ],
    facts: { merchant_country: tx?.merchant_country, highRiskCountries },
  };
}

function evaluateCrossBorder(
  tx: Transaction,
  _fv: FeatureVector | undefined,
  params: RuleParamValues
) {
  const userHomeCountries: string[] =
    (params?.userHomeCountries as string[]) || ["PAN"];
  const minAmount = Number(params?.minAmount) || 100;
  const fired =
    !inSet(tx?.merchant_country, userHomeCountries) && tx?.amount >= minAmount;
  return {
    fired,
    reasons: [
      !inSet(tx?.merchant_country, userHomeCountries)
        ? `merchant_country ${tx?.merchant_country} ∉ userHomeCountries`
        : `merchant_country ${tx?.merchant_country} ∈ userHomeCountries`,
      tx?.amount >= minAmount
        ? `amount ${tx?.amount} ≥ ${minAmount}`
        : `amount ${tx?.amount} < ${minAmount}`,
    ],
    facts: {
      merchant_country: tx?.merchant_country,
      userHomeCountries,
      amount: tx?.amount,
      minAmount,
    },
  };
}

function evaluateOffHours(
  tx: Transaction,
  fv: FeatureVector | undefined,
  params: RuleParamValues
) {
  const start = Number(params?.start) || 22; // 10PM
  const end = Number(params?.end) || 6; // 6AM
  const hour = fv?.hour_of_day ?? new Date(tx?.txn_date_time).getHours();
  const fired = start <= hour || hour < end;
  return {
    fired,
    reasons: [
      fired
        ? `hour ${hour} is between ${start}:00-06:00 (wrap)`
        : `hour ${hour} is within normal hours`,
    ],
    facts: { hour, start, end },
  };
}

function evaluateLargeATM_correct(
  tx: Transaction,
  _fv: FeatureVector | undefined,
  params: RuleParamValues
) {
  const minAmount = Number(params?.minAmount) || 300;
  const fired =
    tx?.transaction_type?.toLowerCase() === "atm" && tx?.amount >= minAmount;
  return {
    fired,
    reasons: [
      fired
        ? `ATM withdrawal ≥ ${minAmount}`
        : `Not ATM or amount < ${minAmount}`,
    ],
    facts: { type: tx?.transaction_type, amount: tx?.amount, minAmount },
  };
}

export const RULE_TEMPLATES: RuleTemplate[] = [
  {
    rule_id: "RULE_001",
    title: "High Value Transaction Alert",
    params: [
      {
        key: "threshold",
        label: "Threshold Amount",
        type: "number",
        default: 100.0,
        help: "Fire if tx.amount > threshold",
      },
    ],
    evaluator: evaluateHighValue,
  },
  {
    rule_id: "RULE_002",
    title: "Multiple Small Txns (Short Period)",
    params: [
      {
        key: "maxAmount",
        label: "Max Amount (avg)",
        type: "number",
        default: 20,
      },
      {
        key: "minCount",
        label: "Min Count in Window",
        type: "number",
        default: 3,
        help: "Use feature_vectors.transaction_count",
      },
    ],
    evaluator: evaluateManySmalls,
  },
  {
    rule_id: "RULE_003",
    title: "Unusual Transaction Type for User",
    params: [
      {
        key: "usualTypes",
        label: "Usual Types",
        type: "multiselect",
        options: ["online", "contactless", "chip", "swipe", "atm"],
        default: ["online", "contactless"],
      },
    ],
    evaluator: evaluateUnusualType,
  },
  {
    rule_id: "RULE_004",
    title: "Transaction to High-Risk Merchant",
    params: [
      {
        key: "highRiskCountries",
        label: "High-Risk Countries",
        type: "multiselect",
        options: ["BRA", "MEX", "CRI", "PAN"],
        default: ["BRA", "MEX"],
      },
    ],
    evaluator: evaluateHighRiskMerchant,
  },
  {
    rule_id: "RULE_005",
    title: "Cross-Border Transaction Anomaly",
    params: [
      {
        key: "userHomeCountries",
        label: "User Home Countries",
        type: "multiselect",
        options: ["PAN", "BRA", "MEX", "CRI", "GTM"],
        default: ["PAN"],
      },
      { key: "minAmount", label: "Min Amount", type: "number", default: 100 },
    ],
    evaluator: evaluateCrossBorder,
  },
  {
    rule_id: "RULE_006",
    title: "Transaction Outside Normal Hours",
    params: [
      { key: "start", label: "Night Start Hour", type: "number", default: 22 },
      { key: "end", label: "Night End Hour", type: "number", default: 6 },
    ],
    evaluator: evaluateOffHours,
  },
  {
    rule_id: "RULE_007",
    title: "Large Cash Withdrawal",
    params: [
      {
        key: "minAmount",
        label: "Min ATM Amount",
        type: "number",
        default: 300,
      },
    ],
    evaluator: evaluateLargeATM_correct,
  },
];

// Map without `any`
export const RULE_TEMPLATES_MAP: Record<string, RuleTemplate> =
  RULE_TEMPLATES.reduce<Record<string, RuleTemplate>>((acc, t) => {
    acc[t.rule_id] = t;
    return acc;
  }, {});
