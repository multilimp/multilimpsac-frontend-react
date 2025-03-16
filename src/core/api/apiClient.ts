
import axios from "axios";

// Create a base axios instance for the API
const apiClient = axios.create({
  // This would typically point to your PHP backend
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage or other storage
    const token = localStorage.getItem("multilimp-auth-token");
    
    // If token exists, add to headers
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        // Clear auth data and redirect to login
        localStorage.removeItem("multilimp-auth-token");
        window.location.href = "/login";
      }
      
      // Handle 403 Forbidden
      if (error.response.status === 403) {
        console.error("Acceso denegado");
      }
      
      // Handle 500 Server Error
      if (error.response.status >= 500) {
        console.error("Error del servidor");
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
