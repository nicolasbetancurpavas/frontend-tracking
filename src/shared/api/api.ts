import axios, { AxiosHeaders } from "axios";
import { useAuthStore } from "../../modules/auth/store/auth.store";

export const authApi = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_URL,
  timeout: 15000,
});

export const logApi = axios.create({
  baseURL: import.meta.env.VITE_LOG_API_URL,
  timeout: 15000,
});

logApi.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (!token) return config;

  // Asegura AxiosHeaders (v1)
  const headers =
    config.headers instanceof AxiosHeaders
      ? config.headers
      : new AxiosHeaders(config.headers);

  headers.set("Authorization", `Bearer ${token}`); // ← correcto en v1
  config.headers = headers; // ← mantiene el tipo
  return config;
});

// si quieres asegurarte de NO mandar Authorization al authApi
authApi.interceptors.request.use((config) => {
  const headers =
    config.headers instanceof AxiosHeaders
      ? config.headers
      : new AxiosHeaders(config.headers);
  headers.delete("Authorization");
  config.headers = headers;
  return config;
});

export const isAxiosError = axios.isAxiosError;
