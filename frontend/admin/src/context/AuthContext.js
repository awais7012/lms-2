import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const api = axios.create({
  baseURL: "http://localhost:8000/api/auth",
  withCredentials: true,
  contentType:"application/json",

});

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  const decodeToken = (token) => {
    try {
      if (!token || typeof token !== "string") {
        throw new Error("Invalid token specified: must be a string");
      }
      const decoded = jwtDecode(token);
      return { id: decoded.id, email: decoded.email, is_superuser: decoded.is_superuser };
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };
  

  const login = async (email, password) => {
    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);
  
      const res = await api.post("/login", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
  
      console.log("Login Response:", res.data);
  
      const token = res.data.access_token;
      if (!token || typeof token !== "string") {
        throw new Error("Invalid token received from login");
      }
  
      // Change this:
      // localStorage.setItem("accessToken", token);
      // To this:
      localStorage.setItem("token", token);
      setAccessToken(token);
  
      const decodedUser = decodeToken(token);
      setUser(decodedUser);
      localStorage.setItem("user", JSON.stringify(decodedUser));
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || "Invalid credentials or server error");
    }
  };
  
  
  

  const logout = async () => {
    try {
      await api.post("/logout");
      setAccessToken(null);
      setUser(null);
      localStorage.removeItem("user");
    } catch (error) {
      console.error(
        "Logout error:",
        error.response?.data?.message || error.message
      );
    }
  };

  const refreshAccessToken = async () => {
    try {
      const res = await api.post("/refresh-token");
      // Use the correct field name from the response
      const token = res.data.access_token; // not res.data.accessToken
      if (!token || typeof token !== "string") {
        throw new Error("Received invalid token");
      }
      setAccessToken(token);
      const decodedUser = decodeToken(token);
      setUser(decodedUser);
      localStorage.setItem("user", JSON.stringify(decodedUser));
      return token;
    } catch (error) {
      console.error("Refresh token error:", error.response?.data?.message || error.message);
      setAccessToken(null);
      setUser(null);
      localStorage.removeItem("user");
    }
  };
  

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        // Skip refresh logic if the request was to /login or /refresh-token
        if (error.config && 
            (error.config.url.includes('/login') || error.config.url.includes('/refresh-token'))) {
          return Promise.reject(error);
        }
        
        if (error.response?.status === 401) {
          try {
            const newAccessToken = await refreshAccessToken();
            if (newAccessToken) {
              error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
              return api(error.config);
            }
          } catch (refreshError) {
            console.error("Failed to refresh token:", refreshError);
            logout();
          }
        }
        return Promise.reject(error);
      }
    );
  
    return () => api.interceptors.response.eject(interceptor);
  }, []);
  

  useEffect(() => {
    const fetchToken = async () => {
      if (localStorage.getItem("user")) {
        await refreshAccessToken();
      }
      setLoading(false);
    };
    fetchToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        login,
        logout,
        refreshAccessToken,
        loading,
        api,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
