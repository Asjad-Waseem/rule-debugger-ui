// import { useAppDispatch, useAppSelector } from "@src/store/hooks";
// import { setParams } from "@src/store/appSlice";

// import ParamControl from "./ParamControl";

// import type { RuleTemplateMeta, RuleParamSpec } from "@src/lib/types";

// const RulePanel = () => {
//   const rulesMeta = useAppSelector((s) => s.app.rulesMeta);
//   const templates = useAppSelector((s) => s.app.ruleTemplates);
//   const selectedId = useAppSelector((s) => s.app.selectedRuleId);
//   const params = useAppSelector((s) => s.app.params);
//   const dispatch = useAppDispatch();

//   const meta = rulesMeta?.find((r) => r.rule_id === selectedId);
//   const tpl: RuleTemplateMeta | undefined = templates.find(
//     (t) => t.rule_id === selectedId
//   );

//   if (!meta || !tpl) {
//     return (
//       <section className="p-6">
//         <h2 className="text-xl font-semibold">Select a rule to debug</h2>
//         <p className="text-slate-600">
//           Choose a rule on the left, then tweak parameters and evaluate across
//           transactions.
//         </p>
//       </section>
//     );
//   }

//   return (
//     <section className="border-b px-6 py-4 bg-white">
//       <div className="flex items-start justify-between gap-6">
//         <div className="grid gap-1">
//           <h2 className="text-xl font-semibold">{meta?.name}</h2>
//           <p className="text-sm text-slate-600">{meta?.description}</p>
//           <div className="text-xs text-slate-500">
//             <span className="mr-2">
//               Action: <b>{meta?.action}</b>
//             </span>
//             <span>
//               Severity: <b>{meta?.severity}</b>
//             </span>
//           </div>
//         </div>
//       </div>

//       <div className="mt-4 grid md:grid-cols-3 gap-4">
//         {tpl?.params?.map((spec: RuleParamSpec) => (
//           <ParamControl
//             key={spec?.key}
//             spec={spec}
//             value={params?.[spec?.key]}
//             onChange={(v) => dispatch(setParams({ ...params, [spec?.key]: v }))}
//           />
//         ))}
//       </div>
//     </section>
//   );
// };

// export default RulePanel;

import { useAppDispatch, useAppSelector } from "@src/store/hooks";
import { setParams } from "@src/store/appSlice";

import ParamControl from "./ParamControl";

import type { RuleTemplateMeta, RuleParamSpec } from "@src/lib/types";

const RulePanel = () => {
  const rulesMeta = useAppSelector((s) => s.app.rulesMeta);
  const templates = useAppSelector((s) => s.app.ruleTemplates);
  const selectedId = useAppSelector((s) => s.app.selectedRuleId);
  const params = useAppSelector((s) => s.app.params);
  const dispatch = useAppDispatch();

  const meta = rulesMeta?.find((r) => r.rule_id === selectedId);
  const tpl: RuleTemplateMeta | undefined = templates.find(
    (t) => t.rule_id === selectedId
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

      <div className="mt-4 grid md:grid-cols-3 gap-4">
        {tpl?.params?.map((spec: RuleParamSpec) => (
          <ParamControl
            key={spec?.key}
            spec={spec}
            value={params?.[spec?.key]}
            onChange={(v) => dispatch(setParams({ ...params, [spec?.key]: v }))}
          />
        ))}
      </div>
    </section>
  );
};

export default RulePanel;
