// src/hooks/useEvaluate.ts
import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@src/store/hooks";
import { setEvaluated } from "@src/store/appSlice";
import { indexBy } from "@src/lib/utils";
import { RULE_TEMPLATES_MAP } from "@src/lib/ruleTemplates";

const useEvaluate = () => {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector((s) => s?.app?.transactions);
  const featureVectors = useAppSelector((s) => s?.app?.featureVectors);
  const selectedRuleId = useAppSelector((s) => s?.app?.selectedRuleId);
  const params = useAppSelector((s) => s?.app?.params);

  useEffect(() => {
    if (!selectedRuleId) {
      dispatch(setEvaluated([]));
      return;
    }

    const tpl = RULE_TEMPLATES_MAP[selectedRuleId];
    if (!tpl) {
      dispatch(setEvaluated([]));
      return;
    }

    const fvById = indexBy(featureVectors, "transaction_id");
    const rows = transactions?.map((tx) => {
      const fv = fvById?.get(tx?.transaction_id);
      const result = tpl?.evaluator(tx, fv, params);
      return { tx, fv, result };
    });

    dispatch(setEvaluated(rows));
  }, [transactions, featureVectors, selectedRuleId, params, dispatch]);
};

export default useEvaluate;
