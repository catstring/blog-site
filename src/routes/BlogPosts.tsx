import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../App.css'; // Import the CSS file for custom styles

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  tags: { name: string }[];
}

interface Tag {
  id: number;
  name: string;
}

const extractFirstImageUrl = (content: string): string | null => {
  const match = content.match(/!\[.*?\]\((.*?)\)/);
  return match ? match[1] : null;
};

const BlogPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [formQuery, setFormQuery] = useState<string>('');
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tag = params.get('tag');
    if (tag) {
      setSelectedTags(tag.split(','));
    }

    const fetchData = async () => {
      try {
        const [postsRes, tagsRes] = await Promise.all([
          fetch(`http://localhost:8000/api/posts/?search=${searchQuery}`),
          fetch('http://localhost:8000/api/tags/')
        ]);

        if (!postsRes.ok) {
          throw new Error('Failed to fetch posts');
        }
        if (!tagsRes.ok) {
          throw new Error('Failed to fetch tags');
        }

        const postsData = await postsRes.json();
        const tagsData = await tagsRes.json();

        setPosts(postsData);
        setTags(tagsData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data');
      }
    };

    fetchData();
  }, [searchQuery, location.search]);

  const handleTagClick = (tag: string) => {
    setSelectedTags(prevTags =>
      prevTags.includes(tag) ? prevTags.filter(t => t !== tag) : [...prevTags, tag]
    );
  };

  const handleAllClick = () => {
    setSelectedTags([]);
    navigate('/');
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchQuery(formQuery);
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

  const filteredPosts = posts.filter(post => 
    selectedTags.length === 0 || selectedTags.every(tag => post.tags.some(t => t.name === tag))
  );

  useEffect(() => {
    if (selectedTags.length > 0) {
      navigate(`/?tag=${selectedTags.join(',')}`);
    } else {
      navigate('/');
    }
  }, [selectedTags, navigate]);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <main className="p-8">
      <form onSubmit={handleSearchSubmit} className="flex justify-center mb-4 relative">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={formQuery}
            onChange={(e) => setFormQuery(e.target.value)}
            placeholder="Search"
            className="pl-5 p-2 border border-gray-300 rounded-full shadow-md w-full pr-10"
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          {isSearchFocused && (
            <div className="absolute right-0 top-0 h-full flex items-center pr-3">
              <button type="submit" className="hidden">Search</button>
              <i 
                className="fa-solid fa-circle-xmark text-gray-500 cursor-pointer" 
                onClick={handleClearSearch}
              ></i>
            </div>
          )}
        </div>
      </form>
      <div className="flex flex-wrap gap-2 mb-8">
        <span
          onClick={handleAllClick}
          className={`px-3 py-1 text-sm text-gray-700 cursor-pointer rounded-full ${selectedTags.length === 0 ? 'bg-blue-200' : 'bg-gray-200'}`}
        >
          All
        </span>
        {tags.map(tag => (
          <span
            key={tag.id}
            onClick={() => handleTagClick(tag.name)}
            className={`px-3 py-1 text-sm text-gray-700 cursor-pointer rounded-full ${selectedTags.includes(tag.name) ? 'bg-blue-200' : 'bg-gray-200'}`}
          >
            {tag.name}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPosts.map((post) => (
          <Link
            key={post.id}
            to={`/posts/${post.id}`}
            className="group"
          >
            <div className="relative w-full" style={{ paddingBottom: '56.25%', height: 0 }}>
              <div className="absolute top-0 left-0 w-full h-full bg-gray-200 rounded-lg overflow-hidden">
                {/* Extract the first image URL from the content */}
                {extractFirstImageUrl(post.content) ? (
                  <img
                    src={extractFirstImageUrl(post.content) || ''}
                    alt="Post image"
                    className="absolute top-0 left-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                </div>
              </div>
            </div>
            <div className="mt-2">
              <h2 className="text-md font-bold">{post.title}</h2>
              <p className="text-sm text-gray-600">Created on: {new Date(post.created_at).toLocaleDateString()}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
};

export default BlogPosts;
