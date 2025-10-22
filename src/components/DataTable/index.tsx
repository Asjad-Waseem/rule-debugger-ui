import { useMemo, useState } from "react";

import { useAppSelector, useAppDispatch } from "@src/store/hooks";
import { setFilters, setPage, setPageSize } from "@src/store/appSlice";

import Badge from "./Badge";

import {
  COUNTRY_OPTIONS,
  DATA_TABLE_HEADERS,
  FILTER_TYPES,
  FIRED,
  NO_FIRE,
  PAGINATION_OPTIONS,
} from "./constants";

const DataTable = () => {
  const dispatch = useAppDispatch();
  const evaluated = useAppSelector((s) => s?.app?.evaluated);
  const filters = useAppSelector((s) => s?.app?.filters);
  const page = useAppSelector((s) => s?.app?.page);
  const pageSize = useAppSelector((s) => s?.app?.pageSize);

  const [selected, setSelected] = useState<null | (typeof evaluated)[number]>(
    null
  );

  // 1) Filter across the WHOLE dataset (search + filters)
  const filteredRows = useMemo(() => {
    return evaluated?.filter((r) => {
      if (filters?.firedOnly && !r?.result?.fired) return false;

      const s = filters?.search?.trim()?.toLowerCase();
      if (s) {
        const inText =
          r?.tx?.transaction_id?.toLowerCase()?.includes(s) ||
          r?.tx?.sender_account_id?.toLowerCase()?.includes(s) ||
          r?.tx.merchant_country?.toLowerCase()?.includes(s);
        if (!inText) return false;
      }

      if (filters?.type && filters.type !== "all") {
        if (
          r?.tx?.transaction_type?.toLowerCase() !== filters.type.toLowerCase()
        )
          return false;
      }

      if (
        filters?.country &&
        r?.tx?.merchant_country?.toLowerCase() !==
          filters?.country?.toLowerCase()
      )
        return false;

      return true;
    });
  }, [evaluated, filters]);

  // 2) Slice for the current page
  const total = filteredRows?.length;
  const totalPages = Math?.max(1, Math?.ceil(total / pageSize));
  const safePage = Math?.min(Math?.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const end = start + pageSize;
  const visibleRows = filteredRows?.slice(start, end);

  const goto = (p: number) =>
    dispatch(setPage(Math?.min(Math?.max(1, p), totalPages)));
  const ALL_PLUS_TYPES = ["all", ...FILTER_TYPES];

  return (
    <section className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-0 mb-5 pb-0">
      <div className="md:col-span-2 border-r bg-white flex flex-col min-h-0">
        <div className="p-3 flex items-center gap-2 border-b">
          <input
            placeholder="Search txn ID, sender, or country"
            className="input flex-1"
            value={filters?.search}
            onChange={(e) => dispatch(setFilters({ search: e?.target?.value }))}
          />
          <select
            className="input w-40"
            value={filters?.type}
            onChange={(e) => dispatch(setFilters({ type: e.target.value }))} // ← keep it simple
          >
            <option value="all">All Types</option>
            {FILTER_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <select
            className="input w-36"
            value={filters?.country ?? ""}
            onChange={(e) =>
              dispatch(setFilters({ country: e?.target?.value || undefined }))
            }
          >
            <option value="">All Countries</option>
            {COUNTRY_OPTIONS?.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          <label className="text-sm flex items-center gap-2 px-2">
            <input
              type="checkbox"
              checked={filters?.firedOnly}
              onChange={(e) =>
                dispatch(setFilters({ firedOnly: e?.target?.checked }))
              }
            />
            Fired only
          </label>
        </div>
        <div
          className="flex-1 overflow-auto"
          style={{ maxHeight: "calc(95vh - 290px)" }}
        >
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-slate-50 z-10 border-b">
              <tr className="text-left text-slate-600">
                {DATA_TABLE_HEADERS?.map((tableHeader) => (
                  <th key={tableHeader} className="px-3 py-2">
                    {tableHeader}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleRows?.map((r) => (
                <tr
                  key={r?.tx?.transaction_id}
                  className={`border-b hover:bg-slate-50 cursor-pointer ${
                    selected?.tx?.transaction_id === r?.tx?.transaction_id
                      ? "bg-indigo-50"
                      : ""
                  }`}
                  onClick={() => setSelected(r)}
                >
                  <td className="px-3 py-2">
                    <Badge fired={r?.result?.fired} />
                  </td>
                  <td className="px-3 py-2 font-mono">
                    {r?.tx?.transaction_id}
                  </td>
                  <td className="px-3 py-2">{r?.tx?.txn_date_time}</td>
                  <td className="px-3 py-2">{r?.tx?.transaction_type}</td>
                  <td className="px-3 py-2">{r?.tx?.amount?.toFixed(2)}</td>
                  <td className="px-3 py-2">{r?.tx?.currency}</td>
                  <td className="px-3 py-2">{r?.tx?.merchant_country}</td>
                </tr>
              ))}
              {visibleRows?.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-3 py-6 text-center text-slate-500"
                  >
                    No results
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination bar */}
        <div className="sticky bottom-0 z-10 flex items-center justify-between gap-3 p-3 border-t bg-white">
          <div className="text-sm text-slate-600">
            Showing <b>{total === 0 ? 0 : start + 1}</b>–
            <b>{Math?.min(end, total)}</b> of <b>{total}</b>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-600">Rows per page</label>
            <select
              className="input"
              value={pageSize}
              onChange={(e) => dispatch(setPageSize(Number(e?.target?.value)))}
            >
              {PAGINATION_OPTIONS?.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="input px-3 py-1"
              onClick={() => goto(safePage - 1)}
              disabled={safePage <= 1}
            >
              Prev
            </button>
            <span className="text-sm text-slate-600">
              Page <b>{safePage}</b> / <b>{totalPages}</b>
            </span>
            <button
              className="input px-3 py-1"
              onClick={() => goto(safePage + 1)}
              disabled={safePage >= totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      {/* Inspector */}
      <div className="bg-white">
        <div className="p-3 border-b">
          <h3 className="font-semibold">Inspector</h3>
          <p className="text-xs text-slate-600">
            Click a row to see evaluation details.
          </p>
        </div>
        <div
          className="p-3 space-y-3 overflow-auto"
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          {!selected && (
            <p className="text-sm text-slate-600">Nothing selected.</p>
          )}
          {selected && (
            <>
              <section className="space-y-1">
                <h4 className="font-medium text-sm">Transaction</h4>
                <pre className="p-2 bg-slate-50 rounded text-xs overflow-auto">
                  {JSON.stringify(selected?.tx, null, 2)}
                </pre>
              </section>
              {selected?.fv && (
                <section className="space-y-1">
                  <h4 className="font-medium text-sm">Feature Vector</h4>
                  <pre className="p-2 bg-slate-50 rounded text-xs overflow-auto">
                    {JSON?.stringify(selected?.fv, null, 2)}
                  </pre>
                </section>
              )}
              <section className="space-y-1">
                <h4 className="font-medium text-sm">Evaluation</h4>
                <div className="text-sm">
                  <span
                    className={`px-2 py-0.5 rounded ${
                      selected?.result?.fired
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {selected?.result?.fired ? FIRED : NO_FIRE}
                  </span>
                </div>
                <ul className="list-disc pl-6 text-xs">
                  {selected?.result?.reasons?.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
                <details className="text-xs">
                  <summary className="cursor-pointer">Facts</summary>
                  <pre className="p-2 bg-slate-50 rounded overflow-auto">
                    {JSON?.stringify(selected?.result?.facts, null, 2)}
                  </pre>
                </details>
              </section>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default DataTable;
