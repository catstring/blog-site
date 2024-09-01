import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('access'));
  const navigate = useNavigate();

  const handleLoginSuccess = useCallback(() => {
    setIsLoggedIn(true);
    navigate('/admin-blog-posts');
  }, [navigate]);

  const handleLogout = useCallback(() => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate('/');
  }, [navigate]);

  return {
    isLoggedIn,
    handleLoginSuccess,
    handleLogout,
  };
};
