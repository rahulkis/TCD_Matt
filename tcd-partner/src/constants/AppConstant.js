//local url v1
// export const API_BASE_URL = "http://localhost:3111/api/";

//live url v1
// export const API_BASE_URL = "https://admin.thecannabisdiary.net/api/";

//local url v2
export const API_BASE_URL = "http://localhost:4000/api/";

export const AUTH = {
  LOGIN: "partner-login",
  SIGNUP: "partner-signup",
  LOGOUT: "partner-logout/{token}",
  FORGOT_PASSWORD: "partner-forgot-password",
  RESET_PASSWORD: "partner-reset-password",
};

export const HOME = {
  GET_COUNTS: "home-data/{userId}",
  GET_HOME_GRAPH_DATA: "home-graph/entries",
};

export const ENTRIES = {
  GET_ENTRIES: "get-entries",
  GET_ENTRIES_FILTER: "get-entries-filter",
  GET_ENTRIES_INFO: "get-entries-info/{entryId}/{userId}",
};

export const PRODUCTS = {
  GET_PRODUCTS: "get-products",
  GET_PRODUCT_TYPES: "get-product-types",
  GET_PRODUCT_FILTER: "get-product-filter",
  GET_PRODUCTS_INFO: "get-products-info",
};

export const CONSUMERS = {
  GET_PROFILES_MAIN: "get-profiles-main",
  GET_PROFILES_DEMOGRAPH: "get-profiles-demographics",
  GET_PROFILES_PURPOSE: "get-profiles-purpose",
  GET_OBJECTIVES_MAIN: "get-objectives-main",
  GET_OBJECTIVES_ENTRIES: "get-objectives-entries",
  GET_OBJECTIVES_TOP5: "get-objectives-top5",
  GET_OBJECTIVES_REASON: "get-objectives-reason",
  GET_CATEGORIES: "get-categories",
  GET_RATINGANDREVIEWS_MAIN: "get-ratingandreviews-main",
  GET_RATING_AND_REVIEWS_COMMENTS: "get-ratingandreviews-comments",
  GET_ENTRY_INFO: "get-partner-entry-details",
};

export const MARKETINSIGHT = {
  GET_TOP_PRODUCTS: "get-top-products",
  GET_TOP_CATEGORIES: "get-top-categories",
  GET_TOP_ACTIVITIES: "get-top-activities",
  GET_TOP_CONDITIONS: "get-top-conditions",
  GET_TOP_EFFECTS: "get-top-effects",
  GET_TOP_SYMPTOMS: "get-top-symptoms",
  GET_TOP_BRANDS: "get-top-brands",
  GET_CONSUMERS: "get-consumers",
  GET_STATES: "get-all-states",
};

export const SUPPORT = {
  SUPPORT: "partner-support",
};

export const ADVERTISEMENT = {
  GET_ADVERTISEMENTS: "get-advertisements",
  GET_CAMPAIGNS: "get-campaigns",
  START_CAMPAIGN: "start-campaign",
  VIEW_CAMPAIGN: "view-campaign/{campaignId}",
  UPDATE_CAMPAIGN: "update-campaign/{campaignId}",
  GET_ADS_INFO: "get-advertisement-info",
  PUBLISH_ADS: "publish-ads",
  GET_ADS: "get-ads",
  VIEW_ADS_BY_ID: "create-new-ad/{advertisementId}",
  UPDATE_ADVERTISEMENT: "/update-ads/{advertisementId}",
};

export const SETTING = {
  UPDATE_SETTING: "update-setting-detail",
  GET_SETTING: "get-setting-detail",
  ADD_USER: "add-user",
  GET_USER_LIST: "get-user-list",
  DELETE_USER: "delete-user",
  EDIT_USER: "edit-user",
  UPDATE_USER: "update-user",
};

export const TCD_UPDATES = {
  GET_ALL: "/tcd-updates",
  GET_UPDATE_BY_ID: "/tcd-updates/{id}",
};
