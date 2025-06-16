/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface UserStats {
  totalUsers: number;
  adminCount: number;
  userCount: number;
}
const UserStatistics = () => {
  const [allUser, setAllUser] = useState<UserStats | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/statistics/users");
        const data = await response.json();
        if (response.ok) {
          setAllUser(data);
        } else {
          throw new Error(
            data.error || "Không thể lấy dữ liệu thống kê người dùng"
          );
        }
      } catch (error: any) {
        toast.error(`Lỗi: ${error.message}`);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <svg
            className="w-6 h-6 mr-2 text-indigo-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          Thống kê người dùng
        </h2>

        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-6 shadow-inner">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <p className="text-gray-500 mb-1 flex items-center">
                <svg
                  className="w-4 h-4 mr-1 text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Tổng số
              </p>
              <p className="text-2xl font-bold text-indigo-600">
                {allUser?.totalUsers}
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <p className="text-gray-500 mb-1 flex items-center">
                <svg
                  className="w-4 h-4 mr-1 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Quản trị viên
              </p>
              <p className="text-2xl font-bold text-red-500">
                {allUser?.adminCount}
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <p className="text-gray-500 mb-1 flex items-center">
                <svg
                  className="w-4 h-4 mr-1 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Người dùng
              </p>
              <p className="text-2xl font-bold text-green-500">
                {allUser?.userCount}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStatistics;
