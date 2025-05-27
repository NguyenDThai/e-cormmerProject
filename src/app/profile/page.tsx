"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
};
const Profile = () => {
  const [user, setUser] = useState<User>({});
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const responese = await fetch("/api/profile");
        const data = await responese.json();
        console.log(data);
        if (responese.ok) {
          setUser(data.users);
        } else {
          throw new Error("Khong nhan duoc user");
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchUser();
  }, []);
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6 mt-10">
      <h1 className="text-center text-3xl font-bold text-gray-800 mb-6">
        Profile Page
      </h1>

      <div className="space-y-4">
        <div className="flex items-center">
          <span className="text-lg font-medium text-gray-700 w-24">Name:</span>
          <span className="text-lg text-gray-900 px-3 py-1 bg-gray-100 rounded">
            {user.name}
          </span>
        </div>

        <div className="flex items-center">
          <span className="text-lg font-medium text-gray-700 w-24">Email:</span>
          <span className="text-lg text-gray-900 px-3 py-1 bg-gray-100 rounded">
            {user.email}
          </span>
        </div>
        <div className="flex items-center">
          <span className="text-lg font-medium text-gray-700 w-24">
            Vai tro:
          </span>
          <span className="text-lg text-gray-900 px-3 py-1 bg-gray-100 rounded">
            {user.role}
          </span>
        </div>
      </div>
      <Link href="/">
        <Button className="mt-5">Ve trang chu</Button>
      </Link>
    </div>
  );
};

export default Profile;
