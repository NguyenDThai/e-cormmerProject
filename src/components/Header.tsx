"use client";
import UserButton from "@/components/user-button";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CiHeart, CiSearch, CiShoppingCart } from "react-icons/ci";
import { useAppContext } from "@/context/AppProvider";
import SearchBar from "@/components/SearchBar";
import Image from "next/image";

const Header = () => {
  const { favoriteCount, fetchFavorites, cartItemCount } = useAppContext();
  const { data: session, status } = useSession();
  const [toggleNav, setToggleNav] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session.user.email) {
      fetchFavorites();
    }
  }, [status, session?.user?.email, fetchFavorites]);

  return (
    <div className="mb-4 md:mb-6 font-sans">
      {/* Top Banner - Modern Gradient */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 h-8 md:h-10 lg:h-12 flex items-center justify-center overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          <p className="text-white font-medium text-xs md:text-sm lg:text-base tracking-wider inline-flex items-center">
            <span className="hidden md:inline-block mr-2 lg:mr-3">✨</span>
            SUMMER SALE: 50% OFF ALL SWIMWEAR + FREE EXPRESS DELIVERY
            <span className="ml-2 lg:ml-3 px-2 py-0.5 md:px-3 md:py-1 bg-white/20 rounded-full text-xs font-bold hover:bg-white/30 transition-all cursor-pointer">
              SHOP NOW →
            </span>
          </p>
        </div>
      </div>

      {/* Main Header - Elegant & Clean */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="max-w-[1300px] mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16 lg:h-20">
            {/* Logo - Modern Typography */}
            <Link
              href="/"
              className="hidden md:flex flex-shrink-0 items-center"
            >
              <Image
                src="/headerlogo3.png"
                alt="Black Store Logo"
                width={120}
                height={30}
                className="object-contain max-h-[60px] md:max-h-[70px] w-[70px] md:w-[60px] bg-transparent"
              />
              <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent ml-1 md:ml-2">
                Black Store
              </h2>
            </Link>

            {/* Desktop Navigation - Minimalist */}

            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 ml-8 xl:ml-12">
              {[
                { name: "Trang chủ", href: "/" },
                { name: "Cửa hàng", href: "/store" },
                { name: "Về chúng tôi", href: "/about" },
                { name: "Liên hệ", href: "/contact" },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative group"
                >
                  <span className="text-gray-800 font-medium hover:text-blue-600 transition-colors duration-200 text-sm xl:text-base">
                    {item.name}
                  </span>
                  <span className="absolute -bottom-0.5 left-0 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => setToggleNav(!toggleNav)}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Search and User Actions - Refined */}
            <div className="flex items-center space-x-2 md:space-x-3 lg:space-x-4">
              {/* Search Bar - Expanded */}
              <div className="relative hidden sm:block w-40 md:w-52 lg:w-64">
                <SearchBar />
              </div>

              {/* Mobile Search Button */}
              <button className="sm:hidden p-1.5 md:p-2 rounded-full text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors">
                <CiSearch className="h-4 w-4 md:h-5 md:w-5" />
              </button>

              {/* User Actions - Consistent Icons */}
              <div className="flex items-center space-x-1 md:space-x-2 lg:space-x-3">
                <Link href="/favorite">
                  <button className="p-1.5 md:p-2 rounded-full hover:bg-gray-100 relative transition-colors group">
                    <CiHeart className="h-4 w-4 md:h-5 md:w-5 text-gray-700 group-hover:text-rose-500" />
                    <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[9px] md:text-[10px] rounded-full h-3.5 w-3.5 md:h-4 md:w-4 flex items-center justify-center">
                      {session?.user.email ? favoriteCount : 0}
                    </span>
                  </button>
                </Link>

                <Link href="/cart">
                  <button className="p-1.5 md:p-2 rounded-full hover:bg-gray-100 relative transition-colors group cursor-pointer">
                    <CiShoppingCart className="h-4 w-4 md:h-5 md:w-5 text-gray-700 group-hover:text-blue-600" />
                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[9px] md:text-[10px] rounded-full h-3.5 w-3.5 md:h-4 md:w-4 flex items-center justify-center">
                      {cartItemCount || 0}
                    </span>
                  </button>
                </Link>

                <div className="ml-0.5 md:ml-1">
                  <UserButton />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu (when opened) */}
        {toggleNav && (
          <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-3 absolute w-full shadow-md animate-slideIn">
            <nav className="flex flex-col space-y-3">
              {[
                { name: "Trang chủ", href: "/" },
                { name: "Cửa hàng", href: "/store" },
                { name: "Về chúng tôi", href: "/about" },
                { name: "Liên hệ", href: "/contact" },
              ].map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-800 font-medium hover:text-blue-600 transition-all duration-300 py-2.5 px-3 rounded-lg hover:bg-blue-50 transform hover:translate-x-1"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animation: "fadeInRight 0.5s forwards",
                  }}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;
