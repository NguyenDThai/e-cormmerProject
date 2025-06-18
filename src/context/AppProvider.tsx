/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSession } from "next-auth/react";
import { createContext, useCallback, useContext, useState } from "react";

interface FavoriteItem {
  productId: string;
  productName: string;
  productDescription: string;
  productPrice: number;
  productSalePrice: number;
  userEmail: string;
}

interface FavoriteContextType {
  favorites: any[]; // Danh sách sản phẩm yêu thích
  favoriteCount: number; // Số lượng sản phẩm yêu thích
  fetchFavorites: () => Promise<void>; // Hàm fetch danh sách yêu thích
  addFavorite: (productId: string) => Promise<boolean>; // Hàm thêm yêu thích
  removeFavorite: (productId: string) => Promise<boolean>; // Hàm xóa yêu thích
  isFavorite: (productId: string) => boolean; // Kiểm tra sản phẩm có trong yêu thích không
  user: any;
  adminFavorites: FavoriteItem[];
  fetchAdminFavorites: () => Promise<void>;
}

const AppContext = createContext<FavoriteContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [adminFavorites, setAdminFavorites] = useState<FavoriteItem[]>([]);

  const user = session?.user;

  // Fetch danh sách yêu thích
  const fetchFavorites = useCallback(async () => {
    if (!session?.user?.email) {
      setFavorites([]);
      setFavoriteCount(0);
      return;
    }
    try {
      const response = await fetch("/api/favorites", {
        credentials: "include",
      });
      if (!response.ok) {
        console.error("Không thể lấy danh sách yêu thích");
        return;
      }
      const data = await response.json();
      setFavorites(data.favorite || []);
      setFavoriteCount(data.favorite?.length || 0);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách yêu thích:", error);
    }
  }, [session?.user?.email]);

  const fetchAdminFavorites = useCallback(async () => {
    if (!session?.user?.email) {
      setAdminFavorites([]);
      return;
    }
    try {
      const response = await fetch("/api/favorites/admin", {
        credentials: "include",
      });
      if (!response.ok) {
        console.error("Không thể lấy danh sách yêu thích admin");
        return;
      }

      const data = await response.json();
      setAdminFavorites(data.favorites || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách yêu thích admin:", error);
    }
  }, [session?.user?.email]);

  // Thêm sản phẩm yêu thích
  const addFavorite = useCallback(
    async (productId: string): Promise<boolean> => {
      if (!session?.user?.email) return false;
      try {
        const response = await fetch("/api/favorites", {
          method: "POST",
          body: JSON.stringify({ userEmail: session.user.email, productId }),
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (response.ok) {
          await fetchFavorites(); // Refetch để cập nhật state
          await fetchAdminFavorites();
          return true;
        } else {
          console.error("Failed to add favorite");
          return false;
        }
      } catch (error) {
        console.error("Error adding favorite:", error);
        return false;
      }
    },
    [session?.user?.email, fetchFavorites, fetchAdminFavorites]
  );

  // Xóa sản phẩm yêu thích
  const removeFavorite = useCallback(
    async (productId: string): Promise<boolean> => {
      if (!session?.user?.email) return false;
      try {
        const response = await fetch("/api/favorites", {
          method: "POST",
          body: JSON.stringify({ userEmail: session.user.email, productId }),
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (response.ok) {
          await fetchFavorites(); // Refetch để cập nhật state
          await fetchAdminFavorites();
          return true;
        } else {
          console.error("Failed to remove favorite");
          return false;
        }
      } catch (error) {
        console.error("Error removing favorite:", error);
        return false;
      }
    },
    [session?.user?.email, fetchFavorites, fetchAdminFavorites]
  );

  // Kiểm tra sản phẩm có trong yêu thích không
  const isFavorite = useCallback(
    (productId: string): boolean => {
      return favorites.some((item) => item._id === productId);
    },
    [favorites]
  );

  return (
    <AppContext.Provider
      value={{
        fetchFavorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        favoriteCount,
        favorites,
        adminFavorites,
        fetchAdminFavorites,
        user,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("Context Provider not found");
  }
  return context;
}
