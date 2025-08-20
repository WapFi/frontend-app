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
  const token = localStorage.getItem("auth_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default instance;