"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FaGoogle } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { TriangleAlert } from "lucide-react";
import Image from "next/image";
const SignIn = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [pending, setPending] = useState(false);
  const route = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.ok) {
      route.push("/");
      toast.success("Đăng nhập thàng công");
    } else if (res?.status === 401) {
      setError("Thông tin không hợp lệ, Vui lòng thử lại");
      setPending(false);
    } else {
      setError("Something went wrong");
    }
  };

  const handleProvider = (
    event: React.MouseEvent<HTMLButtonElement>,
    value: "github" | "google"
  ) => {
    event.preventDefault();
    signIn(value, {
      callbackUrl: "/",
    });
  };

  return (
    <div className="h-full flex items-center justify-center gap-[130px] bg-white">
      <div>
        <Image
          src="/authlogo1.png"
          alt="logoauth"
          width={400}
          height={400}
          className="w-[800px] object-cover"
        />
      </div>
      <Card className="md:h-auto w-[80%] sm:w-[420px] p-4 sm:p-8 shadow-none border-none">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">
            Sign In
          </CardTitle>
          <CardDescription className="text-sm text-center text-accent-foreground">
            Usee email or sevice, to sign in
          </CardDescription>
        </CardHeader>
        {!!error && (
          <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
            <TriangleAlert />
            <p>{error}</p>
          </div>
        )}
        <CardContent className="px-2 sm:px-6">
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="email"
              className="shadow-none  border-t-0 border-x-0 rounded-none outline-none border-b-slate-400 border-b-1"
              disabled={pending}
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              disabled={pending}
              className=" shadow-none border-t-0 border-x-0 rounded-none outline-none border-b-slate-400 border-b-1"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button className="w-full" size={"lg"} disabled={pending}>
              Submit
            </Button>
          </form>

          <Separator />
          <div className="flex my-2 justify-evenly mx-auto items-center">
            <Button
              disabled={false}
              onClick={(e) => handleProvider(e, "google")}
              variant="outline"
              size={"lg"}
              className="bg-slate-300 hover:scale-110"
            >
              <FaGoogle className="size-8 left-2.5 top-2.5" />
            </Button>
            <Button
              disabled={false}
              onClick={(e) => handleProvider(e, "github")}
              variant="outline"
              size={"lg"}
              className="bg-slate-300 hover:scale-110"
            >
              <FaGithub className="size-8 left-2.5 top-2.5" />
            </Button>
          </div>
          <p className="text-center text-sm mt-3 text-muted-foreground">
            Create new account {""}
            <Link
              href="/sign-up"
              className="text-sky-700 hover:underline cursor-pointer"
            >
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;
