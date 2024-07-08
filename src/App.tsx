// src/App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Admin from './routes/Login';
import BlogPosts from './routes/BlogPosts';
import PostDetail from './routes/PostDetail';
import AdminBlogPosts from './routes/AdminBlogPosts';
import CreatePost from './routes/CreatePost';
import EditPost from './routes/EditPost';
import NavBar from './components/Navbar';
import SearchOverlay from './components/SearchOverlay';
import { useTheme } from './contexts/ThemeContext';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('access'));
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [formQuery, setFormQuery] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  const { theme, toggleTheme } = useTheme(); // Use theme context

  const navigate = useNavigate(); // Ensure useNavigate is used within the Router context

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleLogin = () => {
    navigate('/login');
    setIsDropdownOpen(false);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    navigate('/admin-blog-posts');
  };

  const handleLogout = () => {
    clearCache();
    setIsLoggedIn(false);
    setIsDropdownOpen(false);
    navigate('/');
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchQuery(formQuery);
    setIsSearchOpen(false);
    navigate(`/?search=${formQuery}`);
  };

  const handleClearSearch = () => {
    setFormQuery('');
    setSearchQuery('');
    setIsSearchOpen(false);
    navigate('/');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const openSearch = () => {
    setIsSearchOpen(true);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
  };

  const clearCache = () => {
    localStorage.clear();
    console.log('Cache cleared');
  };

  const handleToggleTheme = () => {
    toggleTheme();
    setIsDropdownOpen(false);
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-stone-900 text-stone-100' : 'bg-white text-black'} ${isDropdownOpen || isSearchOpen ? 'overflow-hidden' : ''}`}>
      <NavBar
        theme={theme}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onLogin={handleLogin}
        toggleTheme={handleToggleTheme}
        openSearch={openSearch}
        formQuery={formQuery}
        setFormQuery={setFormQuery}
        handleSearchSubmit={handleSearchSubmit}
        handleClearSearch={handleClearSearch}
        isDropdownOpen={isDropdownOpen}
        toggleDropdown={toggleDropdown}
        closeDropdown={closeDropdown}
      />
      {(isDropdownOpen || isSearchOpen) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={isSearchOpen ? closeSearch : closeDropdown}
        ></div>
      )}
      <SearchOverlay
        isOpen={isSearchOpen}
        formQuery={formQuery}
        setFormQuery={setFormQuery}
        handleSearchSubmit={handleSearchSubmit}
        handleClearSearch={handleClearSearch}
        closeSearch={closeSearch}
        theme={theme}
      />
      <div className={`${isDropdownOpen || isSearchOpen ? 'pointer-events-none' : ''} relative z-0`}>
        <Routes>
          <Route path="/login" element={<Admin onLogin={handleLoginSuccess} />} />
          <Route path="/" element={<BlogPosts searchQuery={searchQuery} />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          {isLoggedIn && <Route path="/admin-blog-posts" element={<AdminBlogPosts />} />}
          {isLoggedIn && <Route path="/create" element={<CreatePost />} />}
          {isLoggedIn && <Route path="/edit/:id" element={<EditPost />} />}
        </Routes>
      </div>
    </div>
  );
};

const WrappedApp = () => (
  <Router>
    <App />
  </Router>
);

export default WrappedApp;
