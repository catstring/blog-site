import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import MarkdownRenderer from '../MarkdownRenderer';
import '../markdown.css'

// Define the Post type
type Tag = {
  name: string;
};

type Post = {
  id: string;
  title: string;
  content: string;
  tags: Tag[];
  view_count: number;
  created_at: string;
};

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { theme } = useTheme();

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

  const dateOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };

  return (
    <div className="flex justify-center p-8">
      <div className="max-w-3xl w-full">
        <h1 className={`text-3xl ${theme === 'dark' ? 'text-stone-100' : 'text-stone-900'} font-bold`}>{post.title}</h1>
        <div className="mt-2 mb-4">
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
        <div className={`relative max-w-3xl w-full p-6 rounded-lg shadow-md markdown-body ${theme === 'dark' ? 'bg-stone-800 text-stone-100' : 'bg-gray-100 text-black'}`}>
          <MarkdownRenderer
            content={post.content}
          />
        </div>
        <div className="mt-5 flex items-center space-x-4 text-sm font-thin text-stone-400">
          <div className="flex items-center space-x-1">
            <i className="fa-solid fa-eye"></i>
            <span>{post.view_count}</span>
          </div>
          <p className="">Published: {new Date(post.created_at).toLocaleDateString(undefined, dateOptions)}</p>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
