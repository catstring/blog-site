import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css'; // You can choose any highlight.js theme

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  tags: { name: string }[];
}

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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
    <div className="p-8">
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <div className="mt-2">
        <div className="flex flex-wrap gap-2">
          {post.tags.map(tag => (
            <span
              key={tag.name}
              className="bg-gray-200 rounded-full px-3 text-sm text-gray-700 cursor-pointer"
              onClick={() => handleTagClick(tag.name)}
            >
              {tag.name}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-5 markdown-body">
        <ReactMarkdown
          children={post.content}
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
        />
      </div>
      <p className="mt-5 text-sm text-gray-600">Created on: {new Date(post.created_at).toLocaleDateString()}</p>
    </div>
  );
};

export default PostDetail;
