import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  // Load initial state from localStorage
  const [accessToken, setAccessToken] = useState(
    () => localStorage.getItem("accessToken") || null
  );
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [role, setRole] = useState(() => localStorage.getItem("role") || null);
  const [userName, setUserName] = useState(
    () => localStorage.getItem("userName") || null
  );
  const [loading, setLoading] = useState(true);

  // Function to get the base URL based on the role
  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

  const getBaseURL = (role) => {
    switch (role) {
      case "student":
        return `${BASE_URL}/api/auth`;
      case "teacher":
        return `${BASE_URL}/api/auth`;
      default:
        return `${BASE_URL}/api/auth`;
    }
  };
  

  // Function to get API instance dynamically
  const getApiInstance = (role) =>
    axios.create({
      baseURL: getBaseURL(role),
      withCredentials: true,
    });

  // Function to decode JWT token
  const decodeToken = (token) => {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  // Sign-up function
  const signUp = async ({ username, email, password, role }) => {
    try {
      const api = getApiInstance(role);
      const res = await api.post('/signup', {
        username,
        email,
        password,
        role,
      });
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Signup failed");
    }
  };

  // Login function
  const login = async ({ email, password, role }) => {
    try {
      const api = getApiInstance(role);
  
      // Use URLSearchParams instead of FormData
      const formData = new URLSearchParams();
      formData.append("username", email);  // OAuth2 expects "username"
      formData.append("password", password);
  
      // Make API request with correct Content-Type
      const res = await api.post("/login", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
  
      const token = res.data.access_token; // ✅ Correct token key
      const userData = res.data.user; // ✅ Extract user data
      const userrole = userData.role; // ✅ Extract role from user object
      const isApproved = res.is_active; // ✅ Extract approved from user object
      console.log(isApproved);

      if (!isApproved) {
        throw new Error("Not approved yet");
        return; // Stop login process
      }
      // Store token & user details
      setAccessToken(token);
      setUserName(userData.username);
      setUser(decodeToken(token));
      setRole(userrole);
  
      localStorage.setItem("accessToken", token);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("role", userrole);
      localStorage.setItem("userName", userData.username);
  
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || "Error logging in");
    }
  };
  
  // Logout function
  const logout = async () => {
    try {
      const userRole = localStorage.getItem("role");
      if (!userRole) throw new Error("No role found for logout");

      const api = getApiInstance(userRole);

      console.log(userRole);

      // Clear state and storage
      setAccessToken(null);
      setUser(null);
      setRole(null);
      setUserName(null);
      localStorage.clear();

      await api.post('/api/auth/logout');
      navigate("/login");
    } catch (error) {
      console.error(
        "Logout error:",
        error.response?.data?.message || error.message
      );
    }
  };

  // Refresh access token
  const refreshAccessToken = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/api/auth/refresh-token`,
        {},
        { withCredentials: true }
      );
      const token = res.data.access_token;
      setAccessToken(token);

      const decodedUser = decodeToken(token);
      setUser(decodedUser);
      localStorage.setItem("accessToken", token);
      localStorage.setItem("user", JSON.stringify(decodedUser));

      return token;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      logout();
    }
  };

  // Set up API interceptors
  useEffect(() => {
    if (!role) return;

    const api = getApiInstance(role);

    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          try {
            const newAccessToken = await refreshAccessToken();
            if (newAccessToken) {
              error.config.headers[
                "Authorization"
              ] =` Bearer ${newAccessToken}`;
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
  }, [role]);

  // Restore authentication state on page reload
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setAccessToken(storedToken);
      setUser(JSON.parse(storedUser));
      setRole(localStorage.getItem("role") || null);
      setUserName(localStorage.getItem("userName") || null);
    }

    setLoading(false);
  }, []);

  // Helper function to check if the user is authenticated
  const isAuthenticated = () => !!accessToken && !!user;

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        userName,
        user,
        role,
        login,
        signUp,
        logout,
        loading,
        isAuthenticated,
        api: getApiInstance(role),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);

export default AuthContext;