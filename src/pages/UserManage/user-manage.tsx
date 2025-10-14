import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import { Modal } from "../../components/ui/modal";
import { UserIcon } from "../../icons";
import RoleBadge from "../../components/ui/badge/RoleBadge";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  createdAt: string;
}

export default function UserManage() {
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Super Admin",
      email: "superadmin@besphere.com",
      role: "Super Admin",
      status: "active",
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      name: "John Doe",
      email: "john.doe@besphere.com",
      role: "Admin",
      status: "active",
      createdAt: "2024-02-20",
    },
    {
      id: "3",
      name: "Jane Smith",
      email: "jane.smith@besphere.com",
      role: "User",
      status: "inactive",
      createdAt: "2024-03-10",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    status: "active" as "active" | "inactive",
  });

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddUser = () => {
    setIsEditMode(false);
    setCurrentUser(null);
    setFormData({
      name: "",
      email: "",
      role: "",
      status: "active",
    });
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setIsEditMode(true);
    setCurrentUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    setIsModalOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((user) => user.id !== userId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditMode && currentUser) {
      // Update existing user
      setUsers(
        users.map((user) =>
          user.id === currentUser.id
            ? { ...user, ...formData }
            : user
        )
      );
    } else {
      // Add new user
      const newUser: User = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setUsers([...users, newUser]);
    }

    setIsModalOpen(false);
    setFormData({
      name: "",
      email: "",
      role: "",
      status: "active",
    });
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? { ...user, status: user.status === "active" ? "inactive" : "active" }
          : user
      )
    );
  };

  return (
    <>
      <PageMeta
        title="User Management | Be-Sphere"
        description="Manage users and their permissions in Be-Sphere"
      />
      <PageBreadcrumb  pageTitle="User Management" className="mb-6" />
      {/* Count user section */}
      <div className="flex items-center justify-between mb-6 gap-4">
        {/* User count card */}
        <div className="flex w-full items-center justify-between bg-white dark:bg-[#171A2A]/70 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
            {/* Icon */}
            <div className="flex items-center gap-2">
                <UserIcon className="text-gray-800 size-6 dark:text-white/90" />
                <h1 className="text-lg font-medium text-gray-700 dark:text-gray-200">Total User</h1>
            </div>
            <h1 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            {users.length}
            </h1>
        </div>
        {/* Admin count card */}
        <div className="flex w-full items-center justify-between bg-white dark:bg-[#171A2A]/70 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2">
                <UserIcon className="text-gray-800 size-6 dark:text-white/90" />
                <h1 className="text-lg font-medium text-gray-700 dark:text-gray-200">Total Admin</h1>
            </div>
            <h1 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            {users.filter((user) => user.role === "Admin").length}
            </h1>
        </div>            
        {/* Operator count card */}
        <div className="flex w-full items-center justify-between bg-white dark:bg-[#171A2A]/70 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2">
                <UserIcon className="text-gray-800 size-6 dark:text-white/90" />
                <h1 className="text-lg font-medium text-gray-700 dark:text-gray-200">Total Operator</h1>
            </div>
            <h1 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            {users.filter((user) => user.role === "Operator").length}
            </h1>
        </div>
      </div>
      {/* User List */}
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard
          title="User List"
          desc="Manage all users in the system"
        >
          {/* Search and Add Button */}
          <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1 max-w-md">
              <Input
                type="text"
                placeholder="Search by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              onClick={handleAddUser}
              startIcon={
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 4.16669V15.8334M4.16669 10H15.8334"
                    stroke="currentColor"
                    strokeWidth="1.67"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            >
              Add User
            </Button>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Created At
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                    >
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                    >
                      <td className="px-4 py-4 text-sm text-gray-800 dark:text-white/90">
                        {user.name}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {user.email}
                      </td>
                      <td className="px-4 py-4">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => handleToggleStatus(user.id)}
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            user.status === "active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                          }`}
                        >
                          {user.status}
                        </button>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg dark:text-blue-400 dark:hover:bg-blue-900/20"
                            title="Edit"
                          >
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 18 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M8.25 3H3C2.58579 3 2.25 3.33579 2.25 3.75V15C2.25 15.4142 2.58579 15.75 3 15.75H14.25C14.6642 15.75 15 15.4142 15 15V9.75M13.5 2.25L15.75 4.5M6.75 11.25L15.75 2.25"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg dark:text-red-400 dark:hover:bg-red-900/20"
                            title="Delete"
                          >
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 18 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M3.75 4.5H14.25M7.5 8.25V12.75M10.5 8.25V12.75M2.25 4.5H15.75M13.5 4.5V14.25C13.5 14.6642 13.1642 15 12.75 15H5.25C4.83579 15 4.5 14.6642 4.5 14.25V4.5M6 4.5V3C6 2.58579 6.33579 2.25 6.75 2.25H11.25C11.6642 2.25 12 2.58579 12 3V4.5"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </ComponentCard>
      </div>

      {/* Add/Edit User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="max-w-2xl mx-4"
      >
        <div className="p-6 sm:p-8">
          <h2 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {isEditMode ? "Edit User" : "Add New User"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <Label htmlFor="name">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter user name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="user@besphere.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="role">
                  Role <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="role"
                  name="role"
                  type="text"
                  placeholder="e.g., Admin, User, Manager"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      checked={formData.status === "active"}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-brand-500 border-gray-300 focus:ring-brand-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Active
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="inactive"
                      checked={formData.status === "inactive"}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-brand-500 border-gray-300 focus:ring-brand-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Inactive
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <Button type="submit" className="flex-1">
                {isEditMode ? "Update User" : "Create User"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
