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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { TriangleAlert } from "lucide-react";
import { signIn } from "next-auth/react";

const SignUp = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  const route = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);

    const res = await fetch("api/auth/signup", {
      method: "post",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      setPending(false);
      toast.success(data.message);
      route.push("/sign-in");
    } else if (res.status === 400) {
      setError(data.message);
      setPending(false);
    } else if (res.status === 500) {
      setError(data.message);
      setPending(false);
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
    <div className="h-full flex items-center justify-center bg-white my-11">
      <Card className="w-[90%] sm:w-[450px] p-6 shadow-lg border border-gray-200 rounded-xl bg-white">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-2">
            {/* Có thể thêm logo ở đây */}
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                />
              </svg>
            </div>
          </div>
          <CardTitle className="text-center text-2xl font-bold text-gray-800">
            Create Account
          </CardTitle>
          <CardDescription className="text-center text-gray-500">
            Join us to get started
          </CardDescription>
        </CardHeader>

        {!!error && (
          <div className="bg-red-50 border border-red-200 p-3 rounded-lg flex items-center gap-x-2 text-sm text-red-600 mb-4">
            <TriangleAlert className="h-4 w-4 text-red-500" />
            <p>{error}</p>
          </div>
        )}

        <CardContent className="px-4 py-2">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-3">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <Input
                  id="name"
                  type="text"
                  disabled={pending}
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  disabled={pending}
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  disabled={pending}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  disabled={pending}
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <Button
              className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all shadow-sm hover:shadow-md"
              disabled={pending}
            >
              {pending ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-2 bg-white text-sm text-gray-500">
                or continue with
              </span>
            </div>
          </div>

          <div className="flex gap-4 flex-col">
            <Button
              onClick={(e) => handleProvider(e, "google")}
              variant="outline"
              className="w-full py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition flex items-center justify-center gap-2"
            >
              <FaGoogle className="h-5 w-5 text-red-500" />
              <span className="text-sm font-medium text-gray-700">Google</span>
            </Button>

            <Button
              onClick={(e) => handleProvider(e, "github")}
              variant="outline"
              className="w-full py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition flex items-center justify-center gap-2"
            >
              <FaGithub className="h-5 w-5 text-gray-800" />
              <span className="text-sm font-medium text-gray-700">GitHub</span>
            </Button>
          </div>

          <p className="text-center text-sm mt-6 text-gray-500">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline transition"
            >
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
