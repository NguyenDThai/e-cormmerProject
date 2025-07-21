"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Suspense } from "react";

function PaymentSuccess() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  useEffect(() => {
    if (sessionId) {
      console.log("Payment successful, session ID:", sessionId);
      // Có thể gọi API để kiểm tra trạng thái đơn hàng
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24 sm:px-6 lg:px-8 text-center">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-green-100">
          {/* Icon checkmark */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <svg
              className="h-10 w-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
            Thanh toán thành công!
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đang được xử lý.
          </p>

          {sessionId && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-mono text-gray-500">
                Mã giao dịch: {sessionId}
              </p>
            </div>
          )}

          <div className="mt-10">
            <Link
              href="http://localhost:3000"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Quay lại trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccess />
    </Suspense>
  );
}
