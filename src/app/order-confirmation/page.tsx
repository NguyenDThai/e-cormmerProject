"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function OrderConfirmation() {
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Xác nhận đơn hàng COD</h1>
      {orderId ? (
        <p>
          Đơn hàng của bạn với mã{" "}
          <span className="text-blue-600">{orderId}</span> đã được tạo thành
          công! Vui lòng chuẩn bị tiền mặt để thanh toán khi nhận hàng.Lưu ý
          rằng đơn hàng này sẽ được giao trong vòng 3-5 ngày làm việc.Sau khi
          nhận hàng, bạn có thể xác nhận đơn hàng trong phần{" "}
          <Link href="/order" className="text-blue-600 hover:underline">
            Đơn hàng
          </Link>
          .Sau khi xác nhận, bạn sẽ không thể hủy đơn hàng này nữa.Sau thời gian
          trên bạn không xác nhận thì đơn hàng sẽ tự động hủy và bạn sẽ không
          thể nhận hàng nữa.
        </p>
      ) : (
        <p>Không tìm thấy thông tin đơn hàng.</p>
      )}
      <p>Thông tin chi tiết sẽ được gửi qua email hoặc SMS.</p>
      <button
        onClick={() => (window.location.href = "/")}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        Quay về trang chủ
      </button>
    </div>
  );
}
