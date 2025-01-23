import axios from "axios";
import config from "./config";

const axiosInstance = axios.create({
  baseURL: config.API_BASE_URL, // Set base URL from config
  withCredentials: true, // Ensure cookies are sent with requests
  headers: {
    "Content-Type": "application/json",
  },

});

export default axiosInstance;
