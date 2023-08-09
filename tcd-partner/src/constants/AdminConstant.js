export const AUTH = {
  LOGIN: "admin/login",
  VERIFY_OTP: "admin/verify-otp",
  RESEND_OTP: "admin/resend-otp",
  FORGOT_PASSWORD: "admin/forgot-password",
  LOGOUT: "partner-logout/{token}",
  RESET_PASSWORD: "partner-reset-password",
};

export const DASHBOARD = {
  GET_DASHBOARD: "admin/dashboard",
};
export const USER = {
  GET_USERS: "admin/userlist",
  BLOCK_UNBLOCK_USER:"admin/userlist/block-unblock/{id}",
  EDIT_USER:"admin/userlist/edit/{id}"
};

export const SUB_ADMIN = {
  GET_SUB_ADMIN_LIST: "admin/subadminlist",
  ADD_SUB_ADMIN: "admin/subadminlist/add",
  EDIT_SUB_ADMIN: "admin/subadminlist/update/{subAdminId}",
  UPDATE_SUB_ADMIN: "admin/subadminlist/update/data/{subAdminId}",
  BLOCK_UNBLOCK_SUB_ADMIN: "admin/subadminlist/block-unblock/{subAdminId}",
  DELETE_SUB_ADMIN: "admin/subadminlist/delete/{subAdminId}"
};

export const USER_DIARY_LIST = {
  GET_USER_DIARY_LIST: "/admin/userdiarylist",
  VIEW_USER_DIARY_LIST: "/admin/userdiarylist/view/{id}"
};

export const PARTNER_ADMIN = {
  GET_PARTNER_ADMIN_LIST: "admin/partner-admin",
  ADD_NEW_PARTNER_ADMIN: "admin/partner-admin/add",
  EDIT_PARTNER_ADMIN: "admin/partner-admin/update/{partnerAdminId}",
  UPDATE_PARTNER_ADMIN: "admin/partner-admin/update/data/{partnerAdminId}",
  BLOCK_UNBLOCK_PARTNER_ADMIN: "admin/partner-admin/block-unblock/{partnerAdminId}",
  DELETE_PARTNER_ADMIN: "admin/partner-admin/delete/{partnerAdminId}"
};

export const PARTNER = {
  GET_PARTNER_LIST: "admin/partner",
  GET_PARTNER_ADMINS: "admin/partner/admins",
  ADD_NEW_PARTNER: "admin/partner/add",
  EDIT_PARTNER: "admin/partner/edit/{partnerId}",
  BLOCK_UNBLOCK_PARTNER: "admin/partner/block-unblock/{partnerId}",
  DELETE_PARTNER: "admin/partner/delete/{partnerId}"
};

