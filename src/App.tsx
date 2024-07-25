import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BlogPosts from './routes/BlogPosts';
import NavBar from './components/Navbar';
import Login from './routes/Login';
import AdminBlogPosts from './routes/AdminBlogPosts';
import CreatePost from './routes/CreatePost';
import EditPost from './routes/EditPost';
import PostDetail from './routes/PostDetail';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('access'));
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setIsLoggedIn(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-stone-900 text-stone-100' : 'bg-white text-black'}`}>
      <NavBar
        theme={theme}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onLogin={handleLogin}
        toggleTheme={toggleTheme}
        isDropdownOpen={isDropdownOpen}
        toggleDropdown={toggleDropdown}
      />
      <Routes>
        <Route path="/" element={<BlogPosts searchQuery="" />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/admin-blog-posts" element={<AdminBlogPosts />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/edit/:id" element={<EditPost />} />
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
