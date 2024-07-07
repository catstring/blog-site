import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import '../App.css'; // Ensure this imports the necessary CSS

const EditPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      const res = await fetch(`http://localhost:8000/api/posts/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
      });
      const data = await res.json();
      setTitle(data.title);
      setContent(data.content);
    };

    fetchPost();
  }, [id]);

  const updatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:8000/api/posts/${id}/`, {
        method: 'PUT',
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
        setError(data.detail || 'Update failed');
      }
    } catch (err) {
      setError('An error occurred');
    }
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <div className="expanded-card p-4 flex flex-col justify-between">
      <Link to="/admin-blog-posts" className="absolute top-2 right-2 text-red-500">
          <i className="fa-solid fa-circle-arrow-left"></i>
        </Link>
        <h1 className="text-2xl mb-4">Edit Post</h1>
        {error && <p className="text-red-500">{error}</p>}
        <form className="flex flex-col gap-4 h-full" onSubmit={updatePost}>
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
            Update Post
          </button>
        </form>
      </div>
    </main>
  );
};

export default EditPost;
