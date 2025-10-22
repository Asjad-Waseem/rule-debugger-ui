import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { Transaction, FeatureVector, RuleMeta } from "@src/lib/types";
import { Filters, RuleTemplateMeta } from "./types";

type AppState = {
  transactions: Transaction[];
  featureVectors: FeatureVector[];
  rulesMeta: RuleMeta[];
  ruleTemplates: RuleTemplateMeta[];
  selectedRuleId?: string;
  params: Record<string, any>;
  evaluated: {
    tx: Transaction;
    fv?: FeatureVector;
    result: {
      fired: boolean;
      reasons: string[];
      facts: Record<string, any>;
      score?: number;
    };
  }[];
  filters: Filters;
  page: number;
  pageSize: number;
};

const initialState: AppState = {
  transactions: [],
  featureVectors: [],
  rulesMeta: [],
  ruleTemplates: [],
  selectedRuleId: undefined,
  params: {},
  evaluated: [],
  filters: {
    search: "",
    type: "all", // default to "all"
    country: "",
    firedOnly: false,
  },
  page: 1,
  pageSize: 25,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setData(
      state,
      action: PayloadAction<
        Partial<Pick<AppState, "transactions" | "featureVectors" | "rulesMeta">>
      >
    ) {
      Object.assign(state, action?.payload);
      // data changes -> show first page
      state.page = 1;
    },
    setRuleTemplates(state, action: PayloadAction<RuleTemplateMeta[]>) {
      state.ruleTemplates = action?.payload;
      state.page = 1;
    },
    selectRule(state, action: PayloadAction<string | undefined>) {
      state.selectedRuleId = action?.payload;
      state.page = 1;
    },
    setParams(state, action: PayloadAction<Record<string, any>>) {
      state.params = action?.payload;
      state.page = 1;
    },
    setFilters(state, action: PayloadAction<Partial<Filters>>) {
      state.filters = { ...state.filters, ...action?.payload };
      state.page = 1;
    },
    setEvaluated(state, action: PayloadAction<AppState["evaluated"]>) {
      state.evaluated = action?.payload;
      state.page = 1;
    },
    // NEW: pagination controls
    setPage(state, action: PayloadAction<number>) {
      state.page = Math.max(1, action?.payload);
    },
    setPageSize(state, action: PayloadAction<number>) {
      state.pageSize = action?.payload;
      state.page = 1; // reset to start when size changes
    },
  },
});

export const {
  setData,
  setRuleTemplates,
  selectRule,
  setParams,
  setFilters,
  setEvaluated,
  setPage,
  setPageSize,
} = appSlice.actions;

export default appSlice.reducer;
