import React from 'react';
import { Link } from 'react-router-dom';

interface NavBarProps {
  isLoggedIn: boolean;
  onLogout: () => void;
  onLogin: () => void;
  isDropdownOpen: boolean;
  toggleDropdown: () => void;
}

const NavBar: React.FC<NavBarProps> = ({
  isLoggedIn,
  onLogout,
  onLogin,
  isDropdownOpen,
  toggleDropdown,
}) => {
  return (
    <nav className="p-4 bg-white text-black flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <i className="fa-solid fa-bars cursor-pointer text-black" onClick={toggleDropdown}></i>
          {isDropdownOpen && (
            <div className="absolute left-0 mt-2 w-48 py-2 bg-white rounded-md shadow-lg z-20">
              <div
                onClick={isLoggedIn ? onLogout : onLogin}
                className="block px-4 py-2 text-sm cursor-pointer text-black hover:bg-gray-200"
              >
                {isLoggedIn ? 'Logout' : 'Login'}
              </div>
            </div>
          )}
        </div>
        <Link to="/" className="font-bold text-2xl">
          <span className="text-black">
            Todd<span className="font-thin">'s Blog</span>
          </span>
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        {isLoggedIn && (
          <>
            <Link to="/create" className="flex items-center text-xl text-black">
              <i className="fa-regular fa-square-plus"></i>
            </Link>
            <Link to="/admin-blog-posts" className="flex items-center text-black">
              <i className="fa-solid fa-user-tie"></i>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
