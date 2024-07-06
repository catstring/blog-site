import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // Ensure this imports the necessary CSS

const CreatePost: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const createPost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/api/posts/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
        body: JSON.stringify({ title, content }),
      });
      if (res.ok) {
        navigate('/admin-blog-posts');
      } else {
        const data = await res.json();
        setError(data.detail || 'Creation failed');
      }
    } catch (err) {
      setError('An error occurred');
    }
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-4">Create Post</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="expanded-card p-4 flex flex-col justify-between">
        <form className="flex flex-col gap-4 h-full" onSubmit={createPost}>
          <label className="flex flex-col">
            Title
            <input
              className="border p-2"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <label className="flex flex-col flex-grow">
            Content
            <textarea
              className="border p-2 flex-grow"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </label>
          <button className="bg-blue-500 text-white py-2 px-4 mt-4" type="submit">
            Create Post
          </button>
        </form>
      </div>
    </main>
  );
};

export default CreatePost;
