import axios from 'axios';

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  view_count: number;
}

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const fetchPosts = async (): Promise<Post[]> => {
  try {
    const response = await apiClient.get('/posts/');
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

export const fetchPost = async (id: string): Promise<Post> => {
  try {
    const response = await apiClient.get(`/posts/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching post with ID ${id}:`, error);
    throw error;
  }
};

export const createPost = async (title: string, content: string, tags: string[]): Promise<void> => {
  try {
    await apiClient.post('/posts/', {
      title,
      content,
      tag_names: tags,
    });
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const updatePost = async (id: string, title: string, content: string, tags: string[]): Promise<void> => {
  try {
    await apiClient.put(`/posts/${id}/`, {
      title,
      content,
      tag_names: tags,
    });
  } catch (error) {
    console.error(`Error updating post with ID ${id}:`, error);
    throw error;
  }
};

export const deletePost = async (postId: number): Promise<void> => {
  try {
    await apiClient.delete(`/posts/${postId}/`);
  } catch (error) {
    console.error(`Error deleting post with ID ${postId}:`, error);
    throw error;
  }
};

export const incrementViewCount = async (id: string): Promise<void> => {
  try {
    await apiClient.get(`/posts/${id}/view/`);
  } catch (error) {
    console.error(`Error incrementing view count for post with ID ${id}:`, error);
    throw error;
  }
};
