import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import Admin from './routes/Login'; 
import BlogPosts from './routes/BlogPosts';
import PostDetail from './routes/PostDetail';
import AdminBlogPosts from './routes/AdminBlogPosts';
import CreatePost from './routes/CreatePost';
import EditPost from './routes/EditPost';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('access'));
  const [isAdminHovered, setIsAdminHovered] = useState(false);
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [formQuery, setFormQuery] = useState<string>('');
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);

  const navigate = useNavigate(); // Ensure useNavigate is used within the Router context

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchQuery(formQuery);
    navigate(`/?search=${formQuery}`);
  };

  const handleClearSearch = () => {
    setFormQuery('');
    setSearchQuery('');
    navigate('/');
  };

  const handleFocus = () => {
    setIsSearchFocused(true);
  };

  const handleBlur = () => {
    setIsSearchFocused(false);
  };

  return (
    <div className="bg-stone-900 min-h-screen">
      <nav className="p-4 bg-stone-900 text-stone-400 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="ml-4 mr-4 font-bold text-2xl">
            <span className="text-stone-100 whitespace-nowrap">
              Todd <span className="font-thin">Tsai</span>
            </span>
          </Link>
          {isLoggedIn && <Link to="/admin-blog-posts" className="mr-4 text-stone-400">Admin</Link>}
        </div>
        <form onSubmit={handleSearchSubmit} className="flex-grow max-w-md relative">
          <div className="relative w-full">
            <input
              type="text"
              value={formQuery}
              onChange={(e) => setFormQuery(e.target.value)}
              placeholder="Search"
              className="pl-5 p-2 border border-stone-600 rounded-full shadow-md w-full pr-10 bg-stone-900 font-thin text-stone-100"
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            {isSearchFocused && (
              <div className="absolute right-0 top-0 h-full flex items-center pr-3">
                <button type="submit" className="hidden">Search</button>
                <i 
                  className="fa-solid fa-circle-xmark text-stone-500 cursor-pointer" 
                  onClick={handleClearSearch}
                ></i>
              </div>
            )}
          </div>
        </form>
        {isLoggedIn ? (
          <div
            onClick={handleLogout}
            onMouseEnter={() => setIsLogoutHovered(true)}
            onMouseLeave={() => setIsLogoutHovered(false)}
            className="cursor-pointer ml-4"
          >
            <i className={`fa-solid ${isLogoutHovered ? 'fa-door-closed' : 'fa-door-open'} text-stone-100`}></i>
          </div>
        ) : (
          <Link
            to="/login"
            onMouseEnter={() => setIsAdminHovered(true)}
            onMouseLeave={() => setIsAdminHovered(false)}
            className="cursor-pointer ml-4"
          >
            <i className={`fa-solid ${isAdminHovered ? 'fa-door-open' : 'fa-door-closed'} text-stone-100`}></i>
          </Link>
        )}
      </nav>
      <div>
        <Routes>
          <Route path="/login" element={<Admin onLogin={handleLogin} />} />
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
