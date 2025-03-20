import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const api = axios.create({
  baseURL: "http://localhost:8000/api/auth",
  withCredentials: true,
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
      formData.append("username", email); // OAuth2 expects "username" instead of "email"
      formData.append("password", password);
  
      const res = await api.post("/login", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
  
      console.log("Login Response:", res.data);
  
      if (!res.data.is_superuser) {
        throw new Error("Unauthorized: Only superusers can access");
      }
  
      const token = res.data.access_token;
      localStorage.setItem("accessToken", token);
      setAccessToken(token);
  
      const decodedUser = decodeToken(token);
      setUser(decodedUser);
      localStorage.setItem("user", JSON.stringify(decodedUser));
      localStorage.setItem("adminToken", res.data.accessToken);
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Invalid credentials or server error");
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

      const token = res.data.accessToken;
      setAccessToken(token);

      const decodedUser = decodeToken(token);
      setUser(decodedUser);
      localStorage.setItem("user", JSON.stringify(decodedUser));

      return token;
    } catch (error) {
      console.error(
        "Refresh token error:",
        error.response?.data?.message || error.message
      );
      setAccessToken(null);
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          try {
            const newAccessToken = await refreshAccessToken();
            if (newAccessToken) {
              error.config.headers[
                "Authorization"
              ] = `Bearer ${newAccessToken}`;
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
