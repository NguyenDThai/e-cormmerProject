"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Loader } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const UserButton = () => {
  const route = useRouter();

  const handleSignOut = async () => {
    await signOut({
      redirect: false,
    });
    route.push("/");
  };

  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Loader className="size-6 mr-4 mt-4 float-right animate-spin" />;
  }

  const avatarFallback = session?.user?.name?.charAt(0).toUpperCase();

  const role = session?.user.role;

  return (
    <nav>
      {session ? (
        <div className="flex items-center">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="outline-none relative float-right p-4 md:p-8">
              <div className="flex gap-4 items-center">
                <Avatar className="size-10 hover:opacity-75 transition">
                  <AvatarImage
                    className="size-10 hover:opacity-75 transition"
                    src={session.user?.image || undefined}
                  />
                  <AvatarFallback className="bg-sky-900 text-white">
                    {avatarFallback}
                  </AvatarFallback>
                </Avatar>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-50 p-2 bg-white border border-gray-200 rounded-lg shadow-lg"
              align="center"
              side="bottom"
            >
              <span className="block px-4 py-2 text-sm text-gray-700 font-medium">
                Xin chào {session.user?.name} ({role})
              </span>
              {/* chức năng cho user */}
              {role === "user" ? (
                <>
                  <Link href="/profile">
                    <DropdownMenuItem className="h-10 px-4 py-2 text-sm hover:bg-gray-100 rounded transition-colors cursor-pointer">
                      Profile
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/favorite">
                    <DropdownMenuItem className="h-10 px-4 py-2 text-sm hover:bg-gray-100 rounded transition-colors cursor-pointer">
                      Sản phẩm yêu thích
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/profile">
                    <DropdownMenuItem className="h-10 px-4 py-2 text-sm hover:bg-gray-100 rounded transition-colors cursor-pointer">
                      Đơn hàng
                    </DropdownMenuItem>
                  </Link>
                </>
              ) : (
                // Chức năng cho admin
                <>
                  <Link href="/admin/allprofile">
                    <DropdownMenuItem className="h-10 px-4 py-2 text-sm hover:bg-gray-100 rounded transition-colors cursor-pointer">
                      Tài khoản
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/admin/product">
                    <DropdownMenuItem className="h-10 px-4 py-2 text-sm hover:bg-gray-100 rounded transition-colors cursor-pointer">
                      Sản Phẩm
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/admin/favorites">
                    <DropdownMenuItem className="h-10 px-4 py-2 text-sm hover:bg-gray-100 rounded transition-colors cursor-pointer">
                      Sản phẩm yêu thích
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/">
                    <DropdownMenuItem className="h-10 px-4 py-2 text-sm hover:bg-gray-100 rounded transition-colors cursor-pointer">
                      Đơn hàng
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/admin/voucher">
                    <DropdownMenuItem className="h-10 px-4 py-2 text-sm hover:bg-gray-100 rounded transition-colors cursor-pointer">
                      Voucher
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/admin/statistical">
                    <DropdownMenuItem className="h-10 px-4 py-2 text-sm hover:bg-gray-100 rounded transition-colors cursor-pointer">
                      Thống kê
                    </DropdownMenuItem>
                  </Link>
                </>
              )}

              <DropdownMenuItem
                className="h-10 px-4 py-2 text-sm hover:bg-red-50 text-red-600 rounded transition-colors cursor-pointer"
                onClick={() => handleSignOut()}
              >
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div className="flex justify-end p-4 gap-4">
          <Link href="sign-in" className="hover:underline">
            Đăng Nhập
          </Link>
          <Link href="sign-up" className="hover:underline">
            Đăng ký
          </Link>
        </div>
      )}
    </nav>
  );
};

export default UserButton;
