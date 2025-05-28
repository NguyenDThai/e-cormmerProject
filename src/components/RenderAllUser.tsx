import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AllUser } from "@/app/admin/allprofile/page";

export function RenderAllUser({ user }: { user: AllUser[] }) {
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
                {/* Nếu có avatar có thể thêm vào */}
                {/* <div className="flex-shrink-0 h-10 w-10">
              <img className="h-10 w-10 rounded-full" src={user.image} alt="" />
            </div> */}
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
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
