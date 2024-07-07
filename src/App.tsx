import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
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

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Router>
        <nav className="p-4 bg-gray-100 text-grey flex justify-between">
          <div>
            <Link to="/" className="m-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 font-bold text-2xl">Todd Tsai</Link>
            {isLoggedIn && <Link to="/admin-blog-posts" className="mr-4 text-[#878787]">Admin</Link>}
          </div>
          {isLoggedIn ? (
            <div
              onClick={handleLogout}
              onMouseEnter={() => setIsLogoutHovered(true)}
              onMouseLeave={() => setIsLogoutHovered(false)}
              className="cursor-pointer"
            >
              <i className={`fa-solid ${isLogoutHovered ? 'fa-door-closed' : 'fa-door-open'}`}></i>
            </div>
          ) : (
            <Link
              to="/login"
              onMouseEnter={() => setIsAdminHovered(true)}
              onMouseLeave={() => setIsAdminHovered(false)}
              className="cursor-pointer"
            >
              <i className={`fa-solid ${isAdminHovered ? 'fa-door-open' : 'fa-door-closed'}`}></i>
            </Link>
          )}
        </nav>
        <div>
        <Routes>
          <Route path="/login" element={<Admin onLogin={handleLogin} />} />
          <Route path="/" element={<BlogPosts />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          {isLoggedIn && <Route path="/admin-blog-posts" element={<AdminBlogPosts />} />}
          {isLoggedIn && <Route path="/create" element={<CreatePost />} />}
          {isLoggedIn && <Route path="/edit/:id" element={<EditPost />} />}
        </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;
