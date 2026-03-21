import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Login from './Login';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

// Mock dependencies
vi.mock('../context/AuthContext', () => ({
    useAuth: vi.fn(),
}));

vi.mock('../services/api', () => ({
    default: {
        post: vi.fn(),
    },
}));

vi.mock('react-toastify', () => ({
    toast: {
        error: vi.fn(),
    },
}));

describe('Login Interaction Tests', () => {
    const mockLogin = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        useAuth.mockReturnValue({
            login: mockLogin,
        });
    });

    it('should update input values when typing', async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        const emailInput = screen.getByLabelText(/Email/i);
        const passwordInput = screen.getByLabelText(/Password/i);

        // Simulate typing
        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'password123');

        // Assert values
        expect(emailInput.value).toBe('test@example.com');
        expect(passwordInput.value).toBe('password123');
    });

    it('should call the submission handler with correct data on valid submit', async () => {
        const user = userEvent.setup();
        
        // Mock successful API response
        api.post.mockResolvedValue({
            data: {
                token: 'fake-token',
                data: { id: '1', name: 'Test User' }
            }
        });

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        const emailInput = screen.getByLabelText(/Email/i);
        const passwordInput = screen.getByLabelText(/Password/i);
        const submitButton = screen.getByRole('button', { name: /Login/i });

        // Simulate user behavior
        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'password123');
        await user.click(submitButton);

        // Assert API called correctly
        expect(api.post).toHaveBeenCalledTimes(1);
        expect(api.post).toHaveBeenCalledWith('/users/login', {
            email: 'test@example.com',
            password: 'password123',
        });

        // Assert Auth context login called
        expect(mockLogin).toHaveBeenCalledWith({ id: '1', name: 'Test User' }, 'fake-token');
    });

    it('should show an error message and not call the handler when fields are empty', async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        const submitButton = screen.getByRole('button', { name: /Login/i });

        // Click without filling fields
        await user.click(submitButton);

        // Assert error message with role="alert"
        const errorAlert = screen.getByRole('alert');
        expect(errorAlert).toBeInTheDocument();
        expect(errorAlert.textContent).toMatch(/Please enter both email and password/i);

        // Assert API was NOT called
        expect(api.post).not.toHaveBeenCalled();
    });
});
