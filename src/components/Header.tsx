"use client";
import UserButton from "@/components/user-button";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect } from "react";
import { CiHeart, CiSearch, CiShoppingCart } from "react-icons/ci";
import { useAppContext } from "@/context/AppProvider";
import SearchBar from "@/components/SearchBar";

const Header = () => {
  const { favoriteCount, fetchFavorites, cartItemCount } = useAppContext();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session.user.email) {
      fetchFavorites();
    }
  }, [status, session?.user?.email, fetchFavorites]);

  return (
    <div className="mb-6 font-sans">
      {/* Top Banner - Modern Gradient */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 h-10 md:h-12 flex items-center justify-center overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          <p className="text-white font-medium text-sm md:text-base tracking-wider inline-flex items-center">
            <span className="hidden md:inline-block mr-3">✨</span>
            SUMMER SALE: 50% OFF ALL SWIMWEAR + FREE EXPRESS DELIVERY
            <span className="ml-3 px-3 py-1 bg-white/20 rounded-full text-xs font-bold hover:bg-white/30 transition-all cursor-pointer">
              SHOP NOW →
            </span>
          </p>
        </div>
      </div>

      {/* Main Header - Elegant & Clean */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo - Modern Typography */}
            <Link href="/" className="flex-shrink-0">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                BlackStore
              </h2>
            </Link>

            {/* Desktop Navigation - Minimalist */}
            <nav className="hidden md:flex items-center space-x-8 ml-12">
              {[
                { name: "Trang chủ", href: "/" },
                { name: "Cửa hàng", href: "#" },
                { name: "Về chúng tôi", href: "/about" },
                { name: "Liên hệ", href: "/contact" },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative group"
                >
                  <span className="text-gray-800 font-medium hover:text-blue-600 transition-colors duration-200">
                    {item.name}
                  </span>
                  <span className="absolute -bottom-0.5 left-0 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </nav>

            {/* Search and User Actions - Refined */}
            <div className="flex items-center space-x-3 md:space-x-5">
              {/* Search Bar - Expanded */}
              <div className="relative hidden md:block w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <SearchBar />
              </div>

              {/* Mobile Search Button */}
              <button className="md:hidden p-2 rounded-full text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors">
                <CiSearch className="h-5 w-5" />
              </button>

              {/* User Actions - Consistent Icons */}
              <div className="flex items-center space-x-1 md:space-x-3">
                <Link href="/favorite">
                  <button className="p-2 rounded-full hover:bg-gray-100 relative transition-colors group">
                    <CiHeart className="h-5 w-5 text-gray-700 group-hover:text-rose-500" />
                    <span className="absolute -top-0.5 -right-0.5 bg-rose-600 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                      {session?.user.email ? favoriteCount : 0}
                    </span>
                  </button>
                </Link>

                <Link href="/cart">
                  <button className="p-2 rounded-full hover:bg-gray-100 relative transition-colors group cursor-pointer">
                    <CiShoppingCart className="h-5 w-5 text-gray-700 group-hover:text-blue-600" />
                    <span className="absolute -top-0.5 -right-0.5 bg-blue-600 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                      {cartItemCount || 0}
                    </span>
                  </button>
                </Link>

                <div className="ml-1">
                  <UserButton />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
