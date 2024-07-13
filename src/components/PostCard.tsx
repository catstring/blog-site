// src/components/PostCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import TimeAgo from './TimeAgo';

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  view_count: number;
  tags: { name: string }[];
}

interface PostCardProps {
  post: Post;
  theme: string;
}

const extractFirstImageUrl = (content: string): string | null => {
  const match = content.match(/!\[.*?\]\((.*?)\)/);
  return match ? match[1] : null;
};

const PostCard: React.FC<PostCardProps> = ({ post, theme }) => (
  <div>
    <div className="relative w-full" style={{ paddingBottom: '56.25%', height: 0 }}>
      <div className={`absolute top-0 left-0 w-full h-full ${theme === 'dark' ? 'bg-stone-200' : 'bg-stone-200'} sm:rounded-lg overflow-hidden`}>
        <Link to={`/posts/${post.id}`} className="group">
          {extractFirstImageUrl(post.content) ? (
            <img
              src={extractFirstImageUrl(post.content) || ''}
              alt="Post image"
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-stone-400">
              No Image
            </div>
          )}
        </Link>
      </div>
    </div>
    <div className="mt-2 ml-3">
      <h2 className="text-md font-bold">{post.title}</h2>
      <div className={`flex items-center space-x-4 pb-6 font-thin ${theme === 'dark' ? 'text-stone-400' : ' text-gray-600'}`}>
        <div className="flex items-center space-x-1">
          <span>{post.view_count} views</span>
        </div>
        <p className="text-sm"><TimeAgo dateString={post.created_at} /></p>
      </div>
    </div>
  </div>

);

export default PostCard;
