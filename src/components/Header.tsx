"use client";
import { Input } from "@/components/ui/input";
import UserButton from "@/components/user-button";
import { SessionProvider } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { CiSearch } from "react-icons/ci";

const Header = () => {
  return (
    <div className="mb-20">
      <div className="bg-black h-12 flex items-center justify-center">
        <p className="text-white ">
          Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!
        </p>
      </div>
      <div className="max-w-[1170px] mx-auto max-h-10 flex items-center justify-between mt-10">
        {/* logo */}
        <div className="flex items-center gap-48">
          <Link href="/">
            <Image
              src={"/logo.png"}
              alt="logo"
              width={100}
              height={100}
              className="w-[100px] object-cover"
            />
          </Link>
          {/* Navigation */}
          <div className="">
            <ul className="flex gap-12">
              <Link href="/">
                <li className="hover:underline">Home</li>
              </Link>
              <li className="hover:underline">Contact</li>
              <li className="hover:underline">About</li>
            </ul>
          </div>
        </div>
        {/* Login/ resgister/ avatar when login success */}
        <div className="flex items-center ">
          <div className="flex items-center bg-[#F5F5F5] relative w-[243px] rounded-2xl ">
            <Input
              placeholder="What are you looking for ?"
              className="border-none outline-none w-full"
            />
            <CiSearch className="size-6s absolute right-2.5" />
          </div>
          <div className="flex items-center justify-end px-10">
            <UserButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
