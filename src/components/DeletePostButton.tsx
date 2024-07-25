import React from 'react';
import { deletePost as deletePostApi } from '../api';

interface DeletePostButtonProps {
  postId: number;
  onSuccess: () => void;
}

const DeletePostButton: React.FC<DeletePostButtonProps> = ({ postId, onSuccess }) => {

  const deletePost = async () => {
    try {
      await deletePostApi(postId);
      onSuccess();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <button onClick={deletePost} className="bg-red-500 text-white py-2 px-4">
      Delete Post
    </button>
  );
};

export default DeletePostButton;
