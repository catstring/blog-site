import React from 'react';
import { useNavigate } from 'react-router-dom';

interface DeletePostButtonProps {
  postId: number;
}

const DeletePostButton: React.FC<DeletePostButtonProps> = ({ postId }) => {
  const navigate = useNavigate();

  const deletePost = async () => {
    const token = localStorage.getItem('access');
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    try {
      const res = await fetch(`${baseURL}/posts/${postId}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        navigate(0); // Refresh the page to reflect changes
      } else {
        const data = await res.json();
        console.error('Failed to delete post:', data);
      }
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  return (
    <button onClick={deletePost} className="bg-red-500 text-white py-2 px-4">
      Delete Post
    </button>
  );
};

export default DeletePostButton;
