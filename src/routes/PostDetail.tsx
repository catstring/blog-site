// src/routes/PostDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css'; // You can choose any highlight.js theme
import { useTheme } from '../contexts/ThemeContext';

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  view_count: number;
  tags: { name: string }[];
}

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { theme } = useTheme(); // Retrieve theme from context

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/posts/${id}/`);
        if (!res.ok) {
          throw new Error('Failed to fetch post');
        }
        const data: Post = await res.json();
        setPost(data);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to fetch post');
      }
    };

    fetchPost();

    // Increment view count
    const incrementViewCount = async () => {
      try {
        await fetch(`http://localhost:8000/api/posts/${id}/view/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
      } catch (err) {
        console.error('Error incrementing view count:', err);
      }
    };

    incrementViewCount();
  }, [id]);

  const handleTagClick = (tag: string) => {
    navigate(`/?tag=${tag}`);
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!post) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex justify-center p-8">
      <div className="max-w-3xl w-full">
        <h1 className={`text-3xl ${theme === 'dark' ? 'text-stone-100' : 'text-stone-900'} font-bold`}>{post.title}</h1>
        <div className="mt-2">
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span
                key={tag.name}
                className={`rounded-full px-3 p-2 text-sm cursor-pointer ${theme === 'dark' ? 'bg-stone-700 text-white' : 'bg-stone-200 text-black'}`}
                onClick={() => handleTagClick(tag.name)}
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-2 markdown-body">
          <ReactMarkdown
            children={post.content}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          />
        </div>
        <div className="mt-5 flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-stone-400">
            <i className="fa-solid fa-eye"></i>
            <span>{post.view_count}</span>
          </div>
          <p className="text-sm text-stone-400">Created on: {new Date(post.created_at).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
