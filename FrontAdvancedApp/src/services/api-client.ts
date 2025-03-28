import axios, { CanceledError } from "axios";
import userService from "./user_service";
export { CanceledError };

const backend_url = import.meta.env.VITE_BACKEND_URL
const apiClient = axios.create({
    baseURL: backend_url || "https://node33.cs.colman.ac.il",
    withCredentials:true
});

apiClient.interceptors.request.use(
    async (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        console.log("Token expired. Trying to refresh...");
  
        const newToken = await userService.refreshAccessToken();
        if (newToken) {
          error.config.headers["Authorization"] = `Bearer ${newToken}`;
          return apiClient(error.config); 
        }
      }
      return Promise.reject(error);
    }
  );

export default apiClient;