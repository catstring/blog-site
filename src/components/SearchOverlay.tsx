// src/components/SearchOverlay.tsx
import React from 'react';

interface SearchOverlayProps {
  isOpen: boolean;
  formQuery: string;
  setFormQuery: (query: string) => void;
  handleSearchSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleClearSearch: () => void;
  closeSearch: () => void;
  theme: string;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({
  isOpen,
  formQuery,
  setFormQuery,
  handleSearchSubmit,
  handleClearSearch,
  theme,
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-0 left-0 right-0 flex justify-center items-center p-4 bg-opacity-75 bg-black z-20 sm:hidden">
      <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md">
        <input
          type="text"
          value={formQuery}
          onChange={(e) => setFormQuery(e.target.value)}
          placeholder="Search"
          className={`pl-5 p-2 border rounded-full w-full pr-10 ${theme === 'dark' ? 'bg-stone-900 text-stone-100 border-stone-600 dark-placeholder' : 'bg-white text-black border-gray-300 light-placeholder'}`}
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
  );
};

export default SearchOverlay;
