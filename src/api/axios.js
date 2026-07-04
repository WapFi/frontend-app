import axios from "axios";
import clearSessionData from "../utils/clearSessionData";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error("VITE_API_BASE_URL is not configured");
}

let isHandlingUnauthorized = false;

const instance = axios.create({
  baseURL: apiBaseUrl,

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const hasToken = Boolean(localStorage.getItem("auth_token"));

    if (status === 401 && hasToken && !isHandlingUnauthorized) {
      isHandlingUnauthorized = true;

      clearSessionData();
      sessionStorage.setItem("sessionExpired", "true");

      window.location.replace("/sign-in");
    }

    return Promise.reject(error);
  },
);

export default instance;
