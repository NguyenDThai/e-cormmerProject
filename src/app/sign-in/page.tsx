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
import { FaGoogle } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, TriangleAlert } from "lucide-react";
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
    <div className="h-screen flex flex-col lg:flex-row items-center justify-center bg-white">
      {/* Phần hình ảnh - styled */}
      <div className="lg:w-1/2 flex justify-center p-8 lg:p-0">
        <div className="max-w-[500px] lg:max-w-none">
          <Image
            src="/authlogo1.png"
            alt="logoauth"
            width={600}
            height={600}
            className="w-full h-auto object-contain transition-opacity hover:opacity-90"
            priority
          />
        </div>
      </div>

      {/* Phần form đăng nhập - styled */}
      <div className="w-full lg:w-1/2 flex justify-center p-4 lg:p-8">
        <Card className="w-full max-w-md border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="px-6 pt-8 pb-4">
            <CardTitle className="text-center text-3xl font-bold text-gray-800">
              Đăng nhập
            </CardTitle>
            <CardDescription className="text-center text-gray-500 mt-2">
              Sử dụng email hoặc các dịch vụ bên dưới để đăng nhập vào hệ thống
            </CardDescription>
          </CardHeader>

          {!!error && (
            <div className="mx-6 mb-4 bg-red-50 p-3 rounded-lg flex items-center gap-x-2 text-sm text-red-600 border border-red-100">
              <TriangleAlert className="h-4 w-4" />
              <p>{error}</p>
            </div>
          )}

          <CardContent className="px-6 pb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <Input
                  type="email"
                  disabled={pending}
                  className="h-12 px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  placeholder="Nhập email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  type="password"
                  disabled={pending}
                  className="h-12 px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button
                className="w-full h-12 text-lg text-white font-medium bg-blue-600 hover:bg-blue-700 transition-colors cursor-pointer"
                size="lg"
                disabled={pending}
              >
                {pending ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Đang xử lý...</span>
                  </div>
                ) : (
                  "Đăng nhập"
                )}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  Hoặc tiếp tục với
                </span>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <Button
                onClick={(e) => handleProvider(e, "google")}
                variant="outline"
                size="lg"
                className="flex-1 h-12 border-gray-300 bg-white hover:bg-gray-50 hover:border-blue-500 transition-all cursor-pointer"
              >
                <FaGoogle className="h-5 w-5 mr-2 text-red-500" />
                <span className="sr-only">Google</span>
              </Button>
              <Button
                onClick={(e) => handleProvider(e, "github")}
                variant="outline"
                size="lg"
                className="flex-1 h-12 border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-800 transition-all cursor-pointer"
              >
                <FaGithub className="h-5 w-5 mr-2 text-gray-800" />
                <span className="sr-only">GitHub</span>
              </Button>
            </div>

            <p className="text-center text-sm text-gray-500 mt-6">
              Chưa có tài khoản?{" "}
              <Link
                href="/sign-up"
                className="font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
              >
                Đăng ký ngay
              </Link>
            </p>
            <p className="text-center text-sm text-gray-500 mt-4">
              Bạn đã quên mật khẩu?{" "}
              <Link
                href="/forgot-password"
                className="font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
              >
                Khôi phục mật khẩu
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
