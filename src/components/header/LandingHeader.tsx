import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ThemeToggleButton } from "../common/ThemeToggleButton";

const LandingHeader: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 flex w-full bg-white border-gray-200 z-99999 dark:border-gray-800 dark:bg-gray-900 lg:border-b">
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-start lg:border-b-0 lg:px-0 lg:py-4">
          <Link to="/" className="flex items-center">
            <img
              className="dark:hidden"
              src="/images/logo/Logo-sanoh-2.png"
              alt="Logo"
              width={110}
              height={40}
            />
            <img
              className="hidden dark:block"
              src="/images/logo/Logo-sanoh-2-white.png"
              alt="Logo"
              width={110}
              height={40}
            />
          </Link>
        </div>
        
        <div className="flex items-center justify-between w-full gap-4 px-5 py-4 lg:flex lg:justify-end lg:px-0">
          {/* Date and Clock */}
          <div>
            <p className="text-gray-500 dark:text-gray-100 text-sm">{currentTime.toLocaleDateString()}</p>
            <p className="text-gray-500 dark:text-gray-100 text-sm">{currentTime.toLocaleTimeString()}</p>
          </div>
          
          <div className="flex items-center gap-2 2xsm:gap-3">
            {/* Dark Mode Toggler */}
            <ThemeToggleButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;
