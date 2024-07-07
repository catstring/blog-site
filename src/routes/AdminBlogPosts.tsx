import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

const AdminBlogPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
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
        setPosts(posts.filter(post => post.id !== postId));
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

  return (
    <main className="px-8">
      <Link to="/create" className="mb-4">
        <i className="fa-solid fa-plus text-6xl mx-5 mb-5"></i>
      </Link>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <div key={post.id} className="group">
            <div className="relative w-full" style={{ paddingBottom: '56.25%', height: 0 }}>
              <div className="absolute top-0 left-0 w-full h-full bg-gray-200 rounded-lg overflow-hidden">
                {/* Placeholder for the image */}
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
            <div className="mt-2">
              <h2 className="text-md font-bold">{post.title}</h2>
              <p className="text-sm text-gray-600">Created on: {new Date(post.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default AdminBlogPosts;
