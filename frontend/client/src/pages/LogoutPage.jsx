import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Adjust the import path

const LogoutPage = () => {
  const { logout } = useAuth(); // Get the logout function from your AuthContext
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger logout and redirect to login
    logout();
    navigate('/login'); // Optional: Redirect again if not already handled in `logout()`
  }, [logout, navigate]);

  return null; // No UI needed
};

export default LogoutPage;