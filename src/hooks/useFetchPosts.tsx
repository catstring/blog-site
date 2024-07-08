// src/hooks/useFetchPosts.ts
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  view_count: number;
  tags: { name: string }[];
}

interface Tag {
  id: number;
  name: string;
}

const useFetchPosts = (searchQuery: string) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tag = params.get('tag');
    if (tag) {
      setSelectedTags(tag.split(','));
    }

    const fetchData = async () => {
      try {
        const cachedTags = localStorage.getItem('blogTags');
        const cachedTime = localStorage.getItem('blogCachedTime');
        const now = new Date().getTime();
        const cacheDuration = 60000; // 1 minute cache duration

        const fetchPosts = async () => {
          const response = await fetch(`http://localhost:8000/api/posts/?search=${searchQuery}`);
          if (!response.ok) {
            throw new Error('Failed to fetch posts');
          }
          return response.json();
        };

        const fetchTags = async () => {
          const response = await fetch('http://localhost:8000/api/tags/');
          if (!response.ok) {
            throw new Error('Failed to fetch tags');
          }
          return response.json();
        };

        if (searchQuery) {
          const postsData = await fetchPosts();
          setPosts(postsData);
        } else {
          const cachedPosts = localStorage.getItem('blogPosts');
          if (cachedPosts && cachedTags && cachedTime && (now - parseInt(cachedTime) < cacheDuration)) {
            const postsData = JSON.parse(cachedPosts);
            const tagsData = JSON.parse(cachedTags);
            setPosts(postsData);
            setTags(tagsData);
          } else {
            const [postsData, tagsData] = await Promise.all([fetchPosts(), fetchTags()]);
            setPosts(postsData);
            setTags(tagsData);
            localStorage.setItem('blogPosts', JSON.stringify(postsData));
            localStorage.setItem('blogTags', JSON.stringify(tagsData));
            localStorage.setItem('blogCachedTime', now.toString());
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data');
      }
    };

    fetchData();
  }, [searchQuery, location.search]);

  return { posts, tags, error, selectedTags, setSelectedTags };
};

export default useFetchPosts;
