import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TagFilter from '../components/TagFilter';
import PostCard from '../components/PostCard';
import useFetchPosts from '../hooks/useFetchPosts';
import { useTheme } from '../contexts/ThemeContext';
import { Helmet } from 'react-helmet';

interface BlogPostsProps {
  searchQuery: string;
}

const BlogPosts: React.FC<BlogPostsProps> = ({ searchQuery }) => {
  const navigate = useNavigate();
  const { theme } = useTheme(); // Use the useTheme hook to get the current theme
  const { posts, tags, error, selectedTags, setSelectedTags } = useFetchPosts(searchQuery);

  useEffect(() => {
    console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
  }, []);

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

  React.useEffect(() => {
    if (selectedTags.length > 0) {
      navigate(`/?tag=${selectedTags.join(',')}`);
    } else {
      navigate('/');
    }
  }, [selectedTags, navigate]);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!posts) {
    return <p>Free database takes some time...</p>;
  }

  return (
    <>
      <Helmet>
        <title>Todd's Blog</title>
      </Helmet>

      <main className="sm:px-12 px-0">
        <TagFilter
          tags={tags}
          selectedTags={selectedTags}
          onTagClick={handleTagClick}
          onAllClick={handleAllClick}
          theme={theme} // Pass theme to TagFilter
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPosts.map(post => (
            <PostCard key={post.id} post={post} theme={theme} /> // Pass theme to PostCard
          ))}
        </div>
      </main>
    </>
  );
};

export default BlogPosts;
