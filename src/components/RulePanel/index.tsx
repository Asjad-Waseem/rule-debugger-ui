import { useMemo, useCallback } from "react";

import { useAppDispatch, useAppSelector } from "@src/store/hooks";
import { setParams, setFilters } from "@src/store/appSlice";

import ParamControl from "./ParamControl";

import type { RuleParamSpec } from "@src/lib/types";

const RulePanel = () => {
  const dispatch = useAppDispatch();

  const { rulesMeta, ruleTemplates, selectedRuleId, params } = useAppSelector(
    (s) => s?.app
  );

  // Memoize selected rule + metadata
  const meta = useMemo(
    () => rulesMeta?.find((r) => r?.rule_id === selectedRuleId),
    [rulesMeta, selectedRuleId]
  );
  const tpl = useMemo(
    () => ruleTemplates?.find((t) => t?.rule_id === selectedRuleId),
    [ruleTemplates, selectedRuleId]
  );

  const handleParamChange = useCallback(
    <T extends RuleParamSpec["type"]>(
      spec: Extract<RuleParamSpec, { type: T }>,
      value: RuleParamSpec["default"]
    ) => {
      let finalValue = value;

      //  Handle multiselect “All” logic only once here
      if (spec?.type === "multiselect" && Array?.isArray(value)) {
        const prevValues = (params?.[spec?.key] as string[]) ?? [];
        const newValues = value as string[];

        if (newValues?.includes("all") && !prevValues?.includes("all")) {
          finalValue = ["all"] as typeof value;
        } else if (prevValues?.includes("all") && newValues?.length > 1) {
          finalValue = newValues?.filter((v) => v !== "all") as typeof value;
        }
      }

      // Update rule params efficiently
      dispatch(setParams({ ...params, [spec.key]: finalValue }));

      // Automatically sync with DataTable filter for Rule 003
      if (tpl?.rule_id === "RULE_003" && spec?.key === "usualTypes") {
        const arr = (finalValue as string[]) ?? [];
        dispatch(setFilters({ type: arr?.length === 1 ? arr[0] : "all" }));
      }
    },
    [dispatch, params, tpl]
  );

  if (!meta || !tpl) {
    return (
      <section className="p-6">
        <h2 className="text-xl font-semibold">Select a rule to debug</h2>
        <p className="text-slate-600">
          Choose a rule on the left, then tweak parameters and evaluate across
          transactions.
        </p>
      </section>
    );
  }

  return (
    <section className="border-b px-6 py-4 bg-white">
      {/* Header */}
      <div className="flex items-start justify-between gap-6">
        <div className="grid gap-1">
          <h2 className="text-xl font-semibold">{meta?.name}</h2>
          <p className="text-sm text-slate-600">{meta?.description}</p>
          <div className="text-xs text-slate-500">
            <span className="mr-2">
              Action: <b>{meta?.action}</b>
            </span>
            <span>
              Severity: <b>{meta?.severity}</b>
            </span>
          </div>
        </div>
      </div>

      {/* Parameter Controls */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        {tpl?.params?.map((spec) => (
          <ParamControl
            key={spec?.key}
            spec={spec}
            value={params?.[spec.key]}
            onChange={(v) => handleParamChange(spec, v)}
          />
        ))}
      </div>
    </section>
  );
};

export default RulePanel;
