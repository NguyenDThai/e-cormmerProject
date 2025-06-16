"use client";
import ProductStatistics from "@/components/ProductStatistics";
import { Button } from "@/components/ui/button";
import UserStatistics from "@/components/UserStatistics";
import React, { useState } from "react";

const Statistical = () => {
  const [view, setView] = useState<"users" | "products">("users");
  return (
    <div className="p-4 h-screen">
      <div className="flex justify-center gap-4 mb-4">
        <Button
          onClick={() => setView("users")}
          variant={view === "users" ? "default" : "outline"}
        >
          Thống kê người dùng
        </Button>
        <Button
          onClick={() => setView("products")}
          variant={view === "products" ? "default" : "outline"}
        >
          Thống kê sản phẩm
        </Button>
      </div>
      {view === "users" ? <UserStatistics /> : <ProductStatistics />}
    </div>
  );
};

export default Statistical;
