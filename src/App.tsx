// src/App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BlogPosts from './routes/BlogPosts';
import { useTheme } from './contexts/ThemeContext';

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { theme } = useTheme(); // Use theme context

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-stone-900 text-stone-100' : 'bg-white text-black'}`}>
      <Routes>
        <Route path="/" element={<BlogPosts searchQuery={searchQuery} />} />
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
