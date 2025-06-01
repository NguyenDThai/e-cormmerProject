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

  const role =
    session?.user.email === "thainguyen4646@gmail.com" ? "admin" : "user";

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
              {role === "user" ? (
                <Link href="/profile">
                  <DropdownMenuItem className="h-10 px-4 py-2 text-sm hover:bg-gray-100 rounded transition-colors cursor-pointer">
                    Profile
                  </DropdownMenuItem>
                </Link>
              ) : (
                <>
                  <Link href="/admin/allprofile">
                    <DropdownMenuItem className="h-10 px-4 py-2 text-sm hover:bg-gray-100 rounded transition-colors cursor-pointer">
                      All Profile
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/admin/product">
                    <DropdownMenuItem className="h-10 px-4 py-2 text-sm hover:bg-gray-100 rounded transition-colors cursor-pointer">
                      Product
                    </DropdownMenuItem>
                  </Link>
                </>
              )}

              <DropdownMenuItem
                className="h-10 px-4 py-2 text-sm hover:bg-red-50 text-red-600 rounded transition-colors cursor-pointer"
                onClick={() => handleSignOut()}
              >
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div className="flex justify-end p-4 gap-4">
          <Link href="sign-in" className="hover:underline">
            Sign in
          </Link>
          <Link href="sign-up" className="hover:underline">
            Sign up
          </Link>
        </div>
      )}
    </nav>
  );
};

export default UserButton;
