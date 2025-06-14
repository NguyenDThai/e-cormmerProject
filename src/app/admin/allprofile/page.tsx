"use client";
import { RenderAllUser } from "@/components/RenderAllUser";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

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

  useEffect(() => {
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
      <RenderAllUser user={filteredUsers} />
      <div className="flex justify-center mt-4">
        <Link href="/">
          <Button>Về trang chủ</Button>
        </Link>
      </div>
    </div>
  );
};

export default AllProfile;
