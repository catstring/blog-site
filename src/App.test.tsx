import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';

describe('App Component', () => {
  const renderWithProviders = () =>
    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>
    );

  it('renders the NavBar component', () => {
    renderWithProviders();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
