import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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

  return (
    <nav>
      {session ? (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger className="outline-none relative float-right p-4 md:p-8">
            <div className="flex gap-4 items-center">
              <span>{session.user?.name}</span>
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
          <DropdownMenuContent className="w-50" align="center" side="bottom">
            <DropdownMenuItem className="h-10" onClick={() => handleSignOut()}>
              Log Out
            </DropdownMenuItem>
            <Link href="/profile">
              <DropdownMenuItem className="h-10">Profile</DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex justify-end p-4 gap-4">
          <Button>
            <Link href="sign-in">Sign in</Link>
          </Button>
          <Button>
            <Link href="sign-up">Sign up</Link>
          </Button>
        </div>
      )}
    </nav>
  );
};

export default UserButton;
