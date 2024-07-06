import React, { useEffect, useState } from 'react';
import '../App.css'; // Import the CSS file for custom styles

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

const BlogPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [expandedPostId, setExpandedPostId] = useState<number | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/posts/');
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

  const handleCardClick = (postId: number) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl mb-4">Blog Posts</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className={`blog-card ${expandedPostId === post.id ? 'expanded' : ''}`}
            onClick={() => handleCardClick(post.id)}
          >
            <div className="p-4 flex flex-col justify-between h-full">
              <div className="aspect-w-4 aspect-h-3">
                <h2 className="text-xl font-bold">{post.title}</h2>
                {expandedPostId === post.id && (
                  <div className="expanded-content">
                    <p>{post.content}</p>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-2">Created on: {new Date(post.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default BlogPosts;
