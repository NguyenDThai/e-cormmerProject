/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { RenderAllUser } from "@/components/RenderAllUser";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

export interface AllUser {
  _id?: string;
  name: string;
  email: string;
  role: string;
  address: string;
  phone: string;
}

const AllProfile = () => {
  const [isAllUser, setIsAllUser] = useState<AllUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<AllUser[]>([]);
  const [filterRole, setFilterRole] = useState<string>("all");
  const [loading, setLoading] = useState<string | null>(null);

  const { data: session } = useSession();

  const fetchAllUser = async () => {
    try {
      const response = await fetch("/api/profile/admin");
      const data = await response.json();
      if (response.ok) {
        setIsAllUser(data.allUser);
        setFilteredUsers(data.allUser);
      } else {
        throw new Error("Da co loi xay ra khi lay user cho admin");
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchAllUser();
  }, []);

  useEffect(() => {
    if (filterRole === "all") {
      setFilteredUsers(isAllUser);
    } else {
      setFilteredUsers(isAllUser.filter((user) => user.role === filterRole));
    }
  }, [filterRole, isAllUser]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterRole(e.target.value);
  };

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

      await fetchAllUser();
      toast.success("Phân quyền thành công");
    } catch (error: any) {
      toast.error("Đã xảy ra lỗi khi phân quyền", error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="h-screen">
      <div className="flex justify-center">
        <h1 className="text-center text-2xl font-semibold">
          Danh sách người dùng
        </h1>
        <select
          name="roleFilter"
          className="ml-7 p-2 border rounded"
          value={filterRole}
          onChange={handleFilterChange}
        >
          <option value="all">All</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <RenderAllUser
        user={filteredUsers}
        updateUserRole={handleRoleChange}
        loading={loading}
      />
      <div className="flex justify-center mt-4">
        <Link href="/">
          <Button>Về trang chủ</Button>
        </Link>
      </div>
    </div>
  );
};

export default AllProfile;
