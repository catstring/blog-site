// PostDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/posts/${id}/`);
        if (!res.ok) {
          throw new Error('Failed to fetch post');
        }
        const data = await res.json();
        setPost(data);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to fetch post');
      }
    };

    fetchPost();
  }, [id]);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!post) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <div className="mt-5">
        <p>{post.content}</p>
      </div>
      <p className="mt-5 text-sm text-gray-600">Created on: {new Date(post.created_at).toLocaleDateString()}</p>
    </div>
  );
};

export default PostDetail;
