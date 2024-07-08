import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../App.css'; // Import the CSS file for custom styles

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  view_count: number;
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

const timeAgo = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) return `${interval} years ago`;

  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return `${interval} months ago`;

  interval = Math.floor(seconds / 86400);
  if (interval > 1) return `${interval} days ago`;

  interval = Math.floor(seconds / 3600);
  if (interval > 1) return `${interval} hours ago`;

  interval = Math.floor(seconds / 60);
  if (interval > 1) return `${interval} minutes ago`;

  return `${Math.floor(seconds)} seconds ago`;
};

interface BlogPostsProps {
  searchQuery: string;
  theme: string;
}

const BlogPosts: React.FC<BlogPostsProps> = ({ searchQuery, theme }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
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
        const cachedTags = localStorage.getItem('blogTags');
        const cachedTime = localStorage.getItem('blogCachedTime');
        const now = new Date().getTime();
        const cacheDuration = 60000; // 1 minute cache duration

        const fetchPosts = async () => {
          const response = await fetch(`http://localhost:8000/api/posts/?search=${searchQuery}`);
          if (!response.ok) {
            throw new Error('Failed to fetch posts');
          }
          return response.json();
        };

        const fetchTags = async () => {
          const response = await fetch('http://localhost:8000/api/tags/');
          if (!response.ok) {
            throw new Error('Failed to fetch tags');
          }
          return response.json();
        };

        if (searchQuery) {
          const postsData = await fetchPosts();
          setPosts(postsData);
        } else {
          const cachedPosts = localStorage.getItem('blogPosts');
          if (cachedPosts && cachedTags && cachedTime && (now - parseInt(cachedTime) < cacheDuration)) {
            const postsData = JSON.parse(cachedPosts);
            const tagsData = JSON.parse(cachedTags);
            setPosts(postsData);
            setTags(tagsData);
          } else {
            const [postsData, tagsData] = await Promise.all([fetchPosts(), fetchTags()]);
            setPosts(postsData);
            setTags(tagsData);
            localStorage.setItem('blogPosts', JSON.stringify(postsData));
            localStorage.setItem('blogTags', JSON.stringify(tagsData));
            localStorage.setItem('blogCachedTime', now.toString());
          }
        }
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
    <main className="sm:px-12 px-0">
      <div className="px-4 flex flex-nowrap overflow-x-auto gap-2 mb-4">
        <span
          onClick={handleAllClick}
          className={`px-4 py-2 text-sm font-medium cursor-pointer rounded-full ${selectedTags.length === 0 ? theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white' : theme === 'dark' ? 'bg-stone-700 text-white' : 'bg-stone-200 text-black'}`}
        >
          All
        </span>
        {tags.map(tag => (
          <span
            key={tag.id}
            onClick={() => handleTagClick(tag.name)}
            className={`px-4 py-2 text-sm font-medium cursor-pointer rounded-full ${selectedTags.includes(tag.name) ? theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white' : theme === 'dark' ? 'bg-stone-700 text-white' : 'bg-stone-200 text-black'}`}
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
              <div className={`absolute top-0 left-0 w-full h-full ${theme === 'dark' ? 'bg-stone-200' : 'bg-stone-200'} sm:rounded-lg overflow-hidden`}>
                {extractFirstImageUrl(post.content) ? (
                  <img
                    src={extractFirstImageUrl(post.content) || ''}
                    alt="Post image"
                    className="absolute top-0 left-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-stone-400">
                    No Image
                  </div>
                )}
                <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
            <div className="mt-2 ml-3">
              <h2 className="text-md font-bold">{post.title}</h2>
              <div className={`flex items-center space-x-4 pb-6 font-thin ${theme === 'dark' ? 'text-stone-400' : ' text-gray-600'}`}>
                <div className="flex items-center space-x-1">
                  <span>{post.view_count} views</span>
                </div>
                <p className="text-sm">{timeAgo(post.created_at)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
};

export default BlogPosts;
