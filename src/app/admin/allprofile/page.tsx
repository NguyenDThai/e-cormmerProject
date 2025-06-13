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
  useEffect(() => {
    const fetchAllUser = async () => {
      try {
        const response = await fetch("/api/profile/admin");
        const data = await response.json();
        if (response.ok) {
          setIsAllUser(data.allUser);
        } else {
          throw new Error("Da co loi xay ra khi lay user cho admin");
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchAllUser();
  }, []);

  return (
    <div className="h-screen">
      <h1 className="text-center text-2xl font-semibold">
        Danh sách người dùng
      </h1>
      <RenderAllUser user={isAllUser} />
      <div className="flex justify-center mt-4">
        <Link href="/">
          <Button>Về trang chủ</Button>
        </Link>
      </div>
    </div>
  );
};

export default AllProfile;
