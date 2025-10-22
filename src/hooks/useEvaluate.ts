import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@src/store/hooks";
import { setEvaluated } from "@src/store/appSlice";

import { indexBy } from "@src/lib/utils";
import { RULE_TEMPLATES_MAP } from "@src/lib/ruleTemplates";

import type {
  FeatureVector,
  RuleParamValues,
  Transaction,
} from "@src/lib/types";

/**
 * Re-evaluates the currently selected rule across all transactions
 * whenever transactions / features / selectedRule / params change.
 */
export default function useEvaluate() {
  const dispatch = useAppDispatch();

  const transactions = useAppSelector(
    (s) => s?.app?.transactions
  ) as Transaction[];
  const featureVectors = useAppSelector(
    (s) => s?.app?.featureVectors
  ) as FeatureVector[];
  const selectedRuleId = useAppSelector((s) => s?.app?.selectedRuleId) as
    | string
    | null;
  const params = useAppSelector((s) => s?.app?.params) as RuleParamValues;

  useEffect(() => {
    // No rule selected → clear results
    if (!selectedRuleId) {
      dispatch(setEvaluated([]));
      return;
    }

    const tpl = RULE_TEMPLATES_MAP[selectedRuleId];
    if (!tpl) {
      dispatch(setEvaluated([]));
      return;
    }

    // Fast lookup of feature vector by transaction_id
    const fvById = indexBy<FeatureVector>(featureVectors, "transaction_id");

    const rows = transactions?.map((tx) => {
      const fv = fvById?.get(tx?.transaction_id);
      const result = tpl?.evaluator(tx, fv, params);
      return { tx, fv, result };
    });

    dispatch(setEvaluated(rows));
  }, [transactions, featureVectors, selectedRuleId, params, dispatch]);
}
