import axios from "axios";

const instance = axios.create({
  baseURL:
    "http://localhost:8070/api/v1",
    //"https://wapfi-backend-service-staging-718658406507.europe-west1.run.app/api/v1",
    // "https://79cd-2c0f-eb68-6ae-d300-8d1b-53f2-b62f-6d29.ngrok-free.app/api/v1",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// instance.interceptors.request.use((config) => {
//   const publicRoutes = [
//     "/auth/sign_in",
//     "/auth/sign_up",
//     "/auth/request_reset",
//     "/auth/reset_password",
//     "/auth/verify",
//   ];

//   const isPublic = publicRoutes.some((route) => config.url?.includes(route));
//   config.withCredentials = !isPublic;

//   return config;
// });

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default instance;