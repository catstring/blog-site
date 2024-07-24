// src/App.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BlogPosts from './routes/BlogPosts';
import NavBar from './components/Navbar';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('access'));
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogin = () => {
    // Handle login functionality
  };

  const handleLogout = () => {
    // Handle logout functionality
    setIsLoggedIn(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <NavBar
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onLogin={handleLogin}
        isDropdownOpen={isDropdownOpen}
        toggleDropdown={toggleDropdown}
      />
      <Routes>
        <Route path="/" element={<BlogPosts searchQuery="" />} />
      </Routes>
    </div>
  );
};

const WrappedApp = () => (
  <Router>
    <App />
  </Router>
);

export default WrappedApp;
