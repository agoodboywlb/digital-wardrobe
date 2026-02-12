import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

/**
 * Protected Route Component
 * Redirects to login page if user is not authenticated
 */
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login', { replace: true });
        }
    }, [user, loading, navigate]);

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>加载中...</p>
            </div>
        );
    }

    // Only render children if user is authenticated
    return user ? <>{children}</> : null;
};
