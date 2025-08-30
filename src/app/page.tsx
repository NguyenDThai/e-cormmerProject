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
import { Button } from "@/components/ui/button";
import Image from "next/image";
import BestSellingProduct from "@/components/BestSellingProduct";

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
            <RenderAllProduct />
          </section>

          {/* Banner footer */}
          <div className="relative mb-16 bg-gradient-to-r from-gray-900 to-black w-full h-[500px] flex items-center justify-between overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj4KICA8ZyBmaWxsPSJub25lIiBzdHJva2U9IiMwMDciIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iMC4yIj4KICAgIDxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjE1Ii8+CiAgICA8Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyNSIvPgogIDwvZz4KPC9zdmc+')]"></div>
            </div>

            {/* Content section */}
            <div className="relative z-10 w-[500px] ml-[56px] space-y-8">
              <p className="text-blue-400 font-medium text-lg tracking-wider">
                LOẠI SẢN PHẨM
              </p>

              <h2 className="text-5xl font-bold text-white leading-tight">
                Nâng cao trải nghiệm{" "}
                <span className="text-blue-400">âm nhạc</span> của bạn
              </h2>

              <p className="text-gray-300 text-lg max-w-md">
                Khám phá các sản phẩm âm thanh cao cấp với chất lượng vượt trội,
                thiết kế tinh tế và công nghệ tiên tiến.
              </p>

              <div className="flex gap-4">
                <Button className="px-10 py-4 rounded-lg bg-blue-600 text-white font-medium text-lg hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl flex items-center gap-2 group">
                  Mua ngay
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
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
                </Button>

                <Button className="px-10 py-4 rounded-lg bg-transparent border border-gray-600 text-white font-medium text-lg hover:bg-white/10 transition-all duration-300">
                  Xem thêm
                </Button>
              </div>
            </div>

            {/* Image section */}
            <div className="relative z-10 w-[600px] mr-12 transform hover:scale-105 transition-transform duration-700">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl"></div>
              <Image
                src="/bannersection.png"
                alt="banner-footer"
                width={600}
                height={500}
                className="w-full h-auto object-contain relative z-10"
              />

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/30 rounded-full blur-xl"></div>
              <div className="absolute bottom-8 -left-8 w-32 h-32 bg-purple-500/30 rounded-full blur-xl"></div>
            </div>

            {/* Decorative elements */}
            <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>

          {/* Best selling */}
          <section className="mb-16">
            <div className="flex items-center">
              <span className="w-[20px] h-[40px] bg-blue-600 block rounded-md"></span>
              <p className="text-lg text-blue-500 ml-4">Danh sách sản phẩm</p>
            </div>
            <h2 className="text-4xl font-semibold mt-5">Sản phẩm bán chạy</h2>
            <BestSellingProduct />
          </section>
        </div>
      </main>
    </div>
  );
}
