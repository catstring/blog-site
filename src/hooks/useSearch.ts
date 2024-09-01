import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [formQuery, setFormQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSearchQuery(formQuery);
      setIsSearchOpen(false);
      navigate(`/?search=${formQuery}`);
    },
    [formQuery, navigate]
  );

  const handleClearSearch = useCallback(() => {
    setFormQuery('');
    setSearchQuery('');
    setIsSearchOpen(false);
    navigate('/');
  }, [navigate]);

  return {
    searchQuery,
    formQuery,
    setFormQuery,
    isSearchOpen,
    setIsSearchOpen,
    handleSearchSubmit,
    handleClearSearch,
  };
};
