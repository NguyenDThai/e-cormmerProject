"use client";
import CollectionStatistics from "@/components/CollectionStatistics";
import ProductStatistics from "@/components/ProductStatistics";
import { Button } from "@/components/ui/button";
import UserStatistics from "@/components/UserStatistics";
import React, { useState } from "react";

const Statistical = () => {
  const [view, setView] = useState<"users" | "products" | "collection">(
    "users"
  );
  return (
    <div className="p-4 h-full">
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
        <Button
          onClick={() => setView("collection")}
          variant={view === "products" ? "default" : "outline"}
        >
          Thống kê doanh thu
        </Button>
      </div>
      {view === "users" && <UserStatistics />}
      {view === "products" && <ProductStatistics />}
      {view === "collection" && <CollectionStatistics />}
    </div>
  );
};

export default Statistical;
