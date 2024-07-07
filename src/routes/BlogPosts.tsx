import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css'; // Import the CSS file for custom styles

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

const extractFirstImageUrl = (content: string): string | null => {
  const match = content.match(/!\[.*?\]\((.*?)\)/);
  return match ? match[1] : null;
};

const BlogPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/posts/?search=${searchQuery}`);
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
  }, [searchQuery]);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl mb-4">Blog Posts</h1>
      <div className="flex justify-center mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search"
          className="w-full max-w-md pl-5 p-2 border border-gray-300 rounded-full shadow-md"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
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
