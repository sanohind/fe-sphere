
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import ProfileCard from "../../components/cards/ProfileCard/ProfileCard";
import { MenuCard } from "../../components/menu/MenuCard";
import authService, { User, Project } from "../../services/authService";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";

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
      navigate('/signin');
    } catch (err) {
      console.error('Logout error:', err);
      // Force logout even if API call fails
      navigate('/signin');
    }
  };

  const getProjectIcon = (icon: string) => {
    const iconMap: { [key: string]: string } = {
      'warehouse': 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687',
      'inventory': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687',
      'files': 'https://images.unsplash.com/photo-1758405341470-7e54014b1f4b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687',
      'books': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687',
      'health': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687',
      'weather': 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687',
      'notes': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687',
      'stats': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687'
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
            title={user?.role.name || 'Role'}
            handle={user?.email || 'email@example.com'}
            status="Online"
            contactText="Logout"
            avatarUrl={user?.avatar || "./images/logo/Iki.png"}
            showUserInfo={true}
            enableTilt={false}
            enableMobileTilt={true}
            onContactClick={() => setIsLogoutModalOpen(true)}
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
