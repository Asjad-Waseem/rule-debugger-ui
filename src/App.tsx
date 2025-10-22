// import "./styles/app.css";

// import { useEffect } from "react";

// import { useAppDispatch, useAppSelector } from "./store/hooks";
// import { setData, setRuleTemplates, setEvaluated } from "./store/appSlice";
// import { loadData, indexBy } from "./lib/utils";
// import { RULE_TEMPLATES, RULE_TEMPLATES_MAP } from "./lib/ruleTemplates";

// import { DataTable, RulePanel, Sidebar } from "./components";

// function useEvaluate() {
//   const dispatch = useAppDispatch();
//   const transactions = useAppSelector((s) => s.app.transactions);
//   const featureVectors = useAppSelector((s) => s.app.featureVectors);
//   const selectedRuleId = useAppSelector((s) => s.app.selectedRuleId);
//   const params = useAppSelector((s) => s.app.params);

//   useEffect(() => {
//     if (!selectedRuleId) {
//       dispatch(setEvaluated([]));
//       return;
//     }

//     const tpl = RULE_TEMPLATES_MAP[selectedRuleId];
//     if (!tpl) {
//       dispatch(setEvaluated([]));
//       return;
//     }

//     const fvById = indexBy(featureVectors, "transaction_id");
//     const rows = transactions.map((tx) => {
//       const fv = fvById.get(tx.transaction_id);
//       const result = tpl.evaluator(tx, fv, params);
//       return { tx, fv, result };
//     });
//     dispatch(setEvaluated(rows));
//   }, [transactions, featureVectors, selectedRuleId, params, dispatch]);
// }

// export default function App() {
//   const dispatch = useAppDispatch();

//   useEffect(() => {
//     (async () => {
//       try {
//         const { transactions, featureVectors, rulesMeta } = await loadData();
//         dispatch(setData({ transactions, featureVectors, rulesMeta }));
//         // store only serializable metadata, not functions
//         dispatch(
//           setRuleTemplates(RULE_TEMPLATES.map(({ evaluator, ...meta }) => meta))
//         );
//       } catch (err) {
//         console.error("Failed to load JSON data:", err);
//       }
//     })();
//   }, [dispatch]);

//   useEvaluate();

//   return (
//     <main className="min-h-screen grid grid-cols-[20rem_1fr]">
//       <Sidebar />
//       <section className="flex flex-col">
//         <RulePanel />
//         <DataTable />
//       </section>
//     </main>
//   );
// }

import "./styles/app.css";

import { useEffect } from "react";

import useEvaluate from "@src/hooks/useEvaluate";
import { useAppDispatch } from "./store/hooks";
import { setData, setRuleTemplates } from "./store/appSlice";
import { loadData } from "./lib/utils";
import { RULE_TEMPLATES } from "./lib/ruleTemplates";

import { RuleDebuggerPage } from "./pages";
import { Sidebar } from "./components";

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      try {
        const { transactions, featureVectors, rulesMeta } = await loadData();
        dispatch(setData({ transactions, featureVectors, rulesMeta }));
        // store only serializable metadata, not functions
        dispatch(
          setRuleTemplates(RULE_TEMPLATES.map(({ evaluator, ...meta }) => meta))
        );
      } catch (err) {
        console.error("Failed to load JSON data:", err);
      }
    })();
  }, [dispatch]);

  useEvaluate();

  return (
    <main className="min-h-screen grid grid-cols-[20rem_1fr]">
      <Sidebar />
      <RuleDebuggerPage />
    </main>
  );
};

export default App;
