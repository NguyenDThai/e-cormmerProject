"use client";
import UserButton from "@/components/user-button";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { CiHeart, CiSearch, CiShoppingCart } from "react-icons/ci";
import { useAppContext } from "@/context/AppProvider";
import SearchBar from "@/components/SearchBar";

const Header = () => {
  const { favoriteCount, fetchFavorites } = useAppContext();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session.user.email) {
      fetchFavorites();
    }
  }, [status, session?.user?.email, fetchFavorites]);

  return (
    <div className="mb-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r bg-blue-600 h-12 flex items-center justify-center">
        <p className="text-white font-medium text-sm md:text-base tracking-wide flex items-center">
          <span className="hidden md:inline-block mr-2">🎉</span>
          SUMMER SALE: 50% OFF ALL SWIMWEAR + FREE EXPRESS DELIVERY
          <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold">
            SHOP NOW
          </span>
        </p>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Logo"
                width={120}
                height={40}
                className="h-10 w-auto object-contain"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8 ml-10">
              <Link href="/" className="relative group">
                <span className="text-gray-900 font-medium hover:text-blue-600 transition-colors">
                  Home
                </span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
              </Link>
              <Link href="#" className="relative group">
                <span className="text-gray-900 font-medium hover:text-blue-600 transition-colors">
                  Shop
                </span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
              </Link>
              <Link href="#" className="relative group">
                <span className="text-gray-900 font-medium hover:text-blue-600 transition-colors">
                  Collections
                </span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
              </Link>
              <Link href="#" className="relative group">
                <span className="text-gray-900 font-medium hover:text-blue-600 transition-colors">
                  About
                </span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
              </Link>
              <Link href="#" className="relative group">
                <span className="text-gray-900 font-medium hover:text-blue-600 transition-colors">
                  Contact
                </span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
              </Link>
            </nav>

            {/* Search and User Actions */}
            <div className="flex items-center space-x-4 md:space-x-6">
              {/* Search Bar */}
              <div className="relative hidden md:block">
                <SearchBar />
              </div>

              {/* Mobile Search Button */}
              <button className="md:hidden p-2 rounded-full text-gray-500 hover:text-gray-900">
                <CiSearch className="h-6 w-6" />
              </button>

              {/* User Actions */}
              <div className="flex items-center space-x-2">
                <Link href="/favorite">
                  {session?.user.email && favoriteCount > 0 ? (
                    <button className="p-2 rounded-full hover:bg-gray-100 relative">
                      <CiHeart className="h-6 w-6 text-gray-700" />
                      <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {favoriteCount}
                      </span>
                    </button>
                  ) : (
                    <button className="p-2 rounded-full hover:bg-gray-100 relative">
                      <CiHeart className="h-6 w-6 text-gray-700" />
                      <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        0
                      </span>
                    </button>
                  )}
                </Link>
                <button className="p-2 rounded-full hover:bg-gray-100 relative">
                  <CiShoppingCart className="h-6 w-6 text-gray-700" />
                  <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    2
                  </span>
                </button>
                <div className="ml-2">
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
