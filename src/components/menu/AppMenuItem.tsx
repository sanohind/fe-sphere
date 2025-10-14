// components/menu/AppMenuItem.tsx
import React from 'react';

export interface AppMenuItemProps {
  id: number | string;
  name: string;
  description: string;
  icon: string;
  color: string;
  path: string;
  onClick?: (path: string) => void;
}

const AppMenuItem: React.FC<AppMenuItemProps> = ({
  name,
  description,
  icon,
  color,
  path,
  onClick
}) => {
  return (
    <button
      onClick={() => onClick?.(path)}
      className="group relative overflow-hidden rounded-lg border border-stroke bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 dark:border-strokedark dark:bg-[#101323]"
    >
      <div className="flex flex-col items-center text-center">
        <div
          className={`${color} mb-3 flex h-16 w-16 items-center justify-center rounded-full text-3xl transition-transform duration-300 group-hover:scale-110`}
        >
          {icon}
        </div>
        <h3 className="text-base font-semibold text-black dark:text-white mb-1">
          {name}
        </h3>
        <p className="text-sm text-body dark:text-white">
          {description}
        </p>
      </div>
    </button>
  );
};

export default AppMenuItem;