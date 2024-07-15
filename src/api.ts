import axios from 'axios';

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  view_count: number;
}

const apiClient = axios.create({
  baseURL: process.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchPosts = async (): Promise<Post[]> => {
  const response = await apiClient.get('/posts/', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access')}`,
    },
  });
  return response.data;
};

export const deletePost = async (postId: number): Promise<void> => {
  await apiClient.delete(`/posts/${postId}/`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access')}`,
    },
  });
};

export const createPost = async (title: string, content: string, tags: string[]): Promise<void> => {
  const response = await apiClient.post('/posts/', {
    title,
    content,
    tag_names: tags,
  }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access')}`,
    },
  });

  return response.data;
};

export const fetchPost = async (id: string): Promise<Post> => {
  const response = await apiClient.get(`/posts/${id}/`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access')}`,
    },
  });
  return response.data;
};

export const incrementViewCount = async (id: string): Promise<void> => {
  await apiClient.get(`/posts/${id}/view/`);
};

export const updatePost = async (id: string, title: string, content: string, tags: string[]): Promise<void> => {
  const response = await apiClient.put(`/posts/${id}/`, {
    title,
    content,
    tag_names: tags,
  }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access')}`,
    },
  });

  return response.data;
};
