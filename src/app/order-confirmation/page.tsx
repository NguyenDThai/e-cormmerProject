"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

// Component con sử dụng useSearchParams
function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (!orderId) {
      console.error("No orderId provided");
    } else {
      console.log("Order confirmed with ID:", orderId);
      // Có thể gọi API để lấy chi tiết đơn hàng
    }
  }, [orderId]);

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 bg-white rounded-lg shadow-md">
      <div className="text-center mb-8">
        <svg
          className="mx-auto h-16 w-16 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
        <h1 className="text-3xl font-bold text-gray-800 mt-4">
          Xác nhận đơn hàng COD
        </h1>
      </div>

      {orderId ? (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-md mb-8 animate-fade-in">
          <p className="text-gray-700 leading-relaxed">
            Đơn hàng của bạn với mã{" "}
            <span className="font-bold text-blue-600">{orderId}</span> đã được
            tạo thành công!
          </p>
          <div className="mt-4 p-4 bg-white rounded-md border border-gray-200">
            <div className="flex items-center mb-2">
              <svg
                className="h-5 w-5 text-yellow-500 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-medium">
                Vui lòng chuẩn bị tiền mặt để thanh toán khi nhận hàng.
              </span>
            </div>
            <div className="flex items-center mb-2">
              <svg
                className="h-5 w-5 text-blue-500 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                Giao hàng trong vòng{" "}
                <span className="font-semibold">3-5 ngày làm việc</span>.
              </span>
            </div>
            <div className="flex items-center">
              <svg
                className="h-5 w-5 text-purple-500 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                Xác nhận đơn hàng trong phần{" "}
                <Link
                  href="/order"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Đơn hàng
                </Link>{" "}
                sau khi nhận.
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Lưu ý: Sau khi xác nhận, bạn sẽ không thể hủy đơn hàng. Nếu không
            xác nhận trong thời gian quy định, đơn hàng sẽ tự động hủy.
          </p>
        </div>
      ) : (
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-md mb-8">
          <p className="text-red-700 font-medium">
            Không tìm thấy thông tin đơn hàng.
          </p>
        </div>
      )}

      <button
        onClick={() => (window.location.href = "/")}
        className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition duration-200 ease-in-out transform hover:scale-105"
      >
        Quay về trang chủ
      </button>
    </div>
  );
}

// Component chính với Suspense boundary
export default function OrderConfirmation() {
  return (
    <Suspense
      fallback={
        <div className="max-w-3xl mx-auto px-6 py-10 bg-white rounded-lg shadow-md flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="ml-4 text-gray-600">Đang tải thông tin đơn hàng...</p>
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
