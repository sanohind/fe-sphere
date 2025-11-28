import { useEffect, useMemo, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import { Modal } from "../../components/ui/modal";
import { PencilIcon, PlusIcon, TrashBinIcon } from "../../icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import PaginationWithIcon from "../../components/tables/DataTables/TableOne/PaginationWithIcon";
import ProtectedRoute from "../../components/common/ProtectedRoute";
import departmentService, {
  Department,
  CreateDepartmentData,
  UpdateDepartmentData,
} from "../../services/departmentService";
import { showSuccess, showError } from "../../utils/toast";
import DepartmentManageSkeleton from "../../components/skeletons/DepartmentManageSkeleton";

export default function DepartmentManage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null);
  const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    is_active: true,
  });

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      setIsLoading(true);
      const response = await departmentService.getDepartments();
      setDepartments(response.data);
    } catch (err: any) {
      const errorMsg = err.message || 'Gagal memuat data departemen';
      showError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = useMemo(() => {
    const total = departments.length;
    const active = departments.filter((d) => d.is_active).length;
    return { total, active };
  }, [departments]);

  const filteredDepartments = useMemo(() => {
    return departments.filter(
      (d) =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [departments, searchTerm]);

  const totalItems = filteredDepartments.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentData = filteredDepartments.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "radio" ? (value === "true" ? true : false) : value,
    }));
  };

  const handleAdd = () => {
    setIsEditMode(false);
    setCurrentDepartment(null);
    setFormData({ name: "", code: "", is_active: true });
    setIsModalOpen(true);
  };

  const handleEdit = (department: Department) => {
    setIsEditMode(true);
    setCurrentDepartment(department);
    setFormData({
      name: department.name,
      code: department.code,
      is_active: department.is_active,
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (department: Department) => {
    setDepartmentToDelete(department);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!departmentToDelete) return;
    try {
      await departmentService.deleteDepartment(departmentToDelete.id);
      setDepartments(departments.filter((d) => d.id !== departmentToDelete.id));
      showSuccess(`Department "${departmentToDelete.name}" has been deleted successfully`);
      setIsDeleteModalOpen(false);
      setDepartmentToDelete(null);
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to delete department';
      showError(errorMsg);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode && currentDepartment) {
        const updateData: UpdateDepartmentData = {
          name: formData.name,
          code: formData.code,
          is_active: formData.is_active,
        };
        const response = await departmentService.updateDepartment(
          currentDepartment.id,
          updateData
        );
        setDepartments(
          departments.map((d) => (d.id === currentDepartment.id ? response.data : d))
        );
        showSuccess(`Department "${formData.name}" has been updated successfully`);
      } else {
        const createData: CreateDepartmentData = {
          name: formData.name,
          code: formData.code,
          is_active: formData.is_active,
        };
        const response = await departmentService.createDepartment(createData);
        setDepartments([...departments, response.data]);
        showSuccess(`Department "${formData.name}" has been added successfully`);
      }

      setIsModalOpen(false);
      setFormData({ name: "", code: "", is_active: true });
    } catch (err: any) {
      const errorMsg = err.message || `Gagal ${isEditMode ? 'memperbarui' : 'menambahkan'} departemen`;
      showError(errorMsg);
    }
  };

  if (isLoading) {
    return <DepartmentManageSkeleton />;
  }

  return (
    <ProtectedRoute requiredRole="superadmin">
      <PageMeta title="Department Management | Sphere" description="Manage departments in Sphere" />
      <PageBreadcrumb pageTitle="Department Management" className="mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-500/20 rounded-xl" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Departments</p>
                <p className="text-2xl font-semibold text-gray-800 dark:text-white/90">{stats.total}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 dark:bg-green-500/20 rounded-xl" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>
                <p className="text-2xl font-semibold text-gray-800 dark:text-white/90">{stats.active}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col gap-5 px-6 py-5 border-b border-gray-200 dark:border-gray-800 sm:flex-row sm:justify-between">
          <div className="w-full">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Department List</h3>
          </div>
          <div className="flex items-start w-full gap-3 sm:justify-end">
            <button
              onClick={handleAdd}
              className="inline-flex items-center gap-2 rounded-lg border border-[#2a31d8] bg-[#2a31d8] px-4 py-2.5 text-theme-sm font-medium text-white shadow-theme-xs hover:bg-[#1B208A] hover:text-white"
            >
              <PlusIcon />
              Add Department
            </button>
          </div>
        </div>

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
                      <option key={value} value={value} className="text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
                <span className="text-gray-500 dark:text-gray-400"> entries </span>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or code..."
                  className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 px-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[300px]"
                />
              </div>
            </div>

            <div className="max-w-full overflow-x-auto custom-scrollbar">
              <div>
                <Table>
                  <TableHeader className="border-t border-gray-100 dark:border-white/[0.05]">
                    <TableRow>
                      <TableCell isHeader className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"><p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">No</p></TableCell>
                      <TableCell isHeader className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"><p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">Name</p></TableCell>
                      <TableCell isHeader className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"><p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">Code</p></TableCell>
                      <TableCell isHeader className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"><p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">Status</p></TableCell>
                      <TableCell isHeader className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"><p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">Actions</p></TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentData.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">No departments found</td>
                      </tr>
                    ) : (
                      currentData.map((department, index) => (
                        <TableRow key={department.id}>
                          <TableCell className="px-4 py-3 border border-gray-100 dark:border-white/[0.05] whitespace-nowrap"><span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">{startIndex + index + 1}</span></TableCell>
                          <TableCell className="px-4 py-3 border border-gray-100 dark:border-white/[0.05] whitespace-nowrap"><span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">{department.name}</span></TableCell>
                          <TableCell className="px-4 py-3 font-normal dark:text-gray-400/90 text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm whitespace-nowrap">{department.code}</TableCell>
                          <TableCell className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"><span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${department.is_active ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"}`}>{department.is_active ? "active" : "inactive"}</span></TableCell>
                          <TableCell className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"><div className="flex gap-1"><button onClick={() => handleEdit(department)} className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 transition-colors" title="Edit department"><PencilIcon /></button><button onClick={() => handleDeleteClick(department)} className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors" title="Delete department"><TrashBinIcon /></button></div></TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="border border-t-0 rounded-b-xl border-gray-100 py-4 pl-[18px] pr-4 dark:border-white/[0.05]">
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between">
                <div className="pb-3 xl:pb-0">
                  <p className="pb-3 text-sm font-medium text-center text-gray-500 border-b border-gray-100 dark:border-gray-800 dark:text-gray-400 xl:border-b-0 xl:pb-0 xl:text-left">Showing {startIndex + 1} to {endIndex} of {totalItems} entries</p>
                </div>
                <PaginationWithIcon totalPages={totalPages} initialPage={currentPage} onPageChange={handlePageChange} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white/90">{isEditMode ? "Edit Department" : "Add New Department"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
                <Input id="name" name="name" type="text" placeholder="Enter department name" value={formData.name} onChange={handleInputChange} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="code">Code <span className="text-red-500">*</span></Label>
                <Input id="code" name="code" type="text" placeholder="e.g. WH, LOG" value={formData.code} onChange={handleInputChange} className="mt-1.5" />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="is_active">Status</Label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="is_active" value="true" checked={formData.is_active === true} onChange={handleInputChange} className="w-4 h-4 text-brand-500 border-gray-300 focus:ring-brand-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="is_active" value="false" checked={formData.is_active === false} onChange={handleInputChange} className="w-4 h-4 text-brand-500 border-gray-300 focus:ring-brand-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Inactive</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <Button type="submit" className="flex-1">{isEditMode ? "Update Department" : "Create Department"}</Button>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">Cancel</Button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} className="max-w-md mx-4">
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20">
            <TrashBinIcon className="text-red-600 dark:text-red-400" />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-center text-gray-800 dark:text-white/90">Delete Department</h2>
          <p className="mb-2 text-sm text-center text-gray-500 dark:text-gray-400">Are you sure you want to delete this department?</p>
          {departmentToDelete && (
            <div className="mb-6 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">{departmentToDelete.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{departmentToDelete.code}</p>
            </div>
          )}
          <p className="mb-6 text-xs text-center text-gray-500 dark:text-gray-400">This action cannot be undone.</p>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setIsDeleteModalOpen(false)} className="flex-1">Cancel</Button>
            <Button type="button" onClick={handleConfirmDelete} className="flex-1 bg-red-600 hover:bg-red-700 border-red-600 hover:border-red-700">Delete</Button>
          </div>
        </div>
      </Modal>
    </ProtectedRoute>
  );
}


