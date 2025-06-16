/* eslint-disable @typescript-eslint/no-explicit-any */
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

  return (
    <Table className="w-full max-w-5xl mx-auto border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mt-6 shadow-sm">
      <TableHeader className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <TableRow>
          <TableHead className="w-[200px] px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
            Họ và tên
          </TableHead>
          <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
            Email
          </TableHead>
          <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
            Địa Chỉ
          </TableHead>
          <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
            Điện Thoại
          </TableHead>
          <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
            Vai trò
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
        {user.map((user) => (
          <TableRow
            key={user._id}
            className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <TableCell className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="ml-0">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {user.name}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
              {user.email}
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
              {user?.address || (
                <span className="text-gray-400 dark:text-gray-500">
                  Chưa cập nhật
                </span>
              )}
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
              {user?.phone || (
                <span className="text-gray-400 dark:text-gray-500">
                  Chưa cập nhật
                </span>
              )}
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap">
              {session?.user?.role === "admin" ? (
                <Select
                  onValueChange={(value) =>
                    updateUserRole(user._id as string, value)
                  }
                  defaultValue={user.role}
                  disabled={loading === user._id}
                >
                  <SelectTrigger className="w-[120px] bg-white dark:bg-gray-800">
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <span
                  className={`px-3 py-1 inline-flex text-sm leading-5 font-medium rounded-full 
                ${
                  user.role === "admin"
                    ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200"
                    : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200"
                }`}
                >
                  {user.role}
                </span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
