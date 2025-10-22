// import type { Transaction, FeatureVector, RuleMeta } from "./types";

// // helper: safely load JSON that may contain NaN, Infinity, etc.
// async function fetchSafeJSON(path: string) {
//   const res = await fetch(path);
//   const text = await res.text();
//   // Replace invalid JSON tokens (NaN, Infinity, -Infinity) with null
//   const safeText = text
//     .replace(/\bNaN\b/g, "null")
//     .replace(/\bInfinity\b/g, "null")
//     .replace(/\b-Infinity\b/g, "null");
//   return JSON.parse(safeText);
// }

// export async function loadData() {
//   const [txRaw, fvRaw, rules] = await Promise.all([
//     fetchSafeJSON("/transactions.json"),
//     fetchSafeJSON("/feature_vectors.json"),
//     fetchSafeJSON("/example_rules.json"),
//   ]);

//   // Normalize transactions (ensure types)
//   const transactions: Transaction[] = txRaw.map((t: any) => ({
//     ...t,
//     receiver_account_id: Number(t.receiver_account_id) || 0,
//     terminal_id: Number(t.terminal_id) || 0,
//     amount: Number(t.amount) || 0,
//   }));

//   const featureVectors: FeatureVector[] = fvRaw.map((f: any) => ({
//     ...f,
//     receiver_account_id: Number(f.receiver_account_id) || 0,
//     transaction_count: Number(f.transaction_count) || 0,
//     avg_transaction_amount: Number(f.avg_transaction_amount) || 0,
//     hour_of_day: Number(f.hour_of_day) || 0,
//     day_of_week: Number(f.day_of_week) || 0,
//     merchant_avg_transaction_amount:
//       Number(f.merchant_avg_transaction_amount) || 0,
//     amount: Number(f.amount) || 0,
//   }));

//   const rulesMeta: RuleMeta[] = rules;
//   return { transactions, featureVectors, rulesMeta };
// }

// export function indexBy<T extends Record<string, any>>(arr: T[], key: keyof T) {
//   const map = new Map<string, T>();
//   for (const item of arr) {
//     const k = String(item[key]);
//     map.set(k, item);
//   }
//   return map;
// }

import type {
  Transaction,
  FeatureVector,
  RuleMeta,
  RawTransaction,
  RawFeatureVector,
} from "./types";

// helper: safely load JSON that may contain NaN, Infinity, etc.
async function fetchSafeJSON<T>(path: string): Promise<T> {
  const res = await fetch(path);
  const text = await res?.text();
  // Replace invalid JSON tokens (NaN, Infinity, -Infinity) with null
  const safeText = text
    .replace(/\bNaN\b/g, "null")
    .replace(/\bInfinity\b/g, "null")
    .replace(/\b-Infinity\b/g, "null");
  return JSON.parse(safeText) as T;
}

export async function loadData() {
  const [txRaw, fvRaw, rules] = await Promise.all([
    fetchSafeJSON<RawTransaction[]>("/transactions.json"),
    fetchSafeJSON<RawFeatureVector[]>("/feature_vectors.json"),
    fetchSafeJSON<RuleMeta[]>("/example_rules.json"),
  ]);

  // Normalize transactions (ensure types)
  const transactions: Transaction[] = txRaw?.map((t) => ({
    ...t,
    receiver_account_id: Number(t.receiver_account_id) || 0,
    terminal_id: Number(t.terminal_id) || 0,
    amount: Number(t.amount) || 0,
  }));

  const featureVectors: FeatureVector[] = fvRaw?.map((f) => ({
    ...f,
    receiver_account_id: Number(f?.receiver_account_id) || 0,
    transaction_count: Number(f?.transaction_count) || 0,
    avg_transaction_amount: Number(f?.avg_transaction_amount) || 0,
    hour_of_day: Number(f?.hour_of_day) || 0,
    day_of_week: Number(f?.day_of_week) || 0,
    merchant_avg_transaction_amount:
      Number(f?.merchant_avg_transaction_amount) || 0,
    amount: Number(f?.amount) || 0,
  }));

  const rulesMeta: RuleMeta[] = rules;
  return { transactions, featureVectors, rulesMeta };
}

type Stringable = string | number | boolean | null | undefined;

export function indexBy<T>(arr: T[], key: keyof T) {
  const map = new Map<string, T>();
  for (const item of arr) {
    // Safely coerce the key to a string without using `any`/`unknown`
    const record = item as Record<string, Stringable>;
    const k = String(record[key as string]);
    map.set(k, item);
  }
  return map;
}
