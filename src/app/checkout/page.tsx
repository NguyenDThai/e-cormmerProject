/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";
// import { User } from "@/app/profile/page";
// import Image from "next/image";
// import React, { useState, useEffect } from "react";
// import { toast } from "sonner";
// import { useAppContext } from "@/context/AppProvider";
// import InputApplyVoucher from "@/components/InputApplyVoucher";

// const CheckOutPage = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     address: "",
//     phone: "",
//   });
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const { cartItems, cartTotal, appliedVoucher } = useAppContext();

//   //   Goi api de lay user
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const response = await fetch("/api/profile");
//         const data = await response.json();
//         if (response.ok) {
//           setUser(data.users);
//           setFormData({
//             name: data.users.name || "",
//             address: data.users.address || "",
//             phone: data.users.phone || "",
//           });
//         } else {
//           throw new Error("Failed to fetch user");
//         }
//       } catch (error) {
//         console.error("Error fetching user:", error);
//       }
//     };

//     fetchUser();
//   }, []);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       const response = await fetch("/api/profile", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       if (response.ok) {
//         const updatedUser = await response.json();
//         setUser(updatedUser.users);
//         setIsModalOpen(false);
//         toast.success("Cập nhật thông tin thành công!");
//       } else {
//         throw new Error("Cập nhật thất bại");
//       }
//     } catch (error) {
//       console.error("Error updating profile:", error);
//       toast.error("Có lỗi xảy ra khi cập nhật thông tin");
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   if (!user) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <p className="text-gray-600">Đang tải thông tin người dùng...</p>
//       </div>
//     );
//   }

//   const finalTotal = appliedVoucher
//     ? Math.max(0, (cartTotal * (100 - appliedVoucher.value)) / 100)
//     : cartTotal;

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
//       {/* Customer Information Section */}
//       <div className="flex-1 bg-white rounded-lg shadow-sm p-6 border border-gray-100">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
//             Chi tiết thanh toán
//           </h1>
//           <button
//             onClick={() => setIsModalOpen(true)}
//             className="px-4 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition"
//           >
//             Cập nhật thông tin
//           </button>
//         </div>

//         <div className="space-y-4">
//           <div className="flex flex-col">
//             <label className="text-gray-700 font-medium mb-1">Họ và tên:</label>
//             <p className="px-4 py-2 bg-gray-50 rounded-md">{user.name}</p>
//           </div>

//           <div className="flex flex-col">
//             <label className="text-gray-700 font-medium mb-1">Địa chỉ:</label>
//             <p className="px-4 py-2 bg-gray-50 rounded-md">
//               {user.address || "Chưa cập nhật"}
//             </p>
//           </div>

//           <div className="flex flex-col">
//             <label className="text-gray-700 font-medium mb-1">
//               Số điện thoại:
//             </label>
//             <p className="px-4 py-2 bg-gray-50 rounded-md">
//               {user.phone || "Chưa cập nhật"}
//             </p>
//           </div>

//           <div className="flex flex-col">
//             <label className="text-gray-700 font-medium mb-1">Email:</label>
//             <p className="px-4 py-2 bg-gray-50 rounded-md">{user.email}</p>
//           </div>
//         </div>
//       </div>

//       {/* Order Summary Section */}
//       <div className="lg:w-1/2  bg-white rounded-lg shadow-sm p-6 border border-gray-100">
//         <h2 className="text-xl font-bold text-gray-800 mb-6">
//           Tóm tắt đơn hàng
//         </h2>

//         <div className="space-y-4">
//           {/* Product 1 */}
//           {cartItems.map((item) => (
//             <div
//               key={item.product?._id.toString()}
//               className="flex items-center justify-between py-3 border-b border-gray-100"
//             >
//               <div className="flex items-center">
//                 <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
//                   <Image
//                     src={
//                       typeof item.product === "object" &&
//                       "images" in item.product
//                         ? (item.product as { images: string[] }).images[0] ||
//                           "/placeholder-product.jpg"
//                         : "/placeholder-product.jpg"
//                     }
//                     alt="image-product"
//                     width={64}
//                     height={64}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//                 <span className="ml-4 font-medium text-gray-700">
//                   {typeof item.product === "object" && "name" in item.product
//                     ? (item.product as { name: string }).name
//                     : ""}
//                 </span>
//               </div>
//               <p className="font-medium text-gray-900">
//                 {item.price.toLocaleString("vi-VN")} đ
//               </p>
//               <p className="ml-3">x{item?.quantity}</p>
//             </div>
//           ))}
//         </div>

//         {/* Order Totals */}
//         <div className="mt-6 space-y-3">
//           <div className="flex justify-between text-gray-600">
//             <p>Tổng phụ</p>
//             <p>{cartTotal.toLocaleString("vi-VN")} đ</p>
//           </div>
//           <div className="flex justify-between text-gray-600">
//             <p>Phí vận chuyển</p>
//             <p>Miễn phí</p>
//           </div>
//           <div className="flex justify-between pt-4 mt-4 border-t border-gray-200">
//             <p className="font-bold text-lg text-gray-800">Tổng cộng</p>
//             <p className="font-bold text-lg text-gray-800">
//               {finalTotal.toLocaleString("vi-VN")} đ
//             </p>
//           </div>
//         </div>

//         <div className="mt-6">
//           <InputApplyVoucher />
//         </div>

//         {/* Checkout Button */}
//         <button className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium transition duration-200">
//           Đặt hàng
//         </button>
//       </div>

//       {/* Update Info Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-gray-800">
//                 Cập nhật thông tin
//               </h2>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-6 w-6"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 </svg>
//               </button>
//             </div>

//             <form onSubmit={handleSubmit}>
//               <div className="space-y-4">
//                 <div className="flex flex-col">
//                   <label
//                     htmlFor="modal-name"
//                     className="text-gray-700 font-medium mb-1"
//                   >
//                     Họ và tên:
//                   </label>
//                   <input
//                     type="text"
//                     id="modal-name"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     className="px-4 py-2 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//                     required
//                   />
//                 </div>

//                 <div className="flex flex-col">
//                   <label
//                     htmlFor="modal-address"
//                     className="text-gray-700 font-medium mb-1"
//                   >
//                     Địa chỉ:
//                   </label>
//                   <input
//                     type="text"
//                     id="modal-address"
//                     name="address"
//                     value={formData.address}
//                     onChange={handleInputChange}
//                     className="px-4 py-2 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//                   />
//                 </div>

//                 <div className="flex flex-col">
//                   <label
//                     htmlFor="modal-phone"
//                     className="text-gray-700 font-medium mb-1"
//                   >
//                     Số điện thoại:
//                   </label>
//                   <input
//                     type="text"
//                     id="modal-phone"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleInputChange}
//                     className="px-4 py-2 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//                   />
//                 </div>

//                 <div className="flex flex-col">
//                   <label
//                     htmlFor="modal-email"
//                     className="text-gray-700 font-medium mb-1"
//                   >
//                     Email:
//                   </label>
//                   <input
//                     type="email"
//                     id="modal-email"
//                     name="email"
//                     value={user?.email || ""}
//                     readOnly
//                     className="px-4 py-2 bg-gray-100 rounded-md border border-gray-300 cursor-not-allowed"
//                   />
//                 </div>
//               </div>

//               <div className="mt-6 flex justify-end space-x-3">
//                 <button
//                   type="button"
//                   onClick={() => setIsModalOpen(false)}
//                   className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
//                 >
//                   Hủy
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={isLoading}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
//                 >
//                   {isLoading ? "Đang xử lý..." : "Cập nhật"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CheckOutPage;

"use client";
import { User } from "@/app/profile/page";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAppContext } from "@/context/AppProvider";
import InputApplyVoucher from "@/components/InputApplyVoucher";
import { loadStripe } from "@stripe/stripe-js";

interface FormData {
  name: string;
  address: string;
  phone: string;
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

const CheckOutPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    address: "",
    phone: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<
    "stripe" | "zalopay" | "cod"
  >("stripe");
  const { cartItems, cartTotal, appliedVoucher } = useAppContext();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/profile");
        const data = await response.json();
        if (response.ok) {
          setUser(data.users);
          setFormData({
            name: data.users.name || "",
            address: data.users.address || "",
            phone: data.users.phone || "",
          });
        } else {
          throw new Error("Failed to fetch user");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
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
    setIsLoading(true);

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser.users);
        setIsModalOpen(false);
        toast.success("Cập nhật thông tin thành công!");
      } else {
        throw new Error("Cập nhật thất bại");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Có lỗi xảy ra khi cập nhật thông tin");
    } finally {
      setIsLoading(false);
    }
  };

  const finalTotal = appliedVoucher
    ? Math.floor(Math.max(0, (cartTotal * (100 - appliedVoucher.value)) / 100))
    : cartTotal;

  const handlePayment = async () => {
    if (!formData.name || !formData.address || !formData.phone) {
      toast.error("Vui lòng cập nhật đầy đủ thông tin trước khi thanh toán!");
      setIsModalOpen(true);
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        items: cartItems.map((item) => ({
          productId: item.product._id.toString(),
          name:
            typeof item.product === "object" && "name" in item.product
              ? (item.product.name as string).replace(
                  /[\u{0080}-\u{FFFF}]/gu,
                  ""
                )
              : "",
          price: item.price,
          quantity: item.quantity,
        })),
        userId: user?._id,
        amount: Math.floor(finalTotal),
        email: user?.email,
        name: formData.name,
        voucherCode: appliedVoucher?.code || null, // Thêm mã voucher vào payload
        paymentMethod,
      };
      console.log("Payment payload:", payload);

      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("API response:", data);

      if (response.ok && data.sessionId && paymentMethod === "stripe") {
        const stripe = await stripePromise;
        if (stripe) {
          const { error } = await stripe.redirectToCheckout({
            sessionId: data.sessionId,
          });
          if (error) {
            throw new Error(error.message);
          }
        }
      } else if (response.ok && paymentMethod === "cod") {
        toast.success(
          "Đơn hàng COD đã được tạo! Vui lòng chờ giao hàng để thanh toán."
        );
        // Có thể chuyển hướng đến trang xác nhận COD
        window.location.href = "/order-confirmation?orderId=" + data.orderId;
      } else {
        throw new Error(data.error || "Lỗi khi tạo phiên thanh toán");
      }
    } catch (error: any) {
      console.error(
        "Error creating Stripe session:",
        error.message,
        error.stack
      );
      toast.error(`Lỗi khi xử lý thanh toán: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Đang tải thông tin người dùng...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8">
      {/* Customer Information Section */}
      <div className="flex-1 bg-white rounded-lg shadow-sm p-4 sm:p-5 md:p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
            Chi tiết thanh toán
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition text-sm sm:text-base"
          >
            Cập nhật thông tin
          </button>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-col">
            <label className="text-sm sm:text-base text-gray-700 font-medium mb-1">
              Họ và tên:
            </label>
            <p className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-50 rounded-md text-sm sm:text-base">
              {user.name}
            </p>
          </div>

          <div className="flex flex-col">
            <label className="text-sm sm:text-base text-gray-700 font-medium mb-1">
              Địa chỉ:
            </label>
            <p className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-50 rounded-md text-sm sm:text-base">
              {user.address || "Chưa cập nhật"}
            </p>
          </div>

          <div className="flex flex-col">
            <label className="text-sm sm:text-base text-gray-700 font-medium mb-1">
              Số điện thoại:
            </label>
            <p className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-50 rounded-md text-sm sm:text-base">
              {user.phone || "Chưa cập nhật"}
            </p>
          </div>

          <div className="flex flex-col">
            <label className="text-sm sm:text-base text-gray-700 font-medium mb-1">
              Email:
            </label>
            <p className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-50 rounded-md text-sm sm:text-base">
              {user.email}
            </p>
          </div>
        </div>
      </div>

      {/* Order Summary Section */}
      <div className="w-full lg:w-1/2 bg-white rounded-lg shadow-sm p-4 sm:p-5 md:p-6 border border-gray-100">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
          Tóm tắt đơn hàng
        </h2>

        <div className="space-y-3 sm:space-y-4 max-h-[300px] overflow-y-auto">
          {cartItems.map((item) => (
            <div
              key={item.product._id.toString()}
              className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-100"
            >
              <div className="flex items-center flex-1 min-w-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                  <Image
                    src={
                      typeof item.product === "object" &&
                      "images" in item.product &&
                      Array.isArray(
                        (item.product as { images: string[] }).images
                      )
                        ? (item.product as { images: string[] }).images[0] ||
                          "/placeholder-product.jpg"
                        : "/placeholder-product.jpg"
                    }
                    alt="image-product"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="ml-2 sm:ml-3 md:ml-4 font-medium text-gray-700 text-sm sm:text-base truncate">
                  {typeof item.product === "object" && "name" in item.product
                    ? (item.product as { name: string }).name
                    : ""}
                </span>
              </div>
              <div className="flex items-center ml-2">
                <p className="font-medium text-gray-900 text-sm sm:text-base whitespace-nowrap">
                  {item.price.toLocaleString("vi-VN")} đ
                </p>
                <p className="ml-1 sm:ml-2 text-sm sm:text-base whitespace-nowrap">
                  x{item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Totals */}
        <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
          <div className="flex justify-between text-gray-600 text-sm sm:text-base">
            <p>Tổng phụ</p>
            <p>{cartTotal.toLocaleString("vi-VN")} đ</p>
          </div>
          <div className="mt-4 sm:mt-6">
            <label className="block text-sm sm:text-base text-gray-700 font-medium mb-1 sm:mb-2">
              Phương thức thanh toán:
            </label>
            <div className="space-y-1 sm:space-y-2">
              <label className="flex items-center text-sm sm:text-base">
                <input
                  type="radio"
                  value="stripe"
                  checked={paymentMethod === "stripe"}
                  onChange={() => setPaymentMethod("stripe")}
                  className="mr-2"
                />
                Thanh toán bằng Stripe
              </label>
              <label className="flex items-center text-sm sm:text-base">
                <input
                  type="radio"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="mr-2"
                />
                Thanh toán khi nhận hàng (COD)
              </label>
            </div>
          </div>
          <div className="flex justify-between pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-gray-200">
            <p className="font-bold text-base sm:text-lg text-gray-800">
              Tổng cộng
            </p>
            <p className="font-bold text-base sm:text-lg text-gray-800">
              {finalTotal.toLocaleString("vi-VN")} đ
            </p>
          </div>
        </div>

        <div className="mt-4 sm:mt-6">
          <InputApplyVoucher />
        </div>

        {/* Checkout Button */}
        <button
          onClick={handlePayment}
          disabled={isLoading}
          className="w-full mt-4 sm:mt-6 md:mt-8 bg-blue-600 hover:bg-blue-700 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-md font-medium transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          {isLoading
            ? "Đang xử lý..."
            : paymentMethod === "stripe"
            ? "Thanh toán với Stripe"
            : "Đặt hàng COD"}
        </button>
      </div>

      {/* Update Info Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-lg p-4 sm:p-5 md:p-6 w-full max-w-sm sm:max-w-md">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
                Cập nhật thông tin
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col">
                  <label
                    htmlFor="modal-name"
                    className="text-sm sm:text-base text-gray-700 font-medium mb-1"
                  >
                    Họ và tên:
                  </label>
                  <input
                    type="text"
                    id="modal-name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm sm:text-base"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="modal-address"
                    className="text-sm sm:text-base text-gray-700 font-medium mb-1"
                  >
                    Địa chỉ:
                  </label>
                  <input
                    type="text"
                    id="modal-address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm sm:text-base"
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="modal-phone"
                    className="text-sm sm:text-base text-gray-700 font-medium mb-1"
                  >
                    Số điện thoại:
                  </label>
                  <input
                    type="text"
                    id="modal-phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm sm:text-base"
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="modal-email"
                    className="text-sm sm:text-base text-gray-700 font-medium mb-1"
                  >
                    Email:
                  </label>
                  <input
                    type="email"
                    id="modal-email"
                    name="email"
                    value={user?.email || ""}
                    readOnly
                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-100 rounded-md border cursor-not-allowed text-sm sm:text-base"
                  />
                </div>
              </div>

              <div className="mt-4 sm:mt-6 flex justify-end space-x-2 sm:space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-600 rounded-md hover:bg-gray-50 transition text-sm sm:text-base"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {isLoading ? "Đang xử lý..." : "Cập nhật"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckOutPage;
