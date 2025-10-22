// Note: All constants/string values that are repeated more than once and all data constants are extracted out and added in this file. Please note we can move this file from this specific component level to a global level or one level up if this is being reused across multiple other places.
export const FIRED = "FIRED";
export const NO_FIRE = "NO FIRE";
export const COUNTRY_OPTIONS = ["PAN", "BRA", "MEX", "CRI", "GTM"];
export const DATA_TABLE_HEADERS = [
  "Result",
  "Txn ID",
  "When",
  "Type",
  "Amount",
  "Currency",
  "Country",
];
export const FILTER_TYPES = ["online", "contactless", "chip", "swipe", "atm"];
export const PAGINATION_OPTIONS = [25, 50, 75, 100];
