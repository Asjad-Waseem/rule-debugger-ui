// import { useMemo } from "react";

// import type { RuleParamSpec } from "@src/lib/types";
// import { ParamControlProps } from "./types";

// const ParamControl = <T extends RuleParamSpec>({
//   spec,
//   value,
//   onChange,
// }: ParamControlProps<T>) => {
//   switch (spec?.type) {
//     case "number":
//       return (
//         <label className="text-sm grid gap-1">
//           <span className="text-slate-600">{spec?.label}</span>
//           <input
//             type="number"
//             className="input"
//             value={value ?? spec?.default ?? ""}
//             onChange={(e) => onChange(Number(e?.target?.value) as T["default"])}
//           />
//           {spec?.help && (
//             <span className="text-xs text-slate-500">{spec?.help}</span>
//           )}
//         </label>
//       );
//     case "string":
//       return (
//         <label className="text-sm grid gap-1">
//           <span className="text-slate-600">{spec?.label}</span>
//           <input
//             type="text"
//             className="input"
//             value={(value ?? spec?.default ?? "") as string}
//             onChange={(e) => onChange(e?.target?.value as T["default"])}
//           />
//           {spec?.help && (
//             <span className="text-xs text-slate-500">{spec?.help}</span>
//           )}
//         </label>
//       );
//     case "boolean":
//       return (
//         <label className="text-sm flex items-center gap-2">
//           <input
//             type="checkbox"
//             checked={Boolean(value ?? spec?.default)}
//             onChange={(e) => onChange(e?.target?.checked as T["default"])}
//           />
//           <span className="text-slate-600">{spec?.label}</span>
//         </label>
//       );
//     case "select": {
//       const options = spec?.options ?? [];
//       return (
//         <label className="text-sm grid gap-1">
//           <span className="text-slate-600">{spec?.label}</span>
//           <select
//             className="input"
//             value={(value ?? spec?.default ?? "") as string}
//             onChange={(e) => onChange(e?.target?.value as T["default"])}
//           >
//             {options?.map((opt) => (
//               <option key={opt} value={opt}>
//                 {opt}
//               </option>
//             ))}
//           </select>
//           {spec?.help && (
//             <span className="text-xs text-slate-500">{spec?.help}</span>
//           )}
//         </label>
//       );
//     }
//     case "multiselect": {
//       const options = spec?.options ?? [];
//       const current = useMemo(
//         () => new Set<string>((value as string[]) ?? spec?.default ?? []),
//         [value, spec?.default]
//       );
//       return (
//         <label className="text-sm grid gap-1">
//           <span className="text-slate-600">{spec?.label}</span>
//           <div className="flex flex-wrap gap-2">
//             {options?.map((o) => {
//               const active = current?.has(o);
//               return (
//                 <button
//                   key={o}
//                   type="button"
//                   onClick={() => {
//                     const next = new Set(current);
//                     active ? next.delete(o) : next.add(o);
//                     onChange(Array.from(next) as T["default"]);
//                   }}
//                   className={`px-2 py-1 rounded border text-xs ${
//                     active
//                       ? "bg-indigo-600 text-white border-indigo-600"
//                       : "bg-white text-slate-700 border-slate-300"
//                   }`}
//                 >
//                   {o}
//                 </button>
//               );
//             })}
//           </div>
//           {spec?.help && (
//             <span className="text-xs text-slate-500">{spec?.help}</span>
//           )}
//         </label>
//       );
//     }
//     default:
//       return null;
//   }
// };

// export default ParamControl;

// import type { RuleParamSpec } from "@src/lib/types";
// import { ParamControlProps } from "./types";

// // Helpers to normalize input values by control type
// const toNumberInput = (v: unknown): number | "" => {
//   if (typeof v === "number") return v;
//   if (v === null || v === undefined || v === "") return "";
//   const n = Number(v);
//   return Number.isFinite(n) ? n : "";
// };

// const toStringInput = (v: unknown): string => {
//   if (v === null || v === undefined) return "";
//   return String(v);
// };

// const ParamControl = <T extends RuleParamSpec>({
//   spec,
//   value,
//   onChange,
// }: ParamControlProps<T>) => {
//   switch (spec?.type) {
//     case "number": {
//       const normalized = toNumberInput(value ?? spec?.default);
//       return (
//         <label className="text-sm grid gap-1">
//           <span className="text-slate-600">{spec?.label}</span>
//           <input
//             type="number"
//             className="input"
//             value={normalized}
//             onChange={(e) => onChange(Number(e.target.value) as T["default"])}
//           />
//           {spec?.help && (
//             <span className="text-xs text-slate-500">{spec?.help}</span>
//           )}
//         </label>
//       );
//     }

//     case "string": {
//       const normalized = toStringInput(value ?? spec?.default);
//       return (
//         <label className="text-sm grid gap-1">
//           <span className="text-slate-600">{spec?.label}</span>
//           <input
//             type="text"
//             className="input"
//             value={normalized}
//             onChange={(e) => onChange(e.target.value as T["default"])}
//           />
//           {spec?.help && (
//             <span className="text-xs text-slate-500">{spec?.help}</span>
//           )}
//         </label>
//       );
//     }

//     case "boolean": {
//       const checked = Boolean(value ?? spec?.default);
//       return (
//         <label className="text-sm flex items-center gap-2">
//           <input
//             type="checkbox"
//             checked={checked}
//             onChange={(e) => onChange(e.target.checked as T["default"])}
//           />
//           <span className="text-slate-600">{spec?.label}</span>
//         </label>
//       );
//     }

//     case "select": {
//       const options = spec?.options ?? [];
//       const normalized = toStringInput(value ?? spec?.default);
//       return (
//         <label className="text-sm grid gap-1">
//           <span className="text-slate-600">{spec?.label}</span>
//           <select
//             className="input"
//             value={normalized}
//             onChange={(e) => onChange(e.target.value as T["default"])}
//           >
//             {options.map((opt) => (
//               <option key={opt} value={opt}>
//                 {opt}
//               </option>
//             ))}
//           </select>
//           {spec?.help && (
//             <span className="text-xs text-slate-500">{spec?.help}</span>
//           )}
//         </label>
//       );
//     }

//     case "multiselect": {
//       const options = spec?.options ?? [];
//       const currentArray =
//         Array.isArray(value) && value.length > 0
//           ? (value as string[])
//           : Array.isArray(spec?.default)
//           ? (spec.default as string[])
//           : [];
//       const current = new Set<string>(currentArray);

//       return (
//         <label className="text-sm grid gap-1">
//           <span className="text-slate-600">{spec?.label}</span>
//           <div className="flex flex-wrap gap-2">
//             {options.map((o) => {
//               const active = current.has(o);
//               return (
//                 <button
//                   key={o}
//                   type="button"
//                   onClick={() => {
//                     const next = new Set(current);
//                     active ? next.delete(o) : next.add(o);
//                     onChange(Array.from(next) as T["default"]);
//                   }}
//                   className={`px-2 py-1 rounded border text-xs ${
//                     active
//                       ? "bg-indigo-600 text-white border-indigo-600"
//                       : "bg-white text-slate-700 border-slate-300"
//                   }`}
//                 >
//                   {o}
//                 </button>
//               );
//             })}
//           </div>
//           {spec?.help && (
//             <span className="text-xs text-slate-500">{spec?.help}</span>
//           )}
//         </label>
//       );
//     }

//     default:
//       return null;
//   }
// };

// export default ParamControl;

import { toNumberInput, toStringInput } from "./utils";

import type { RuleParamSpec } from "@src/lib/types";
import { ParamControlProps } from "./types";

const ParamControl = <T extends RuleParamSpec>({
  spec,
  value,
  onChange,
}: ParamControlProps<T>) => {
  switch (spec?.type) {
    case "number": {
      const normalized = toNumberInput(value ?? spec?.default);
      return (
        <label className="text-sm grid gap-1">
          <span className="text-slate-600">{spec?.label}</span>
          <input
            type="number"
            className="input"
            value={normalized}
            onChange={(e) => onChange(Number(e?.target?.value) as T["default"])}
          />
          {spec?.help && (
            <span className="text-xs text-slate-500">{spec.help}</span>
          )}
        </label>
      );
    }
    case "string": {
      const normalized = toStringInput(value ?? spec?.default);
      return (
        <label className="text-sm grid gap-1">
          <span className="text-slate-600">{spec?.label}</span>
          <input
            type="text"
            className="input"
            value={normalized}
            onChange={(e) => onChange(e?.target?.value as T["default"])}
          />
          {spec?.help && (
            <span className="text-xs text-slate-500">{spec.help}</span>
          )}
        </label>
      );
    }
    case "boolean": {
      const checked = Boolean(value ?? spec?.default);
      return (
        <label className="text-sm flex items-center gap-2">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e?.target?.checked as T["default"])}
          />
          <span className="text-slate-600">{spec?.label}</span>
        </label>
      );
    }
    case "select": {
      const options = spec?.options ?? [];
      const normalized = toStringInput(value ?? spec?.default);
      return (
        <label className="text-sm grid gap-1">
          <span className="text-slate-600">{spec?.label}</span>
          <select
            className="input"
            value={normalized}
            onChange={(e) => onChange(e?.target?.value as T["default"])}
          >
            {options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {spec?.help && (
            <span className="text-xs text-slate-500">{spec.help}</span>
          )}
        </label>
      );
    }
    case "multiselect": {
      const options = spec?.options ?? [];
      const currentArray =
        Array.isArray(value) && value?.length > 0
          ? (value as string[])
          : Array.isArray(spec?.default)
          ? (spec?.default as string[])
          : [];
      const current = new Set<string>(currentArray);
      return (
        <label className="text-sm grid gap-1">
          <span className="text-slate-600">{spec?.label}</span>
          <div className="flex flex-wrap gap-2">
            {options?.map((option) => {
              const active = current?.has(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    const next = new Set(current);
                    active ? next.delete(option) : next.add(option);
                    onChange(Array.from(next) as T["default"]);
                  }}
                  className={`px-2 py-1 rounded border text-xs ${
                    active
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-slate-700 border-slate-300"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
          {spec?.help && (
            <span className="text-xs text-slate-500">{spec.help}</span>
          )}
        </label>
      );
    }
    default:
      return null;
  }
};

export default ParamControl;
