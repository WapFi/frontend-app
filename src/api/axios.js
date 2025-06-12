import axios from "axios";
import { getCookie } from "../utils/getCookie";

const instance = axios.create({
  baseURL:
    "https://wapfi-backend-service-staging-718658406507.europe-west1.run.app/api/v1",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

instance.interceptors.request.use((config) => {
  const csrfToken = getCookie("csrf_token");
  if (csrfToken) {
    config.headers["X-CSRF-Token"] = csrfToken;
  }
  return config;
});

export default instance;
