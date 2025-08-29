"use client";

import React, { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center">
          <h1 className="text-2xl font-bold text-white">Khôi phục mật khẩu</h1>
          <p className="text-blue-100 mt-2">
            Nhập email để nhận liên kết đặt lại mật khẩu
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <input
              type="email"
              value={email}
              placeholder="Vui lòng nhập email của bạn"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
            />
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-md hover:shadow-lg"
          >
            Gửi email reset
          </button>

          {message && (
            <div
              className={`mt-4 p-3 rounded-lg text-center transition-all duration-300 ${
                message.includes("thành công")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              <p>{message}</p>
            </div>
          )}
        </form>

        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
          <p className="text-gray-600">
            Quay lại trang{" "}
            <a
              href="/sign-in"
              className="text-blue-600 hover:underline font-medium"
            >
              Đăng nhập
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
