import { useState, useMemo, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import { Modal } from "../../components/ui/modal";
import { UserIcon, PencilIcon, TrashBinIcon, PlusIcon } from "../../icons";
import RoleBadge from "../../components/ui/badge/RoleBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import PaginationWithIcon from "../../components/tables/DataTables/TableOne/PaginationWithIcon";
import ProtectedRoute from "../../components/common/ProtectedRoute";
import userService, { User, CreateUserData, UpdateUserData, Role } from "../../services/userService";

// Remove duplicate User interface since it's imported from userService

export default function UserManage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    nik: "",
    phone_number: "",
    role_id: "",
    department_id: "",
    is_active: true,
  });

  // Load data on component mount
  useEffect(() => {
    loadUsers();
    loadRoles();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const response = await userService.getUsers();
      setUsers(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRoles = async () => {
    try {
      const response = await userService.getAvailableRoles();
      setRoles(response.data);
    } catch (err: any) {
      console.error('Failed to load roles:', err);
    }
  };

  // Calculate stats
  const stats = useMemo(() => {
    const total = users.length;
    const activeUsers = users.filter(user => user.is_active).length;
    const adminUsers = users.filter(user => 
      user.role.slug === 'admin' || user.role.slug === 'superadmin'
    ).length;

    return { total, activeUsers, adminUsers };
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentData = filteredUsers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'radio' ? value === 'true' : (type === 'checkbox' ? (e.target as HTMLInputElement).checked : value),
    }));
  };

  const handleAddUser = () => {
    setIsEditMode(false);
    setCurrentUser(null);
    setFormData({
      name: "",
      email: "",
      username: "",
      password: "",
      nik: "",
      phone_number: "",
      role_id: "",
      department_id: "",
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setIsEditMode(true);
    setCurrentUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      username: user.username,
      password: "",
      nik: user.nik || "",
      phone_number: user.phone_number || "",
      role_id: user.role.id.toString(),
      department_id: user.department?.id.toString() || "",
      is_active: user.is_active,
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        await userService.deleteUser(userToDelete.id);
        setUsers(users.filter((user) => user.id !== userToDelete.id));
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditMode && currentUser) {
        // Update existing user
        const updateData: UpdateUserData = {
          name: formData.name,
          email: formData.email,
          username: formData.username,
          nik: formData.nik,
          phone_number: formData.phone_number,
          is_active: formData.is_active,
        };

        // Only include password if provided
        if (formData.password) {
          updateData.password = formData.password;
        }

        const response = await userService.updateUser(currentUser.id, updateData);
        setUsers(users.map(user => user.id === currentUser.id ? response.data : user));
      } else {
        // Add new user
        const createData: CreateUserData = {
          name: formData.name,
          email: formData.email,
          username: formData.username,
          password: formData.password,
          nik: formData.nik,
          phone_number: formData.phone_number,
          role_id: parseInt(formData.role_id),
          department_id: formData.department_id ? parseInt(formData.department_id) : undefined,
        };

        const response = await userService.createUser(createData);
        setUsers([...users, response.data]);
      }

      setIsModalOpen(false);
      setFormData({
        name: "",
        email: "",
        username: "",
        password: "",
        nik: "",
        phone_number: "",
        role_id: "",
        department_id: "",
        is_active: true,
      });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleToggleStatus = async (userId: number) => {
    try {
      const user = users.find(u => u.id === userId);
      if (user) {
        const updateData: UpdateUserData = {
          is_active: !user.is_active
        };
        const response = await userService.updateUser(userId, updateData);
        setUsers(users.map(u => u.id === userId ? response.data : u));
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <PageMeta
        title="User Management | Sphere"
        description="Manage users and their permissions in Sphere"
      />
      <PageBreadcrumb pageTitle="User Management" className="mb-6" />

      {/* Header */}
      <div className="mb-8">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
            {error}
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-500/20 rounded-xl">
                <div className="text-blue-600 dark:text-blue-400">
                  <UserIcon />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
                <p className="text-2xl font-semibold text-gray-800 dark:text-white/90">{stats.total}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 dark:bg-green-500/20 rounded-xl">
                <div className="text-green-600 dark:text-green-400">
                  <UserIcon />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Active Users</p>
                <p className="text-2xl font-semibold text-gray-800 dark:text-white/90">{stats.activeUsers}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-500/20 rounded-xl">
                <div className="text-purple-600 dark:text-purple-400">
                  <UserIcon />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Admin Users</p>
                <p className="text-2xl font-semibold text-gray-800 dark:text-white/90">{stats.adminUsers}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content Card */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        {/* Header with Add Button */}
        <div className="flex flex-col gap-5 px-6 py-5 border-b border-gray-200 dark:border-gray-800 sm:flex-row sm:justify-between">
          <div className="w-full">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">User List</h3>
            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">Manage all users in the system</p>
          </div>
          <div className="flex items-start w-full gap-3 sm:justify-end">
            <button
              onClick={handleAddUser}
              className="inline-flex items-center gap-2 rounded-lg border border-purple-600 bg-purple-600 px-4 py-2.5 text-theme-sm font-medium text-white shadow-theme-xs hover:bg-purple-700 hover:text-white"
            >
              <PlusIcon />
              Add User
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="p-6">
          <div className="overflow-hidden bg-white dark:bg-white/[0.03] rounded-xl">
            <div className="flex flex-col gap-2 px-4 py-4 border border-b-0 border-gray-100 dark:border-white/[0.05] rounded-t-xl sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="text-gray-500 dark:text-gray-400"> Show </span>
                <div className="relative z-20 bg-transparent">
                  <select
                    className="w-full py-2 pl-3 pr-8 text-sm text-gray-800 bg-transparent border border-gray-300 rounded-lg appearance-none dark:bg-dark-900 h-9 bg-none shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  >
                    {[5, 8, 10].map((value) => (
                      <option
                        key={value}
                        value={value}
                        className="text-gray-500 dark:bg-gray-900 dark:text-gray-400"
                      >
                        {value}
                      </option>
                    ))}
                  </select>
                  <span className="absolute z-30 text-gray-500 -translate-y-1/2 right-2 top-1/2 dark:text-gray-400">
                    <svg
                      className="stroke-current"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.8335 5.9165L8.00016 10.0832L12.1668 5.9165"
                        stroke=""
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
                <span className="text-gray-500 dark:text-gray-400"> entries </span>
              </div>

              <div className="relative">
                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none left-4 top-1/2 dark:text-gray-400">
                  <svg
                    className="fill-current"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.04199 9.37363C3.04199 5.87693 5.87735 3.04199 9.37533 3.04199C12.8733 3.04199 15.7087 5.87693 15.7087 9.37363C15.7087 12.8703 12.8733 15.7053 9.37533 15.7053C5.87735 15.7053 3.04199 12.8703 3.04199 9.37363ZM9.37533 1.54199C5.04926 1.54199 1.54199 5.04817 1.54199 9.37363C1.54199 13.6991 5.04926 17.2053 9.37533 17.2053C11.2676 17.2053 13.0032 16.5344 14.3572 15.4176L17.1773 18.238C17.4702 18.5309 17.945 18.5309 18.2379 18.238C18.5308 17.9451 18.5309 17.4703 18.238 17.1773L15.4182 14.3573C16.5367 13.0033 17.2087 11.2669 17.2087 9.37363C17.2087 5.04817 13.7014 1.54199 9.37533 1.54199Z"
                      fill=""
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, email, or role..."
                  className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-11 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[300px]"
                />
              </div>
            </div>

            <div className="max-w-full overflow-x-auto custom-scrollbar">
              <div>
                <Table>
                  <TableHeader className="border-t border-gray-100 dark:border-white/[0.05]">
                    <TableRow>
                      <TableCell
                        isHeader
                        className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"
                      >
                        <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                          No
                        </p>
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"
                      >
                        <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                          Name
                        </p>
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"
                      >
                        <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                          Email
                        </p>
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"
                      >
                        <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                          Role
                        </p>
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"
                      >
                        <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                          Status
                        </p>
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"
                      >
                        <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                          Last Login At
                        </p>
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"
                      >
                        <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                          Actions
                        </p>
                      </TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentData.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                        >
                          No users found
                        </td>
                      </tr>
                    ) : (
                      currentData.map((user, index) => (
                        <TableRow key={user.id}>
                          <TableCell className="px-4 py-3 border border-gray-100 dark:border-white/[0.05] whitespace-nowrap">
                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                              {startIndex + index + 1}
                            </span>
                          </TableCell>
                          <TableCell className="px-4 py-3 border border-gray-100 dark:border-white/[0.05] whitespace-nowrap">
                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                              {user.name}
                            </span>
                          </TableCell>
                          <TableCell className="px-4 py-3 font-normal dark:text-gray-400/90 text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm whitespace-nowrap">
                            {user.email}
                          </TableCell>
                          <TableCell className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]">
                            <RoleBadge role={user.role.name} />
                          </TableCell>
                          <TableCell className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]">
                            <button
                              onClick={() => handleToggleStatus(user.id)}
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${user.is_active
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                                }`}
                            >
                              {user.is_active ? "active" : "inactive"}
                            </button>
                          </TableCell>
                          <TableCell className="px-4 py-3 font-normal dark:text-gray-400/90 text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm whitespace-nowrap">
                            {user.last_login_at ? new Date(user.last_login_at).toLocaleDateString() : 'Never'}
                          </TableCell>
                          <TableCell className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]">
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleEditUser(user)}
                                className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 transition-colors"
                                title="Edit user"
                              >
                                <PencilIcon />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(user)}
                                className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                                title="Delete user"
                              >
                                <TrashBinIcon />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="border border-t-0 rounded-b-xl border-gray-100 py-4 pl-[18px] pr-4 dark:border-white/[0.05]">
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between">
                {/* Left side: Showing entries */}
                <div className="pb-3 xl:pb-0">
                  <p className="pb-3 text-sm font-medium text-center text-gray-500 border-b border-gray-100 dark:border-gray-800 dark:text-gray-400 xl:border-b-0 xl:pb-0 xl:text-left">
                    Showing {startIndex + 1} to {endIndex} of {totalItems} entries
                  </p>
                </div>
                <PaginationWithIcon
                  totalPages={totalPages}
                  initialPage={currentPage}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="max-w-4xl mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="p-4 sm:p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white/90">
            {isEditMode ? "Edit User" : "Add New User"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Row 1: Name and Email */}
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
                  placeholder="user@sphere.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1.5"
                />
              </div>

              {/* Row 2: Username and Password */}
              <div>
                <Label htmlFor="username">
                  Username <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="mt-1.5"
                />
              </div>

              <div>
                {!isEditMode ? (
                  <>
                    <Label htmlFor="password">
                      Password <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="mt-1.5"
                    />
                  </>
                ) : (
                  <>
                    <Label htmlFor="password">
                      New Password (leave empty to keep current)
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter new password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="mt-1.5"
                    />
                  </>
                )}
              </div>

              {/* Row 3: Role and NIK */}
              <div>
                <Label htmlFor="role_id">
                  Role <span className="text-red-500">*</span>
                </Label>
                <select
                  id="role_id"
                  name="role_id"
                  value={formData.role_id}
                  onChange={handleInputChange}
                  className="mt-1.5 w-full py-2 pl-3 pr-8 text-sm text-gray-800 bg-transparent border border-gray-300 rounded-lg appearance-none dark:bg-dark-900 h-9 bg-none shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                >
                  <option value="">Select a role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="nik">NIK</Label>
                <Input
                  id="nik"
                  name="nik"
                  type="text"
                  placeholder="Enter NIK"
                  value={formData.nik}
                  onChange={handleInputChange}
                  className="mt-1.5"
                />
              </div>

              {/* Row 4: Phone Number and Status */}
              <div>
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  type="text"
                  placeholder="Enter phone number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="is_active">Status</Label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="is_active"
                      value="true"
                      checked={formData.is_active === true}
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
                      name="is_active"
                      value="false"
                      checked={formData.is_active === false}
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        className="max-w-md mx-4"
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20">
            <TrashBinIcon className="text-red-600 dark:text-red-400" />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-center text-gray-800 dark:text-white/90">
            Delete User
          </h2>
          <p className="mb-2 text-sm text-center text-gray-500 dark:text-gray-400">
            Are you sure you want to delete this user?
          </p>
          {userToDelete && (
            <div className="mb-6 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userToDelete.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {userToDelete.email}
              </p>
            </div>
          )}
          <p className="mb-6 text-xs text-center text-gray-500 dark:text-gray-400">
            This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmDelete}
              className="flex-1 bg-red-600 hover:bg-red-700 border-red-600 hover:border-red-700"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </ProtectedRoute>
  );
}