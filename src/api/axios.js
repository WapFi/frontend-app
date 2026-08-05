import axios from "axios";
import clearSessionData from "../utils/clearSessionData";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error("VITE_API_BASE_URL is not configured");
}

const instance = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retried &&
      !originalRequest.url?.includes("/auth/refresh") &&
      !originalRequest.url?.includes("/auth/sign_in") &&
      !originalRequest.url?.includes("/auth/sign_out")
    ) {
      originalRequest._retried = true;

      try {
        await instance.post("/auth/refresh");
        return instance(originalRequest);
      } catch {
        clearSessionData();

        if (window.location.pathname !== "/sign-in") {
          sessionStorage.setItem("sessionExpired", "true");
          window.location.replace("/sign-in");
        }

        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

export default instance;
