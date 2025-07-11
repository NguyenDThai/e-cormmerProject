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
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  ShieldCheckIcon,
  ShieldIcon,
  UserIcon,
} from "lucide-react";

interface RenderAllUserProps {
  user: AllUser[];
  isAllUser: AllUser[];
  updateUserRole: (userId: string, newRole: string) => Promise<void>;
  loading: string | null;
}

export function RenderAllUser({
  user,
  updateUserRole,
  loading,
  isAllUser,
}: RenderAllUserProps) {
  const { data: session } = useSession();
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 7;

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
    <div className="space-y-6 mt-10">
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <Table className="w-full min-w-[600px] md:min-w-full">
          <TableHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-4 py-3.5 text-left text-sm font-medium text-gray-700 whitespace-nowrap">
                <span className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  Họ và tên
                </span>
              </TableHead>
              <TableHead className="px-4 py-3.5 text-left text-sm font-medium text-gray-700 whitespace-nowrap">
                <span className="flex items-center gap-2">
                  <MailIcon className="h-4 w-4" />
                  Email
                </span>
              </TableHead>
              <TableHead className="hidden sm:table-cell px-4 py-3.5 text-left text-sm font-medium text-gray-700 whitespace-nowrap">
                <span className="flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4" />
                  Địa chỉ
                </span>
              </TableHead>
              <TableHead className="hidden xs:table-cell px-4 py-3.5 text-left text-sm font-medium text-gray-700 whitespace-nowrap">
                <span className="flex items-center gap-2">
                  <PhoneIcon className="h-4 w-4" />
                  Điện thoại
                </span>
              </TableHead>
              <TableHead className="px-4 py-3.5 text-left text-sm font-medium text-gray-700 whitespace-nowrap">
                <span className="flex items-center gap-2">
                  <ShieldIcon className="h-4 w-4" />
                  Vai trò
                </span>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 bg-white">
            {currentUsers.map((user) => (
              <TableRow
                key={user._id}
                className="hover:bg-gray-50/80 transition-colors"
              >
                <TableCell className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 line-clamp-1">
                        {user.name}
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 line-clamp-1">
                  {user.email}
                </TableCell>

                <TableCell className="hidden sm:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-600 line-clamp-1">
                  {user?.address || <span className="text-gray-400">—</span>}
                </TableCell>

                <TableCell className="hidden xs:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                  {user?.phone || <span className="text-gray-400">—</span>}
                </TableCell>

                <TableCell className="px-4 py-4 whitespace-nowrap">
                  {session?.user?.role === "admin" ? (
                    <Select
                      onValueChange={(value) =>
                        updateUserRole(user._id as string, value)
                      }
                      defaultValue={user.role}
                      disabled={loading === user._id}
                    >
                      <SelectTrigger className="w-[120px] bg-white border-gray-300 hover:border-gray-400 focus:ring-2 focus:ring-blue-100 text-sm">
                        <SelectValue placeholder="Vai trò" />
                      </SelectTrigger>
                      <SelectContent className="border-gray-200 bg-white shadow-lg z-[100]">
                        <SelectItem
                          value="admin"
                          className="text-sm hover:bg-blue-50 data-[state=checked]:bg-blue-50 data-[state=checked]:text-blue-600"
                        >
                          <div className="flex items-center gap-2">
                            <ShieldCheckIcon className="h-4 w-4" />
                            Admin
                          </div>
                        </SelectItem>
                        <SelectItem
                          value="user"
                          className="text-sm hover:bg-blue-50 data-[state=checked]:bg-blue-50"
                        >
                          <div className="flex items-center gap-2">
                            <UserIcon className="h-4 w-4" />
                            User
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <span
                      className={`px-3 py-1 inline-flex text-xs font-medium rounded-full 
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

      {/* Phân trang */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="text-sm text-gray-600">
          Hiển thị{" "}
          <span className="font-medium">
            {(currentPage - 1) * usersPerPage + 1}
          </span>{" "}
          -{" "}
          <span className="font-medium">
            {Math.min(currentPage * usersPerPage, currentUsers.length)}
          </span>{" "}
          của <span className="font-medium">{isAllUser.length}</span> kết quả
        </div>

        <nav className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0 flex items-center justify-center cursor-pointer"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <Button
              key={number}
              variant={currentPage === number ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(number)}
              className={`h-8 w-8 p-0 text-sm cursor-pointer ${
                currentPage === number ? "bg-blue-600 text-white" : ""
              }`}
            >
              {number}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              handlePageChange(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className="h-8 w-8 p-0 flex items-center justify-center cursor-pointer"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </nav>
      </div>
    </div>
  );
}
