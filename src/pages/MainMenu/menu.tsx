import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import ProfileCard from "../../components/cards/ProfileCard/ProfileCard";
import { MenuCard } from "../../components/menu/MenuCard";
import authService, { User, Project } from "../../services/authService";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";
import { showSuccess, showError } from "../../utils/toast";

export default function MainMenu() {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setIsLoading(true);
      const data = await authService.getDashboard();
      setUser(data.data.user);
      setProjects(data.data.projects);
    } catch (err: any) {
      setError(err.message);
      // If not authenticated, redirect to login
      if (err.message.includes('401') || err.message.includes('unauthorized')) {
        navigate('/signin');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleProjectClick = async (projectId: string) => {
    try {
      const response = await authService.getProjectUrl(projectId);
      window.open(response.data.url, '_blank');
    } catch (err: any) {
      console.error('Error accessing project:', err);
      alert('Failed to access project. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      showSuccess('You have been successfully logged out. See you soon!', {
        title: 'Logout Successful',
      });
      // Delay navigation slightly to show toast
      setTimeout(() => navigate('/signin'), 500);
    } catch (err) {
      console.error('Logout error:', err);
      showError('Logout process encountered an error, but you will be redirected.', {
        title: 'Logout Error',
      });
      // Force logout even if API call fails
      setTimeout(() => navigate('/signin'), 500);
    }
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const getProjectIcon = (icon: string) => {
    const iconMap: { [key: string]: string } = {
      'warehouse': 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687',
      'truck': 'https://plus.unsplash.com/premium_photo-1663091967607-2e15b89f4d6e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1172',
      'arrival': 'https://images.unsplash.com/photo-1576669801820-a9ab287ac2d1?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'driver': 'https://images.unsplash.com/photo-1757858566554-e1a81ee188c8?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    };
    return iconMap[icon] || iconMap['files'];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadDashboard}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="Sphere Dashboard | SSO Portal"
        description="Access your projects through Sphere SSO portal"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 xl:col-span-4">
          <ProfileCard
            name={user?.name || 'User'}
            title={user?.department?.name 
              ? `${user.role.name} ${user.department.name}` 
              : user?.role.name || 'Role'
            }
            handle={user?.email || 'email@example.com'}
            status="Online"
            contactText="Logout"
            avatarUrl={user?.avatar || "./images/logo/profile.png"}
            showUserInfo={true}
            enableTilt={false}
            enableMobileTilt={true}
            onContactClick={() => setIsLogoutModalOpen(true)}
            onClick={handleProfileClick}
          />
        </div>
        <div className="col-span-12 xl:col-span-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Applications
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Select application to access
            </p>
          </div>
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-300 dark:text-gray-600 text-6xl mb-4">
                📁
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                No Applications Available
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                You don't have access to any applications yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => handleProjectClick(project.id)}
                  className="cursor-pointer"
                >
                  <MenuCard 
                    title={project.name} 
                    description={project.description} 
                    color={project.color} 
                    imageUrl={getProjectIcon(project.icon)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        className="max-w-md mx-4"
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20">
            <span className="text-red-600 dark:text-red-400 text-xl">!</span>
          </div>
          <h2 className="mb-2 text-xl font-semibold text-center text-gray-800 dark:text-white/90">
            Logout
          </h2>
          <p className="mb-6 text-sm text-center text-gray-500 dark:text-gray-400">
            Are you sure you want to log out?
          </p>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsLogoutModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleLogout}
              className="flex-1 bg-red-600 hover:bg-red-700 border-red-600 hover:border-red-700"
            >
              Logout
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}