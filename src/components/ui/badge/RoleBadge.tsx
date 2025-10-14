interface RoleBadgeProps {
  role: string;
  className?: string;
}

const RoleBadge: React.FC<RoleBadgeProps> = ({ role, className = "" }) => {
  // Define role color mappings
  const roleColors: Record<string, { bg: string; text: string; darkBg: string; darkText: string }> = {
    "Super Admin": {
      bg: "bg-green-100",
      text: "text-green-800",
      darkBg: "dark:bg-green-900/30",
      darkText: "dark:text-green-400",
    },
    "Admin": {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      darkBg: "dark:bg-yellow-900/30",
      darkText: "dark:text-yellow-400",
    },
    "Operator": {
      bg: "bg-blue-100",
      text: "text-blue-800",
      darkBg: "dark:bg-blue-900/30",
      darkText: "dark:text-blue-400",
    },
    "User": {
      bg: "bg-gray-100",
      text: "text-gray-800",
      darkBg: "dark:bg-gray-800",
      darkText: "dark:text-gray-400",
    },
  };

  // Get color scheme for the role, default to gray if role not found
  const colorScheme = roleColors[role] || {
    bg: "bg-gray-100",
    text: "text-gray-800",
    darkBg: "dark:bg-gray-800",
    darkText: "dark:text-gray-400",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${colorScheme.bg} ${colorScheme.text} ${colorScheme.darkBg} ${colorScheme.darkText} ${className}`.trim()}
    >
      {role}
    </span>
  );
};

export default RoleBadge;
