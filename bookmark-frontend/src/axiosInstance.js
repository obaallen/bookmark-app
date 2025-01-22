import axios from "axios";
import config from "./config";

const axiosInstance = axios.create({
  baseURL: config.API_BASE_URL, // Set base URL from config
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Ensure cookies are sent with requests
});

export default axiosInstance;
