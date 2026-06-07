import axios from "./axios";

export const signUp = (data) => axios.post("/auth/sign_up", data);

export const signIn = (data) => axios.post("/auth/sign_in", data);

export const requestPasswordReset = (data) =>
  axios.post("/auth/request_reset", data);

export const verifyResetCode = (code) =>
  axios.get(`/auth/verify/${code}`);

export const resetPassword = (data) =>
  axios.patch("/auth/reset_password", data);

export const signOut = () => axios.post("/auth/sign_out");