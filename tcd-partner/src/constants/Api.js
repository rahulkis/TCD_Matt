import axios from "axios";
import { API_BASE_URL } from "./AppConstant";

export const setUserSession = (partnerObj) => {
  localStorage.setItem("token", partnerObj.token);
  localStorage.setItem("pageInfo", partnerObj.pageInfo);
  localStorage.setItem("partner", JSON.stringify(partnerObj.partnerInfo));
};

export const getAccessToken = () => {
  const token = localStorage.getItem("token");
  if (token)
    return token;
  return null;
};

export const httpClient = axios.create({
  baseURL: API_BASE_URL
});

httpClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log(error);
    Promise.reject(error);
  }
);
