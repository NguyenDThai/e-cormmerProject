/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  address?: string;
  phone?: string;
};

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/profile");
        const data = await response.json();
        console.log("Fetched user:", data);
        if (response.ok) {
          setUser(data.users);
          setFormData({
            name: data.users.name || "",
            address: data.users.address || "",
            phone: data.users.phone || "",
          });
        } else {
          throw new Error("Không nhận được user");
        }
      } catch (error: any) {
        console.log("Fetch error:", error);
      }
    };
    fetchUser();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Sending formData:", formData);
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      console.log("PUT response:", result);
      if (response.ok) {
        setUser(result.users);
        setIsEditing(false);
        // Ensure formData is updated with the latest values
        setFormData({
          name: result.users.name || "",
          address: result.users.address || "",
          phone: result.users.phone || "",
        });
        toast.success("Cập nhật thành công");
      } else {
        throw new Error(result.error || "Cập nhật thất bại");
      }
    } catch (error: any) {
      console.log("Client error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center mb-9">
          <h1 className="text-3xl font-bold text-white">Thông tin cá nhân</h1>
        </div>

        {/* Avatar và thông tin cơ bản */}
        <div className="flex flex-col items-center -mt-12">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center shadow-md">
              {user?.avatar ? (
                <Image
                  src={user?.avatar}
                  alt="Avatar"
                  width={96}
                  height={96}
                  className="rounded-full object-cover"
                />
              ) : (
                <span className="text-3xl text-gray-600">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mt-4">
            {user?.name}
          </h2>
        </div>

        {/* Thông tin chi tiết */}
        <div className="p-6 space-y-5">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <svg
                  className="w-5 h-5 text-gray-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Cập nhật thông tin
              </h3>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="text-gray-600 font-medium sm:w-32">
                    Họ và tên:
                  </span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="text-gray-800 sm:flex-1 px-3 py-2 bg-white rounded-md border border-gray-200"
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="text-gray-600 font-medium sm:w-32">
                    Địa chỉ:
                  </span>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="text-gray-800 sm:flex-1 px-3 py-2 bg-white rounded-md border border-gray-200"
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="text-gray-600 font-medium sm:w-32">
                    Số điện thoại:
                  </span>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="text-gray-800 sm:flex-1 px-3 py-2 bg-white rounded-md border border-gray-200"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <Button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg shadow-sm"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm"
                >
                  Lưu
                </Button>
              </div>
            </form>
          ) : (
            <>
              <div className="bg-gray-50 rounded-lg p-5">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                  Thông tin cá nhân
                </h3>
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <span className="text-gray-600 font-medium sm:w-32">
                      Họ và tên:
                    </span>
                    <span className="text-gray-800 sm:flex-1 px-3 py-2 bg-white rounded-md border border-gray-200">
                      {user?.name || "Chưa cập nhật"}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <span className="text-gray-600 font-medium sm:w-32">
                      Email:
                    </span>
                    <span className="text-gray-800 sm:flex-1 px-3 py-2 bg-white rounded-md border border-gray-200">
                      {user?.email}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <span className="text-gray-600 font-medium sm:w-32">
                      Địa chỉ:
                    </span>
                    <span className="text-gray-800 sm:flex-1 px-3 py-2 bg-white rounded-md border border-gray-200">
                      {user?.address && user.address.trim() !== ""
                        ? user.address
                        : "Chưa cập nhật"}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <span className="text-gray-600 font-medium sm:w-32">
                      Số điện thoại:
                    </span>
                    <span className="text-gray-800 sm:flex-1 px-3 py-2 bg-white rounded-md border border-gray-200">
                      {user?.phone && user.phone.trim() !== ""
                        ? user.phone
                        : "Chưa cập nhật"}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <span className="text-gray-600 font-medium sm:w-32">
                      Vai trò:
                    </span>
                    <span className="text-gray-800 sm:flex-1 px-3 py-2 bg-white rounded-md border border-gray-200">
                      {user?.role}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
            <Link href="/">
              <Button className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition duration-300 flex items-center justify-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Về trang chủ
              </Button>
            </Link>
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 rounded-lg shadow-sm transition duration-300 flex items-center justify-center"
              >
                <svg
                  className="w-5 h-5 mr-2 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Chỉnh sửa
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
