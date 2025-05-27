"use client";
import UserButton from "@/components/user-button";
import { SessionProvider } from "next-auth/react";

export default function Home() {
  return (
    <div className="flex items-center justify-end px-10">
      <SessionProvider>
        <UserButton />
      </SessionProvider>
    </div>
  );
}
