import { useEffect, useMemo, useState } from "react";

import type { RuleParamSpec } from "@src/lib/types";
import type { ParamControlProps } from "./types";

/**
 * Typed, reusable control for a single rule param.
 * Debounces number inputs so we don't dispatch on every keystroke.
 */
const ParamControl = <T extends RuleParamSpec>({
  spec,
  value,
  onChange,
}: ParamControlProps<T>) => {
  switch (spec?.type) {
    case "number": {
      // local input buffer so typing is instant; parent only updates after debounce/blur
      const [local, setLocal] = useState<string>(() =>
        String(value ?? spec?.default ?? "")
      );

      // keep local in sync if parent value changes externally (e.g., rule switch)
      useEffect(() => {
        setLocal(String(value ?? spec?.default ?? ""));
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [value, spec.default]);

      // debounce commits while typing
      useEffect(() => {
        const id = setTimeout(() => {
          const n = Number(local);
          if (!Number?.isNaN(n)) {
            onChange(n as T["default"]);
          }
        }, 250);
        return () => clearTimeout(id);
      }, [local, onChange]);

      return (
        <label className="text-sm grid gap-1">
          <span className="text-slate-600">{spec?.label}</span>
          <input
            type="number"
            className="input"
            value={local}
            onChange={(e) => setLocal(e?.target?.value)}
            onBlur={() => {
              const n = Number(local);
              if (!Number?.isNaN(n)) onChange(n as T["default"]);
            }}
          />
          <span className="text-xs text-slate-500 min-h-4 block">
            {spec?.help ?? "\u00A0"}
          </span>
        </label>
      );
    }

    case "string":
      return (
        <label className="text-sm grid gap-1">
          <span className="text-slate-600">{spec?.label}</span>
          <input
            type="text"
            className="input"
            value={(value ?? spec?.default ?? "") as string}
            onChange={(e) => onChange(e?.target?.value as T["default"])}
          />
          <span className="text-xs text-slate-500 min-h-4 block">
            {spec?.help ?? "\u00A0"}
          </span>
        </label>
      );

    case "boolean":
      return (
        <label className="text-sm flex items-center gap-2">
          <input
            type="checkbox"
            checked={Boolean(value ?? spec?.default)}
            onChange={(e) => onChange(e?.target?.checked as T["default"])}
          />
          <span className="text-slate-600">{spec?.label}</span>
        </label>
      );

    case "select": {
      const options = spec?.options ?? [];
      return (
        <label className="text-sm grid gap-1">
          <span className="text-slate-600">{spec?.label}</span>
          <select
            className="input"
            value={(value ?? spec?.default ?? "") as string}
            onChange={(e) => onChange(e?.target?.value as T["default"])}
          >
            {options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <span className="text-xs text-slate-500 min-h-4 block">
            {/* "\u00A0" is non-breaking space ( ) */}
            {spec?.help ?? "\u00A0"}
          </span>
        </label>
      );
    }

    case "multiselect": {
      const options = spec?.options ?? [];
      const current = useMemo(
        () =>
          new Set<string>(
            (value as string[] | undefined) ??
              (spec?.default as string[] | undefined) ??
              []
          ),
        [value, spec?.default]
      );

      return (
        <label className="text-sm grid gap-1">
          <span className="text-slate-600">{spec?.label}</span>
          <div className="flex flex-wrap gap-2">
            {options?.map((option) => {
              const active = current.has(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    const next = new Set(current);

                    if (option === "all") {
                      // Selecting "all" clears everything else
                      onChange(["all"] as T["default"]);
                      return;
                    }

                    if (next.has("all")) next.delete("all"); // Deselect all when something else is chosen
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
          <span className="text-xs text-slate-500 min-h-4 block">
            {spec?.help ?? "\u00A0"}
          </span>
        </label>
      );
    }

    default:
      return null;
  }
};

export default ParamControl;
