import { clsx } from "clsx";

import { useAppDispatch, useAppSelector } from "@src/store/hooks";
import { selectRule } from "@src/store/appSlice";

const Sidebar = () => {
  const rulesMeta = useAppSelector((s) => s?.app?.rulesMeta);
  const selected = useAppSelector((s) => s?.app?.selectedRuleId);
  const dispatch = useAppDispatch();

  return (
    <aside className="w-80 shrink-0 border-r border-slate-200 bg-white overflow-y-auto">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Rules</h2>
        <p className="text-xs text-slate-500">Click to inspect & evaluate</p>
      </div>
      <ul>
        {rulesMeta?.map((r) => (
          <li key={r?.rule_id}>
            <button
              onClick={() => dispatch(selectRule(r?.rule_id))}
              className={clsx(
                "w-full text-left p-3 hover:bg-slate-50 transition",
                selected === r?.rule_id &&
                  "bg-slate-100 border-l-4 border-indigo-500"
              )}
              aria-current={selected === r?.rule_id}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{r?.name}</span>
                <span
                  className={clsx(
                    "text-xs rounded-full px-2 py-0.5",
                    r?.severity === "Critical" && "bg-red-100 text-red-700",
                    r?.severity === "High" && "bg-orange-100 text-orange-700",
                    r?.severity === "Medium" && "bg-amber-100 text-amber-700",
                    r?.severity === "Low" && "bg-emerald-100 text-emerald-700"
                  )}
                >
                  {r?.severity}
                </span>
              </div>
              <p className="text-xs mt-1 text-slate-600">{r?.description}</p>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
