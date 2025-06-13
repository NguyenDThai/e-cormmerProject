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
import { useState } from "react";
import { AllUser } from "@/app/admin/allprofile/page";
import { toast } from "sonner";

export function RenderAllUser({ user }: { user: AllUser[] }) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<string | null>(null);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setLoading(userId);
    try {
      const response = await fetch(`/api/profile/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to update role");
      }

      // Làm mới session nếu đổi vai trò của chính user hiện tại
      if (userId === session?.user?.id) {
        window.location.reload(); // Tạm thời reload, có thể thay bằng signIn
      }

      toast.success("Phan quyen thanh cong");
    } catch (error: any) {
      toast.error("Da xay ra loi khi phan quyen", error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <Table className="max-w-[800px] mx-auto border rounded-lg overflow-hidden mt-11">
      <TableHeader className="bg-gray-100 dark:bg-gray-800">
        <TableRow>
          <TableHead className="w-[200px] px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Họ và tên
          </TableHead>
          <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Email
          </TableHead>
          <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Vai trò
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
        {user.map((user) => (
          <TableRow
            key={user._id}
            className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <TableCell className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="ml-0">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.name}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              {user.email}
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap">
              {session?.user?.role === "admin" ? (
                <Select
                  onValueChange={(value) =>
                    handleRoleChange(user._id as string, value)
                  }
                  defaultValue={user.role}
                  disabled={loading === user._id}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                        : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
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
