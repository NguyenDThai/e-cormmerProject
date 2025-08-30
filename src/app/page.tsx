"use client";

import Banner from "@/components/Banner";
import ProductFeatured from "@/components/ProductFeatured";
import CategoriesList from "@/components/CategoriesList";
import RenderAllProduct from "@/components/RenderAllProduct";
import FlashSaleBanner from "@/components/FlashSaleBanner";
import FlashSaleSectionHeader from "@/components/FlashSaleSectionHeader";
import { useFlashSale } from "@/hooks/useFlashSale";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CiLogout } from "react-icons/ci";
import Image from "next/image";
import BestSellingProduct from "@/components/BestSellingProduct";
import { motion } from "framer-motion";
import BannerFooter from "@/components/BannerFooter";

export default function Home() {
  const {
    activeFlashSale,
    hasActiveFlashSale,
    isLoading,
    error,
    refreshFlashSale,
  } = useFlashSale();

  const { data: session } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();

  // Handler when flash sale expires
  const handleFlashSaleExpire = () => {
    // Refresh flash sale data to check for new active sales
    setTimeout(() => {
      refreshFlashSale();
    }, 1000);
  };

  const handleSignOut = async () => {
    await signOut({
      redirect: false,
    });
    router.push("/");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut" as const,
      },
    },
  };

  const isAdmin = session?.user.role === "admin";

  if (isAdmin) {
    return (
      <div className="container h-full flex mx-auto mb-[50px]">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? "w-80" : "w-16"
          } bg-gradient-to-b from-blue-900 to-blue-800 text-white min-h-screen shrink-0 p-6 transition-all duration-300 ease-in-out shadow-xl z-10 rounded-lg`}
        >
          <div className="flex items-center mb-8">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-white focus:outline-none md:hidden"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
            <h2 className="text-2xl font-bold ml-2">
              {isSidebarOpen && session?.user?.name}
            </h2>
          </div>
          <nav className="">
            <ul className="space-y-3 h-full flex justify-between flex-col">
              {[
                {
                  href: "/admin/allprofile",
                  text: "Tài khoản",
                  icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
                },
                {
                  href: "/admin/product",
                  text: "Sản Phẩm",
                  icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
                },
                {
                  href: "/admin/flash-sale",
                  text: "Sản Phẩm Khuyến Mãi",
                  icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
                },
                {
                  href: "/admin/favorites",
                  text: "Sản phẩm yêu thích",
                  icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
                },
                {
                  href: "/admin/orders",
                  text: "Đơn hàng",
                  icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
                },
                {
                  href: "/admin/voucher",
                  text: "Voucher",
                  icon: "M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z",
                },
                {
                  href: "/admin/review",
                  text: "Bình luận",
                  icon: "M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z",
                },
                {
                  href: "/admin/statistical",
                  text: "Thống kê",
                  icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
                },
              ].map((item) => (
                <li key={item.text}>
                  <Link href={item.href}>
                    <button
                      className={`w-full flex items-center px-4 py-3 text-sm rounded-lg transition-all duration-200 cursor-pointer ${
                        isSidebarOpen
                          ? "hover:bg-blue-700"
                          : "justify-center hover:bg-blue-700"
                      }`}
                    >
                      <svg
                        className="w-5 h-5 mr-3 text-gray-300 group-hover:text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={item.icon}
                        />
                      </svg>
                      {isSidebarOpen && item.text}
                    </button>
                  </Link>
                </li>
              ))}
              <button
                className="flex items-center px-2 py-3 rounded-lg cursor-pointer hover:bg-blue-700 transition-all duration-200"
                onClick={() => handleSignOut()}
              >
                <CiLogout className="mr-3" size={30} />
                <span>Đăng xuất</span>
              </button>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-grow p-8">
          {/* Flash Sale Management */}
          <section className="mb-12">
            <div className="flex items-center mb-6">
              <span className="w-1 h-8 bg-red-500 rounded-full"></span>
              <h2 className="text-2xl font-bold text-gray-800 ml-3">
                Flash Sale
              </h2>
            </div>
            {hasActiveFlashSale && activeFlashSale ? (
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                <FlashSaleBanner
                  flashSale={activeFlashSale}
                  onExpire={handleFlashSaleExpire}
                />
                <div className="p-6">
                  <Link href="/admin/flash-sale">
                    <button className="mt-2 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-all duration-300 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      Quản lý flash sale
                    </button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-200">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800">
                  No Active Flash Sale
                </h3>
                <p className="text-gray-500 mt-2 max-w-md mx-auto">
                  Create a new flash sale to boost your sales and engage
                  customers with limited-time offers.
                </p>
                <Link href="/admin/flash-sale">
                  <button className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all duration-300 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Create New Flash Sale
                  </button>
                </Link>
              </div>
            )}
          </section>

          {/* Product Management */}
          <section className="mb-12">
            <div className="flex items-center mb-6">
              <span className="w-1 h-8 bg-blue-500 rounded-full"></span>
              <h2 className="text-2xl font-bold text-gray-800 ml-3">
                Quản lý sản phẩm
              </h2>
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-800">
                  Tất cả sản phẩm
                </h3>
              </div>
              <div className="p-6">
                <RenderAllProduct />
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
                <Link href="/admin/product/add-product">
                  <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Thêm sản phẩm mới
                  </button>
                </Link>
                <Link href="/admin/product">
                  <button className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-all duration-300 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Sửa sản phẩm
                  </button>
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="container min-h-screen flex flex-col mx-auto ">
      {/* Banner */}
      <main className="flex-grow">
        <Banner />
        {/* Content Sections */}
        <div className="container mx-auto px-4 py-12">
          {/* Flash Sale Banner */}
          {hasActiveFlashSale && activeFlashSale && (
            <FlashSaleBanner
              flashSale={activeFlashSale}
              onExpire={handleFlashSaleExpire}
            />
          )}

          {/* Featured Section - Flash Sale Products */}
          {(isLoading || hasActiveFlashSale) && (
            <section className="mb-16">
              <FlashSaleSectionHeader
                flashSale={activeFlashSale}
                isLoading={isLoading}
                error={error}
                onRetry={refreshFlashSale}
              />

              {/* Products in Flash Sale */}
              {hasActiveFlashSale && <ProductFeatured />}
            </section>
          )}

          {/* No Flash Sale Message */}
          {!isLoading && !hasActiveFlashSale && !error && (
            <section className="mb-16">
              <div className="flex flex-col">
                <div className="flex items-center">
                  <span className="w-[20px] h-[40px] bg-gray-400 block rounded-md"></span>
                  <p className="text-lg text-gray-500 ml-4">Flash Sale</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center mt-4">
                  <div className="text-gray-500 mb-2">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400 mb-4"
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
                    <h3 className="text-lg font-medium">
                      Hiện tại chưa có Flash Sale
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Hãy theo dõi để không bỏ lỡ các deal hấp dẫn sắp tới!
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* categories */}
          <section className="mb-16">
            <div className="flex items-center">
              <span className="w-[20px] h-[40px] bg-blue-600 block rounded-md"></span>
              <p className="text-lg text-blue-500 ml-4">Danh sách sản phẩm</p>
            </div>
            <h2 className="text-4xl font-semibold mt-5">
              Theo thể loại sản phẩm
            </h2>
            <div className="w-20 h-1 bg-blue-600 mt-4"></div>

            <CategoriesList />
          </section>

          {/* San pham cua chung toi */}
          <section>
            <div className="flex items-center">
              <span className="w-[20px] h-[40px] bg-blue-600 block rounded-md"></span>
              <p className="text-lg text-blue-500 ml-4">
                Sản phẩm của chúng tôi
              </p>
            </div>
            <h2 className="text-4xl font-semibold mt-5">
              Khám phá sản phẩm của chúng tôi
            </h2>
            <div className="w-20 h-1 bg-blue-600 mt-4"></div>
            <RenderAllProduct />
          </section>

          {/* Banner footer */}
          <BannerFooter />

          {/* Best selling */}
          <section className="mb-16">
            <div className="flex items-center">
              <span className="w-[20px] h-[40px] bg-blue-600 block rounded-md"></span>
              <p className="text-lg text-blue-500 ml-4">Danh sách sản phẩm</p>
            </div>
            <h2 className="text-4xl font-semibold mt-5">Sản phẩm bán chạy</h2>
            <div className="w-20 h-1 bg-blue-600 mt-4"></div>
            <BestSellingProduct />
          </section>

          {/* Product new arrival */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="mb-16 px-4 md:px-8"
          >
            {/* Section Header */}
            <motion.div variants={itemVariants} className="mb-12">
              <div className="flex items-center mb-3">
                <span className="w-5 h-10 bg-blue-600 rounded-md"></span>
                <p className="text-lg font-medium text-blue-600 ml-4 tracking-wide">
                  SẢN PHẨM NỔI BẬT
                </p>
              </div>
              <h2 className="text-4xl font-bold text-gray-900">
                Sản phẩm mới về
              </h2>
              <div className="w-20 h-1 bg-blue-600 mt-4"></div>
            </motion.div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              {/* Main Product - PlayStation */}
              <motion.div
                variants={itemVariants}
                className="group relative bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden h-[600px] flex items-end justify-center transition-all duration-500 hover:shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                <Image
                  src="/playstation.png"
                  alt="PlayStation 5"
                  width={511}
                  height={400}
                  className="w-4/5 object-contain transform group-hover:scale-105 transition-transform duration-700 z-0"
                />
                <div className="absolute bottom-8 left-8 z-20 flex flex-col gap-4 max-w-xs">
                  <p className="text-white text-2xl md:text-3xl font-bold">
                    PlayStation 5
                  </p>
                  <p className="text-gray-300 text-sm md:text-base">
                    Phiên bản màu đen và trắng của PS5 sắp ra mắt với hiệu suất
                    đột phá.
                  </p>
                  <button className="flex items-center text-white font-medium text-lg group-hover:text-blue-400 transition-colors duration-300">
                    Xem ngay
                    <svg
                      className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </button>
                </div>
              </motion.div>

              {/* Secondary Products Column */}
              <motion.div
                variants={containerVariants}
                className="flex flex-col gap-6 md:gap-8"
              >
                {/* Women's Collection */}
                <motion.div
                  variants={itemVariants}
                  className="group relative bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden h-[286px] flex items-center transition-all duration-500 hover:shadow-xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-10"></div>
                  <div className="w-1/2 z-0">
                    <Image
                      src="/woman.png"
                      alt="Bộ sưu tập của phụ nữ"
                      width={432}
                      height={286}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="absolute right-8 z-20 flex flex-col gap-3 max-w-xs text-right">
                    <p className="text-white text-xl md:text-2xl font-bold">
                      Bộ sưu tập của phụ nữ
                    </p>
                    <p className="text-gray-300 text-sm">
                      Bộ sưu tập phụ nữ mang đến cho bạn một phong cách và sự tự
                      tin khác biệt.
                    </p>
                    <button className="flex items-center justify-end text-white font-medium text-lg group-hover:text-blue-400 transition-colors duration-300 self-end">
                      Xem ngay
                      <svg
                        className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </button>
                  </div>
                </motion.div>

                {/* Smaller Products Row */}
                <motion.div
                  variants={containerVariants}
                  className="grid grid-cols-2 gap-6 md:gap-8"
                >
                  {/* Speaker */}
                  <motion.div
                    variants={itemVariants}
                    className="group relative bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden h-[286px] flex flex-col items-center justify-center p-6 transition-all duration-500 hover:shadow-xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                    <Image
                      src="/speakers.png"
                      alt="Loa không dây Amazon"
                      width={210}
                      height={210}
                      className="z-0 transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute bottom-6 left-6 z-20 flex flex-col gap-2">
                      <p className="text-white text-xl font-bold">Loa</p>
                      <p className="text-gray-300 text-sm">
                        Loa không dây Amazon
                      </p>
                      <button className="text-white font-medium text-base group-hover:text-blue-400 transition-colors duration-300">
                        Xem ngay
                      </button>
                    </div>
                  </motion.div>

                  {/* Perfume */}
                  <motion.div
                    variants={itemVariants}
                    className="group relative bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden h-[286px] flex flex-col items-center justify-center p-6 transition-all duration-500 hover:shadow-xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                    <Image
                      src="/gucci.png"
                      alt="Nước hoa Gucci"
                      width={210}
                      height={210}
                      className="z-0 transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute bottom-6 left-6 z-20 flex flex-col gap-2">
                      <p className="text-white text-xl font-bold">Nước hoa</p>
                      <p className="text-gray-300 text-sm">
                        Nước hoa Gucci cao cấp
                      </p>
                      <button className="text-white font-medium text-base group-hover:text-blue-400 transition-colors duration-300">
                        Xem ngay
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
}
