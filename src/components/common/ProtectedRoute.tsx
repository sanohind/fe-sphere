import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import authService from '../../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'superadmin' | 'admin' | 'user';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user has token
        if (!authService.isAuthenticated()) {
          navigate('/signin');
          return;
        }

        // Verify token with backend
        const result = await authService.verifyToken();
        
        if (!result.valid) {
          navigate('/signin');
          return;
        }

        // Check role if required
        if (requiredRole) {
          const user = result.user;
          const userRole = user.role.slug.toLowerCase();
          
          // Role hierarchy: superadmin > admin > user
          const roleLevels = {
            superadmin: 3,
            admin: 2,
            user: 1
          };

          const userLevel = roleLevels[userRole as keyof typeof roleLevels] || 0;
          const requiredLevel = roleLevels[requiredRole];

          if (userLevel < requiredLevel) {
            navigate('/main-menu'); // Redirect to main menu if insufficient permissions
            return;
          }
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        navigate('/signin');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate, requiredRole]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
