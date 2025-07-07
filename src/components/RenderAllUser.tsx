import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";
import { AllUser } from "@/app/admin/allprofile/page";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface RenderAllUserProps {
  user: AllUser[];
  updateUserRole: (userId: string, newRole: string) => Promise<void>;
  loading: string | null;
}

export function RenderAllUser({
  user,
  updateUserRole,
  loading,
}: RenderAllUserProps) {
  const { data: session } = useSession();
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

  // Tinh toan du lieu de hien thi phan trang
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = user.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(user.length / usersPerPage);

  // Chuyen trang
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <Table className="w-full min-w-[600px] md:min-w-full max-w-6xl mx-auto border border-gray-100 rounded-lg overflow-hidden shadow-sm bg-white mt-3.5">
          <TableHeader className="bg-gray-50 border-b border-gray-200">
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-3 py-3 md:px-6 md:py-4 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Họ và tên
              </TableHead>
              <TableHead className="px-3 py-3 md:px-6 md:py-4 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Email
              </TableHead>
              <TableHead className="hidden sm:table-cell px-3 py-3 md:px-6 md:py-4 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Địa chỉ
              </TableHead>
              <TableHead className="hidden xs:table-cell px-3 py-3 md:px-6 md:py-4 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Điện thoại
              </TableHead>
              <TableHead className="px-3 py-3 md:px-6 md:py-4 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Vai trò
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-gray-100">
            {currentUsers.map((user) => (
              <TableRow
                key={user._id}
                className="hover:bg-gray-50 transition-colors"
              >
                <TableCell className="px-3 py-3 md:px-6 md:py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 md:h-10 md:w-10 rounded-full bg-blue-50 flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-sm md:text-base">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-2 md:ml-4">
                      <div className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-1">
                        {user.name}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-3 py-3 md:px-6 md:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700 line-clamp-1">
                  {user.email}
                </TableCell>
                <TableCell className="hidden sm:table-cell px-3 py-3 md:px-6 md:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700 line-clamp-1">
                  {user?.address || <span className="text-gray-400">—</span>}
                </TableCell>
                <TableCell className="hidden xs:table-cell px-3 py-3 md:px-6 md:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700">
                  {user?.phone || <span className="text-gray-400">—</span>}
                </TableCell>
                <TableCell className="px-3 py-3 md:px-6 md:py-4 whitespace-nowrap">
                  {session?.user?.role === "admin" ? (
                    <Select
                      onValueChange={(value) =>
                        updateUserRole(user._id as string, value)
                      }
                      defaultValue={user.role}
                      disabled={loading === user._id}
                    >
                      <SelectTrigger className="w-[100px] sm:w-[120px] bg-white border-gray-300 hover:border-gray-400 text-xs sm:text-sm">
                        <SelectValue placeholder="Vai trò" />
                      </SelectTrigger>
                      <SelectContent className="border-gray-200 bg-white shadow-lg">
                        <SelectItem
                          value="admin"
                          className="text-xs sm:text-sm hover:bg-blue-50 text-blue-600"
                        >
                          Admin
                        </SelectItem>
                        <SelectItem
                          value="user"
                          className="text-xs sm:text-sm hover:bg-blue-50"
                        >
                          User
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <span
                      className={`px-2 py-1 sm:px-3 sm:py-1.5 inline-flex text-xs font-medium rounded-full 
                  ${
                    user.role === "admin"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                    >
                      {user.role === "admin" ? "Quản trị" : "Thành viên"}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Phân trang - Responsive */}
      <div className="flex items-center justify-between px-2 sm:px-4 py-3 bg-white rounded-b-lg">
        <div className="flex-1 flex items-center justify-center sm:justify-between">
          <div className="hidden sm:block">
            <p className="text-xs sm:text-sm text-gray-700">
              Hiển thị{" "}
              <span className="font-medium">
                {(currentPage - 1) * usersPerPage + 1}
              </span>{" "}
              đến{" "}
              <span className="font-medium">
                {Math.min(currentPage * usersPerPage, currentUsers.length)}
              </span>{" "}
              trong tổng số{" "}
              <span className="font-medium">{currentUsers.length}</span> người
              dùng
            </p>
          </div>
          <div>
            <nav className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-2 py-1 text-xs sm:text-sm"
              >
                Trước
              </Button>

              {/* Hiển thị ít nút trang hơn trên mobile */}
              {totalPages <= 5 ? (
                Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (number) => (
                    <Button
                      key={number}
                      variant={currentPage === number ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(number)}
                      className={`px-2 py-1 text-xs sm:text-sm ${
                        currentPage === number ? "bg-blue-600 text-white" : ""
                      }`}
                    >
                      {number}
                    </Button>
                  )
                )
              ) : (
                <>
                  {currentPage > 2 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="px-2 py-1 text-xs sm:text-sm"
                      disabled
                    >
                      ...
                    </Button>
                  )}
                  {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                    let pageNum;
                    if (currentPage === 1) {
                      pageNum = i + 1;
                    } else if (currentPage === totalPages) {
                      pageNum = totalPages - 2 + i;
                    } else {
                      pageNum = currentPage - 1 + i;
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={
                          currentPage === pageNum ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-2 py-1 text-xs sm:text-sm ${
                          currentPage === pageNum
                            ? "bg-blue-600 text-white"
                            : ""
                        }`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  {currentPage < totalPages - 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="px-2 py-1 text-xs sm:text-sm"
                      disabled
                    >
                      ...
                    </Button>
                  )}
                </>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handlePageChange(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="px-2 py-1 text-xs sm:text-sm"
              >
                Sau
              </Button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
