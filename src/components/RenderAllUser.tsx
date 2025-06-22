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
    <Table className="w-full max-w-6xl mx-auto border border-gray-100 rounded-lg overflow-hidden shadow-sm bg-white mt-3.5">
      <TableHeader className="bg-gray-50 border-b border-gray-200">
        <TableRow className="hover:bg-transparent">
          <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
            Họ và tên
          </TableHead>
          <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
            Email
          </TableHead>
          <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
            Địa chỉ
          </TableHead>
          <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
            Điện thoại
          </TableHead>
          <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
            Vai trò
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="bg-white divide-y divide-gray-100">
        {user.map((user) => (
          <TableRow
            key={user._id}
            className="hover:bg-gray-50 transition-colors"
          >
            <TableCell className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <span className="text-blue-600 font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">
                    {user.name}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {user.email}
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {user?.address || <span className="text-gray-400">—</span>}
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {user?.phone || <span className="text-gray-400">—</span>}
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
                  <SelectTrigger className="w-[120px] bg-white border-gray-300 hover:border-gray-400">
                    <SelectValue placeholder="Vai trò" />
                  </SelectTrigger>
                  <SelectContent className="border-gray-200 bg-white shadow-lg">
                    <SelectItem
                      value="admin"
                      className="text-sm hover:bg-blue-50 text-blue-600"
                    >
                      Admin
                    </SelectItem>
                    <SelectItem
                      value="user"
                      className="text-sm hover:bg-blue-50"
                    >
                      User
                    </SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <span
                  className={`px-3 py-1.5 inline-flex text-xs font-medium rounded-full 
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
  );
}
