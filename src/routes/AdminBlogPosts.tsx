import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css'; // Import the CSS file for custom styles

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  view_count: number;
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

const AdminBlogPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const cachedPosts = localStorage.getItem('adminPosts');
        const cachedTime = localStorage.getItem('adminPostsCachedTime');
        const now = new Date().getTime();

        if (cachedPosts && cachedTime && now - parseInt(cachedTime) < 60000) { // Cache duration: 1 minute
          setPosts(JSON.parse(cachedPosts));
        } else {
          const res = await fetch('http://localhost:8000/api/posts/', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access')}`,
            },
          });
          if (!res.ok) {
            throw new Error('Failed to fetch posts');
          }
          const data = await res.json();
          setPosts(data);

          localStorage.setItem('adminPosts', JSON.stringify(data));
          localStorage.setItem('adminPostsCachedTime', now.toString());
        }
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to fetch posts');
      }
    };

    fetchPosts();
  }, []);

  const deletePost = async (postId: number) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/api/posts/${postId}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
      });
      if (res.ok) {
        const updatedPosts = posts.filter(post => post.id !== postId);
        setPosts(updatedPosts);

        // Update the cache after deleting a post
        localStorage.setItem('adminPosts', JSON.stringify(updatedPosts));
      } else {
        throw new Error('Failed to delete post');
      }
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
      <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <div key={post.id} className="group">
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
                <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Link to={`/edit/${post.id}`} className="text-blue-500 hover:text-blue-700">
                    <i className="fa-solid fa-pen-to-square"></i>
                  </Link>
                  <button
                    onClick={() => deletePost(post.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-2 ml-3">
              <h2 className="text-md font-bold">{post.title}</h2>
              <div className="flex items-center space-x-4 pb-6 font-thin text-gray-400">
                <div className="flex items-center space-x-1">
                  <span>{post.view_count} views</span>
                </div>
                <p className="text-sm">{timeAgo(post.created_at)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default AdminBlogPosts;
