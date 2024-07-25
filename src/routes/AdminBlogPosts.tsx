import React, { useEffect, useState } from 'react';
import AdminPostCard from '../components/AdminPostCard';
import { fetchPosts, deletePost } from '../api';

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  view_count: number;
}

const AdminBlogPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const cachedPosts = localStorage.getItem('adminPosts');
        const cachedTime = localStorage.getItem('adminPostsCachedTime');
        const now = new Date().getTime();

        if (cachedPosts && cachedTime && now - parseInt(cachedTime) < 60000) { // Cache duration: 1 minute
          setPosts(JSON.parse(cachedPosts));
        } else {
          const data = await fetchPosts();
          setPosts(data);

          localStorage.setItem('adminPosts', JSON.stringify(data));
          localStorage.setItem('adminPostsCachedTime', now.toString());
        }
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to fetch posts');
      }
    };

    getPosts();
  }, []);

  const handleDeletePost = async (postId: number) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await deletePost(postId);
      const updatedPosts = posts.filter(post => post.id !== postId);
      setPosts(updatedPosts);

      // Update the cache after deleting a post
      localStorage.setItem('adminPosts', JSON.stringify(updatedPosts));
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('Failed to delete post');
    }
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  const theme = localStorage.getItem('theme') || 'dark'; // Retrieve theme from localStorage

  return (
    <main className="sm:px-12 px-0">
      <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <AdminPostCard
            key={post.id}
            post={post}
            theme={theme}
            onDelete={handleDeletePost}
          />
        ))}
      </div>
    </main>
  );
};

export default AdminBlogPosts;
