// src/components/NavBar.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface NavBarProps {
  theme: string;
  isLoggedIn: boolean;
  onLogout: () => void;
  onLogin: () => void;
  toggleTheme: () => void;
  openSearch: () => void;
  formQuery: string;
  setFormQuery: (query: string) => void;
  handleSearchSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleClearSearch: () => void;
  isDropdownOpen: boolean;
  toggleDropdown: () => void;
  closeDropdown: () => void;
}

const NavBar: React.FC<NavBarProps> = ({
  theme,
  isLoggedIn,
  onLogout,
  onLogin,
  toggleTheme,
  openSearch,
  formQuery,
  setFormQuery,
  handleSearchSubmit,
  handleClearSearch,
  isDropdownOpen,
  toggleDropdown,
}) => {
  return (
    <nav className={`p-4 ${theme === 'dark' ? 'bg-stone-900 text-stone-400' : 'bg-white text-black'} flex justify-between items-center`}>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <i className={`fa-solid fa-bars cursor-pointer ${theme === 'dark' ? 'text-stone-100' : 'text-black'}`} onClick={toggleDropdown}></i>
          {isDropdownOpen && (
            <div className={`absolute left-0 mt-2 w-48 py-2 ${theme === 'dark' ? 'bg-stone-700' : 'bg-white'} rounded-md shadow-lg z-20`}>
              <div
                onClick={isLoggedIn ? onLogout : onLogin}
                className={`block px-4 py-2 text-sm cursor-pointer ${theme === 'dark' ? 'text-stone-100' : 'text-black'} hover:${theme === 'dark' ? 'bg-stone-600' : 'bg-gray-200'}`}
              >
                {isLoggedIn ? 'Logout' : 'Login'}
              </div>
              <div
                onClick={toggleTheme}
                className={`block px-4 py-2 text-sm cursor-pointer ${theme === 'dark' ? 'text-stone-100' : 'text-black'} hover:${theme === 'dark' ? 'bg-stone-600' : 'bg-gray-200'}`}
              >
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </div>
            </div>
          )}
        </div>
        <Link to="/" className="font-bold text-2xl">
          <span className={`${theme === 'dark' ? 'text-stone-100' : 'text-black'} whitespace-nowrap`}>
            Todd<span className="font-thin">Tsai</span>
          </span>
        </Link>
      </div>
      <div className="flex-1 hidden sm:flex justify-center">
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md">
          <input
            type="text"
            value={formQuery}
            onChange={(e) => setFormQuery(e.target.value)}
            placeholder="Search"
            className={`pl-5 p-2 border rounded-full w-full pr-10 ${theme === 'dark' ? 'bg-stone-900 text-stone-500 border-stone-600 dark-placeholder' : 'bg-white text-gray-500 border-gray-300 light-placeholder'}`}
          />
          <div className="absolute right-0 top-0 h-full flex items-center pr-3">
            <button type="submit" className="hidden">Search</button>
            <i
              className={`fa-solid fa-circle-xmark cursor-pointer ${theme === 'dark' ? 'text-stone-500' : 'text-gray-500'}`}
              onClick={handleClearSearch}
            ></i>
          </div>
        </form>
      </div>
      <div className="flex items-center space-x-4">
        <div className="sm:hidden">
          <i className={`fa-solid fa-magnifying-glass cursor-pointer ${theme === 'dark' ? 'text-stone-100' : 'text-black'}`} onClick={openSearch}></i>
        </div>
        {isLoggedIn && (
          <>
            <Link to="/create" className={`flex items-center text-xl ${theme === 'dark' ? 'text-stone-100' : 'text-black'}`}>
              <i className="fa-regular fa-square-plus"></i>
            </Link>
            <Link to="/admin-blog-posts" className={`flex items-center ${theme === 'dark' ? 'text-stone-100' : 'text-black'}`}>
              <i className="fa-solid fa-user-tie"></i>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
