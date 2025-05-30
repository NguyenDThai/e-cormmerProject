"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import Header from "@/components/Header";
import { ReactNode } from "react";

export default function ClientSessionProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SessionProvider>
      <Toaster position="top-center" richColors />
      <Header />
      {children}
    </SessionProvider>
  );
}
