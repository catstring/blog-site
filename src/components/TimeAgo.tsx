// src/components/TimeAgo.tsx
import React from 'react';

interface TimeAgoProps {
  dateString: string;
}

const TimeAgo: React.FC<TimeAgoProps> = ({ dateString }) => {
  const timeAgo = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return `${interval} year${interval > 1 ? 's' : ''} ago`;

    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval} month${interval > 1 ? 's' : ''} ago`;

    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval} day${interval > 1 ? 's' : ''} ago`;

    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval} hour${interval > 1 ? 's' : ''} ago`;

    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval} minute${interval > 1 ? 's' : ''} ago`;

    return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
  };

  return <span>{timeAgo(dateString)}</span>;
};

export default TimeAgo;
