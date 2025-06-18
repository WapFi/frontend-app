// import axios from "axios";
// import { getCookie } from "../utils/getCookie";

// const instance = axios.create({
//   baseURL:
//     "https://wapfi-backend-service-staging-718658406507.europe-west1.run.app/api/v1",
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },
// });

// instance.interceptors.request.use((config) => {
//   const csrfToken = getCookie("csrf_token");
//   if (csrfToken) {
//     config.headers["X-CSRF-Token"] = csrfToken;
//   }
//   return config;
// });

// export default instance;

// import axios from "axios";
// import { getCookie } from "../utils/getCookie";

// const instance = axios.create({
//   baseURL:
//     "https://wapfi-backend-service-staging-718658406507.europe-west1.run.app/api/v1",
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },
// });

// instance.interceptors.request.use((config) => {
//   // List of routes that do NOT need CSRF
//   const publicRoutes = [
//     "/auth/sign_in",
//     "/auth/sign_up",
//     "/auth/request_reset",
//     "/auth/reset_password",
//     "/auth/verify",
//   ];

//   // Check if the request URL includes any public route
//   const isPublic = publicRoutes.some((route) => config.url?.includes(route));

//   // Only add CSRF token if it's NOT a public route
//   if (!isPublic) {
//     const csrfToken = getCookie("csrf_token");
//     if (csrfToken) {
//       config.headers["X-CSRF-Token"] = csrfToken;
//     }
//   }

//   return config;
// });

// export default instance;



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

// Axios request interceptor
instance.interceptors.request.use((config) => {
  // List of routes that do NOT need CSRF or cookies
  const publicRoutes = [
    "/auth/sign_in",
    "/auth/sign_up",
    "/auth/request_reset",
    "/auth/reset_password",
    "/auth/verify",
  ];

  const isPublic = publicRoutes.some((route) => config.url?.includes(route));

  // 🚫 Do NOT send cookies for public routes
  config.withCredentials = !isPublic;

  // 🔐 Only add CSRF token for private routes
  if (!isPublic) {
    const csrfToken = getCookie("csrf_token");
    if (csrfToken) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }
  }

  return config;
});

export default instance;

