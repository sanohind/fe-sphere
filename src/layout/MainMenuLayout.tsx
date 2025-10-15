import { SidebarProvider } from "../context/SidebarContext";
import { Outlet } from "react-router";
import MainMenuHeader from "../components/header/MainMenuHeader";

const MainMenuLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <MainMenuHeader />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainMenuLayout;
