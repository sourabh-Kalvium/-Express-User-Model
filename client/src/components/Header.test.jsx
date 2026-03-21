import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Header from './Header';
import { useAuth } from '../context/AuthContext';

// Mock the useAuth hook
vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders branding and home link by default', () => {
    // Setup mock state for unauthenticated user
    useAuth.mockReturnValue({
      user: null,
      isAuthenticated: () => false,
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    // Use getByRole and getByText as required
    expect(screen.getByText(/WrongLogo/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Home/i })).toBeInTheDocument();
  });

  it('renders login and register links when not authenticated', () => {
    useAuth.mockReturnValue({
      user: null,
      isAuthenticated: () => false,
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    // Verify guest links
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByText(/Register/i)).toBeInTheDocument();
    
    // Verify dashboard is NOT visible
    expect(screen.queryByText(/Dashboard/i)).not.toBeInTheDocument();
  });

  it('renders dashboard and user name when authenticated', () => {
    useAuth.mockReturnValue({
      user: { name: 'John Doe', email: 'john@example.com' },
      isAuthenticated: () => true,
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    // Verify authenticated elements
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Hi, John/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();

    // Verify login link is NOT visible
    expect(screen.queryByText(/Login/i)).not.toBeInTheDocument();
  });
});
