
import axios from "axios";

const instance = axios.create({
  baseURL:
    "https://wapfi-backend-service-staging-718658406507.europe-west1.run.app/api/v1",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

instance.interceptors.request.use((config) => {
  const publicRoutes = [
    "/auth/sign_in",
    "/auth/sign_up",
    "/auth/request_reset",
    "/auth/reset_password",
    "/auth/verify",
  ];

  const isPublic = publicRoutes.some((route) => config.url?.includes(route));
  config.withCredentials = !isPublic;

  return config;
});

export default instance;
