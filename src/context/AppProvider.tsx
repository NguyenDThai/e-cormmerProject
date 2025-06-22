/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSession } from "next-auth/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { CartItem } from "@/models/cart";

interface FavoriteItem {
  productId: string;
  productName: string;
  productDescription: string;
  productPrice: number;
  productSalePrice: number;
  userEmail: string;
}

interface AppContextType {
  favorites: any[]; // Danh sách sản phẩm yêu thích
  favoriteCount: number; // Số lượng sản phẩm yêu thích
  fetchFavorites: () => Promise<void>; // Hàm fetch danh sách yêu thích
  addFavorite: (productId: string) => Promise<boolean>; // Hàm thêm yêu thích
  removeFavorite: (productId: string) => Promise<boolean>; // Hàm xóa yêu thích
  isFavorite: (productId: string) => boolean; // Kiểm tra sản phẩm có trong yêu thích không
  adminFavorites: FavoriteItem[];
  fetchAdminFavorites: () => Promise<void>;

  // Cart functionality
  cartItems: CartItem[];
  cartTotal: number;
  cartItemCount: number;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateCartItemQuantity: (
    productId: string,
    quantity: number
  ) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;

  quantity?: number; // Số lượng sản phẩm trong giỏ hàng
  setQuantity?: (quantity: number) => void; // Hàm để cập nhật số lượng sản phẩm
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [adminFavorites, setAdminFavorites] = useState<FavoriteItem[]>([]);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartItemCount, setCartItemCount] = useState(0);

  // so luong san pham

  const [quantity, setQuantity] = useState(1);

  // Fetch giỏ hàng

  const fetchCart = useCallback(async () => {
    if (!session?.user?.email) {
      setCartItems([]);
      setCartTotal(0);
      setCartItemCount(0);
      return;
    }

    try {
      const response = await fetch("/api/cart");
      if (response.ok) {
        const { cart } = await response.json();
        setCartItems(cart.items || []);
        setCartTotal(cart.total || 0);
        setCartItemCount(
          cart.items?.reduce(
            (sum: number, item: CartItem) => sum + item.quantity,
            0
          ) || 0
        );
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  }, [session?.user?.email]);

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = useCallback(
    async (productId: string, quantity: number = 1) => {
      try {
        const response = await fetch("/api/cart/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId, quantity }),
        });

        if (response.ok) {
          await fetchCart(); // Refresh cart data
        }
      } catch (error) {
        console.error("Failed to add to cart:", error);
      }
    },
    [fetchCart]
  );

  // Hàm xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = useCallback(
    async (productId: string) => {
      try {
        const response = await fetch(
          `/api/cart/remove?productId=${productId}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        if (response.ok) {
          await fetchCart(); // Refresh lại giỏ hàng
          // Có thể thêm toast thông báo ở đây
        }
      } catch (error) {
        console.error("Failed to remove item from cart:", error);
      }
    },
    [fetchCart]
  );

  // / Hàm cập nhật số lượng sản phẩm
  const updateCartItemQuantity = useCallback(
    async (productId: string, quantity: number) => {
      if (quantity < 1) return;

      try {
        const response = await fetch("/api/cart/update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ productId, quantity }),
        });

        if (response.ok) {
          await fetchCart(); // Refresh lại giỏ hàng
        }
      } catch (error) {
        console.error("Failed to update cart item quantity:", error);
      }
    },
    [fetchCart]
  );

  // / Hàm xóa toàn bộ giỏ hàng
  const clearCart = useCallback(async () => {
    try {
      const response = await fetch("/api/cart/clear", {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        await fetchCart(); // Refresh lại giỏ hàng
        // Có thể thêm toast thông báo ở đây
      }
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  }, [fetchCart]);

  // Tu dong fresh cart khi session thay doi
  useEffect(() => {
    fetchCart();
  }, [session?.user, fetchCart]);

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
        // Cart functionality
        cartItems,
        cartTotal,
        cartItemCount,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        fetchCart,

        // So luong san pham
        quantity,
        setQuantity,
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
