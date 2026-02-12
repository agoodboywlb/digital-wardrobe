
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../ProtectedRoute';
import { useAuth } from '@/context/AuthContext';

// Mock useAuth
vi.mock('@/context/AuthContext', () => ({
    useAuth: vi.fn(),
}));

describe('ProtectedRoute', () => {
    it('should show loading state', () => {
        (useAuth as any).mockReturnValue({
            user: null,
            loading: true,
        });

        render(
            <MemoryRouter>
                <ProtectedRoute>
                    <div>Protected Content</div>
                </ProtectedRoute>
            </MemoryRouter>
        );

        // Should show loading text
        expect(screen.getByText('加载中...')).toBeDefined();
    });

    it('should show content when user is authenticated', () => {
        (useAuth as any).mockReturnValue({
            user: { id: 'user123' },
            loading: false,
        });

        render(
            <MemoryRouter>
                <ProtectedRoute>
                    <div data-testid="protected-content">Protected Content</div>
                </ProtectedRoute>
            </MemoryRouter>
        );

        expect(screen.getByTestId('protected-content')).toBeDefined();
        expect(screen.queryByText('加载中...')).toBeNull();
    });

    it('should redirect to login when user is not authenticated', () => {
        (useAuth as any).mockReturnValue({
            user: null,
            loading: false,
        });

        render(
            <MemoryRouter initialEntries={['/protected']}>
                <Routes>
                    <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
                    <Route
                        path="/protected"
                        element={
                            <ProtectedRoute>
                                <div>Protected Content</div>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </MemoryRouter>
        );

        // Should redirect to login page
        expect(screen.getByTestId('login-page')).toBeDefined();
        expect(screen.queryByText('Protected Content')).toBeNull();
    });
});
