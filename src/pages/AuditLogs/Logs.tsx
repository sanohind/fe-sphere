import { useState, useMemo, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import PaginationWithIcon from "../../components/tables/DataTables/TableOne/PaginationWithIcon";
import ProtectedRoute from "../../components/common/ProtectedRoute";

interface AuditLog {
  id: number;
  user_id: number;
  action: string;
  entity_type: string;
  entity_id: number;
  old_values: string | null;
  new_values: string | null;
  ip_address: string;
  browser: string;
  created_at: string;
}

export default function Logs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Load data on component mount
  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call when backend is ready
      // const response = await auditService.getLogs();
      // setLogs(response.data);
      
      // Mock data for now
      const mockLogs: AuditLog[] = [
        {
          id: 1,
          user_id: 101,
          action: "CREATE",
          entity_type: "User",
          entity_id: 25,
          old_values: null,
          new_values: JSON.stringify({ name: "John Doe", email: "john@example.com" }),
          ip_address: "192.168.1.100",
          browser: "Chrome 120.0",
          created_at: "2025-01-15T10:30:00Z"
        },
        {
          id: 2,
          user_id: 102,
          action: "UPDATE",
          entity_type: "Project",
          entity_id: 5,
          old_values: JSON.stringify({ status: "pending" }),
          new_values: JSON.stringify({ status: "approved" }),
          ip_address: "192.168.1.101",
          browser: "Firefox 121.0",
          created_at: "2025-01-15T11:45:00Z"
        },
        {
          id: 3,
          user_id: 103,
          action: "DELETE",
          entity_type: "Document",
          entity_id: 42,
          old_values: JSON.stringify({ title: "Old Report", status: "draft" }),
          new_values: null,
          ip_address: "192.168.1.102",
          browser: "Safari 17.2",
          created_at: "2025-01-15T14:20:00Z"
        }
      ];
      setLogs(mockLogs);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLogs = useMemo(() => {
    return logs.filter(
      (log) =>
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.entity_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user_id.toString().includes(searchTerm) ||
        log.ip_address.includes(searchTerm)
    );
  }, [logs, searchTerm]);

  const totalItems = filteredLogs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentData = filteredLogs.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatJSON = (jsonString: string | null) => {
    if (!jsonString) return '-';
    try {
      const obj = JSON.parse(jsonString);
      return JSON.stringify(obj, null, 2);
    } catch {
      return jsonString;
    }
  };

  const getActionBadgeColor = (action: string) => {
    switch (action.toUpperCase()) {
      case 'CREATE':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'UPDATE':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'DELETE':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
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
        title="Audit Logs | Sphere"
        description="View system audit logs and activity history"
      />
      <PageBreadcrumb pageTitle="Audit Logs" className="mb-6" />

      {/* Header */}
      <div className="mb-8">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
            {error}
          </div>
        )}
      </div>

      {/* Main Content Card */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        {/* Header */}
        <div className="flex flex-col gap-5 px-6 py-5 border-b border-gray-200 dark:border-gray-800 sm:flex-row sm:justify-between">
          <div className="w-full">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Audit Logs</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">System activity and change history</p>
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
                  placeholder="Search by action, entity type, user ID, or IP..."
                  className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-11 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[300px]"
                />
              </div>
            </div>

            {/* Table Content */}
            <div className="max-w-full overflow-x-auto custom-scrollbar">
              <Table>
                <TableHeader className="border-t border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell isHeader className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]">
                      <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">No</p>
                    </TableCell>
                    <TableCell isHeader className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]">
                      <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">User ID</p>
                    </TableCell>
                    <TableCell isHeader className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]">
                      <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">Action</p>
                    </TableCell>
                    <TableCell isHeader className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]">
                      <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">Entity Type</p>
                    </TableCell>
                    <TableCell isHeader className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]">
                      <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">Entity ID</p>
                    </TableCell>
                    <TableCell isHeader className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]">
                      <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">Old Values</p>
                    </TableCell>
                    <TableCell isHeader className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]">
                      <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">New Values</p>
                    </TableCell>
                    <TableCell isHeader className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]">
                      <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">IP Address</p>
                    </TableCell>
                    <TableCell isHeader className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]">
                      <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">Browser</p>
                    </TableCell>
                    <TableCell isHeader className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]">
                      <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">Created At</p>
                    </TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentData.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                        No audit logs found
                      </td>
                    </tr>
                  ) : (
                    currentData.map((log, index) => (
                      <TableRow key={log.id}>
                        <TableCell className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]">
                          <span className="text-gray-800 text-theme-sm dark:text-white/90">
                            {startIndex + index + 1}
                          </span>
                        </TableCell>
                        <TableCell className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]">
                          <span className="text-gray-800 text-theme-sm dark:text-white/90">{log.user_id}</span>
                        </TableCell>
                        <TableCell className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getActionBadgeColor(log.action)}`}>
                            {log.action}
                          </span>
                        </TableCell>
                        <TableCell className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]">
                          <span className="text-gray-800 text-theme-sm dark:text-white/90">{log.entity_type}</span>
                        </TableCell>
                        <TableCell className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]">
                          <span className="text-gray-800 text-theme-sm dark:text-white/90">{log.entity_id}</span>
                        </TableCell>
                        <TableCell className="px-4 py-3 border border-gray-100 dark:border-white/[0.05] max-w-xs">
                          <div className="text-xs text-gray-600 dark:text-gray-400 truncate" title={formatJSON(log.old_values)}>
                            {log.old_values ? formatJSON(log.old_values).substring(0, 50) + '...' : '-'}
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 border border-gray-100 dark:border-white/[0.05] max-w-xs">
                          <div className="text-xs text-gray-600 dark:text-gray-400 truncate" title={formatJSON(log.new_values)}>
                            {log.new_values ? formatJSON(log.new_values).substring(0, 50) + '...' : '-'}
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]">
                          <span className="text-gray-800 text-theme-sm dark:text-white/90">{log.ip_address}</span>
                        </TableCell>
                        <TableCell className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]">
                          <span className="text-gray-800 text-theme-sm dark:text-white/90">{log.browser}</span>
                        </TableCell>
                        <TableCell className="px-4 py-3 border border-gray-100 dark:border-white/[0.05] whitespace-nowrap">
                          <span className="text-gray-800 text-theme-sm dark:text-white/90">{formatDate(log.created_at)}</span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
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
    </ProtectedRoute>
  );
}