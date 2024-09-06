import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import BlogPosts from './BlogPosts';
import useFetchPosts from '../hooks/useFetchPosts';
import { useTheme } from '../contexts/ThemeContext';

vi.mock('../hooks/useFetchPosts');
const mockUseFetchPosts = useFetchPosts as ReturnType<typeof vi.fn>;

vi.mock('../contexts/ThemeContext');
const mockUseTheme = useTheme as ReturnType<typeof vi.fn>;

describe('BlogPosts Component', () => {
    beforeEach(() => {
        mockUseTheme.mockReturnValue({ theme: 'light' });
        mockUseFetchPosts.mockReturnValue({
          posts: [
            {
              id: 1,
              title: 'Test Post 1',
              content: '![image](https://example.com/image1.jpg)',
              tags: [{ name: 'React' }]
            },
            {
              id: 2,
              title: 'Test Post 2',
              content: '![image](https://example.com/image2.jpg)',
              tags: [{ name: 'JavaScript' }]
            }
          ],
          tags: [
            { id: 1, name: 'React' },
            { id: 2, name: 'JavaScript' }
          ],
          error: null,
          selectedTags: [],
          setSelectedTags: vi.fn(),
        });
      });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderWithProviders = () =>
    render(
      <MemoryRouter>
        <BlogPosts searchQuery="" />
      </MemoryRouter>
    );

  it('renders without crashing and displays posts', () => {
    renderWithProviders();
    expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    expect(screen.getByText('Test Post 2')).toBeInTheDocument();
  });

  it('navigates to the homepage when "All" is clicked', () => {
    const { setSelectedTags } = mockUseFetchPosts();

    renderWithProviders();

    fireEvent.click(screen.getByText('All'));

    expect(setSelectedTags).toHaveBeenCalledWith([]);
  });

  it('filters posts based on selected tags', () => {
    const { setSelectedTags } = mockUseFetchPosts();
  
    renderWithProviders();
  
    fireEvent.click(screen.getByText('React'));
  
    const setSelectedTagsCall = setSelectedTags.mock.calls[0][0];
    
    const newTags = setSelectedTagsCall([]);
    
    expect(newTags).toEqual(['React']);
  });
  
});
