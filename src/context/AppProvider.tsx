/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { toast } from "sonner";

interface FavoriteItem {
  productId: string;
  productName: string;
  productDescription: string;
  productPrice: number;
  productSalePrice: number;
  userEmails: [];
  favoriteCount: number;
}

// Định nghĩa interface cho Order
interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  orderId: string;
  userId: string;
  amount: number;
  status:
    | "PENDING"
    | "PROCESSING"
    | "SUCCESS"
    | "FAILED"
    | "AWAITING_PAYMENT"
    | "CANCELLED"
    | "OVERDUE";
  paymentMethod: "ZaloPay" | "stripe" | "cod";
  items: OrderItem[];
  zalopayTransId?: string;
  stripeSessionId?: string;
  paymentIntentId?: string;
  codConfirmed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Review {
  _id: string;
  orderId: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

interface AppContextType {
  favorites: any[]; // Danh sách sản phẩm yêu thích
  favoriteCount: number; // Số lượng sản phẩm yêu thích
  fetchFavorites: () => Promise<void>; // Hàm fetch danh sách yêu thích
  addFavorite: (productId: string) => Promise<boolean>; // Hàm thêm yêu thích
  removeFavorite: (productId: string) => Promise<boolean>; // Hàm xóa yêu thích
  isFavorite: (productId: string) => boolean; // Kiểm tra sản phẩm có trong yêu thích không
  adminFavorites: FavoriteItem[];
  fetchAdminFavorites: (params?: {
    page?: number;
    limit?: number;
  }) => Promise<void>;
  totalFavorites: number;

  // order
  orders: Order[];
  totalOrders: number;
  fetchAdminOrders: (params?: {
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
  contactCustomer: (orderId: string) => Promise<void>;
  confirmOrder: (orderId: string) => Promise<void>;
  fetchUserOrders: () => Promise<void>;
  fetchAllAdminOrders: () => Promise<void>;

  // Review
  submitReview: (
    orderId: string,
    productId: string,
    rating: number,
    comment: string
  ) => Promise<void>;

  fetchAdminReviews: (params?: {
    page?: number;
    limit?: number;
    isApproved?: boolean;
  }) => Promise<void>;
  adminReviews: Review[];
  totalReviews: number;
  fetchUserReviews: () => Promise<void>;
  userReviews: Review[];
  fetchReviews: (productId: string) => Promise<void>;
  reviews: Review[];

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

  // apply voucher state
  appliedVoucher: {
    code: string;
    value: number;
  } | null;
  applyVoucher: (code: string) => Promise<void>;
  removeVoucher: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [adminFavorites, setAdminFavorites] = useState<FavoriteItem[]>([]);
  const [totalFavorites, setTotalFavorites] = useState(0);

  const [orders, setOrders] = useState<Order[]>([]);
  const [totalOrders, setTotalOrders] = useState<number>(0);

  // Review
  const [adminReviews, setAdminReviews] = useState<Review[]>([]);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartItemCount, setCartItemCount] = useState(0);

  // so luong san pham
  const [quantity, setQuantity] = useState(1);

  // Voucher state
  const [appliedVoucher, setAppliedVoucher] = useState(null);

  const applyVoucher = async (code: string) => {
    try {
      const response = await fetch("/api/vouchers/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (response.ok) {
        const { voucher } = await response.json();
        setAppliedVoucher(voucher);
      } else {
        const error = await response.json();
        throw new Error(error.error);
      }
    } catch (error) {
      console.error("Failed to apply voucher:", error);
      throw error;
    }
  };

  const removeVoucher = () => {
    setAppliedVoucher(null);
  };

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

  const fetchAdminFavorites = useCallback(
    async ({ page = 1, limit = 10 } = {}) => {
      try {
        const response = await fetch(
          `/api/favorites/admin?page=${page}&limit=${limit}`,
          {
            credentials: "include",
          }
        );
        if (!response.ok) {
          console.error("Không thể lấy danh sách yêu thích cho quản trị viên");
          return;
        }
        const data = await response.json();
        setAdminFavorites(data.favorites || []);
        setTotalFavorites(data.totalCount || 0);
      } catch (error) {
        console.error(
          "Lỗi khi lấy danh sách yêu thích cho quản trị viên:",
          error
        );
      }
    },
    []
  );

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

  // Order
  // Admin loc don hàng theo trang thai, thoi gian
  const fetchAdminOrders = useCallback(
    async ({
      status = "",
      startDate = "",
      endDate = "",
      page = 1,
      limit = 10,
    }: {
      status?: string;
      startDate?: string;
      endDate?: string;
      page?: number;
      limit?: number;
    } = {}) => {
      try {
        const params = new URLSearchParams();
        if (status) params.append("status", status);
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
        params.append("page", page.toString());
        params.append("limit", limit.toString());

        const response = await fetch(`/api/admin/orders?${params.toString()}`, {
          credentials: "include",
        });
        if (!response.ok) {
          console.error("Không thể lấy danh sách đơn hàng");
          return;
        }
        const data = await response.json();
        setOrders(data.orders || []);
        setTotalOrders(data.totalCount || 0);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đơn hàng:", error);
      }
    },
    []
  );

  const fetchAllAdminOrders = useCallback(async () => {
    if (!session?.user?.role || session.user.role !== "admin") {
      console.error("Only admins can fetch all orders");
      return;
    }

    try {
      const response = await fetch("/api/admin/orders/all", {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch all orders");
      const data = await response.json();

      setOrders(data.orders || []);
    } catch (error) {
      console.error("Error fetching all orders:", error);
      setOrders([]);
    }
  }, [session]);

  const cancelOrder = useCallback(
    async (orderId: string) => {
      try {
        const response = await fetch("/api/admin/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, action: "cancel" }),
          credentials: "include",
        });
        if (!response.ok) {
          console.error("Không thể hủy đơn hàng");
          return;
        }
        fetchAdminOrders({
          status: "",
          startDate: "",
          endDate: "",
          page: 1,
          limit: 10,
        });
      } catch (error) {
        console.error("Lỗi khi hủy đơn hàng:", error);
      }
    },
    [fetchAdminOrders]
  );

  const contactCustomer = useCallback(async (orderId: string) => {
    try {
      const response = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, action: "contact" }),
        credentials: "include",
      });
      if (!response.ok) {
        console.error("Không thể gửi yêu cầu liên hệ");
        return;
      }
      alert("Yêu cầu liên hệ đã được gửi!");
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu liên hệ:", error);
    }
  }, []);

  // Lấy danh sách đơn hàng cho từng user
  const fetchUserOrders = useCallback(async () => {
    if (!session?.user?.id) {
      setOrders([]);
      return;
    }
    try {
      const response = await fetch(`/api/orders?userId=${session.user.id}`, {
        credentials: "include",
      });
      if (!response.ok) {
        console.error("Không thể lấy danh sách đơn hàng");
        return;
      }
      const data = await response.json();
      setOrders(data || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    }
  }, [session?.user?.id]);

  // user xác nhận đã nhận được hàng thì sẽ gọi request này
  const confirmOrder = useCallback(
    async (orderId: string) => {
      try {
        const response = await fetch("/api/orders/update-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, status: "SUCCESS" }),
          credentials: "include",
        });

        if (!response.ok) {
          let errorMessage = "Không thể xác nhận đơn hàng";
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch {
            console.error("Non-JSON response:", await response.text());
          }
          alert(errorMessage);
          throw new Error(errorMessage);
        }

        const data = await response.json();
        toast.success("Xác nhận nhận hàng thành công!");
        fetchUserOrders(); // Làm mới danh sách đơn hàng
      } catch (error: any) {
        alert(error.message || "Đã xảy ra lỗi khi xác nhận đơn hàng");
      }
    },
    [fetchUserOrders]
  );

  const submitReview = useCallback(
    async (
      orderId: string,
      productId: string,
      rating: number,
      comment: string
    ) => {
      try {
        const response = await fetch("/api/review", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, productId, rating, comment }),
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Không thể gửi đánh giá");
        }

        const data = await response.json();
        return data;
      } catch (error: any) {
        console.error("Lỗi khi gửi đánh giá:", error.message);
        throw error;
      }
    },
    []
  );

  const fetchAdminReviews = useCallback(
    async ({
      page = 1,
      limit = 10,
      isApproved,
    }: { page?: number; limit?: number; isApproved?: boolean } = {}) => {
      try {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        if (isApproved !== undefined)
          params.append("isApproved", isApproved.toString());

        const response = await fetch(`/api/admin/review?${params.toString()}`, {
          credentials: "include",
        });

        if (!response.ok) {
          console.log("Khong the lay danh sach danh gia");
          return;
        }
        const data = await response.json();
        setAdminReviews(data.reviews || []);
        setTotalReviews(data.totalCount || 0);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đánh giá:", error);
      }
    },
    []
  );

  const fetchUserReviews = useCallback(async () => {
    if (!session?.user?.id) {
      setUserReviews([]);
      return;
    }
    try {
      const response = await fetch(`/api/review?userId=${session.user.id}`, {
        credentials: "include",
      });
      if (!response.ok) {
        console.error("Không thể lấy danh sách đánh giá của người dùng");
        return;
      }
      const data = await response.json();
      setUserReviews(data.reviews || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đánh giá của người dùng:", error);
    }
  }, [session?.user?.id]);

  const fetchReviews = useCallback(async (productId: string) => {
    try {
      const response = await fetch(`/api/review?productId=${productId}`, {
        credentials: "include",
      });
      if (!response.ok) {
        console.error("Không thể lấy danh sách đánh giá cho sản phẩm");
        return;
      }
      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đánh giá cho sản phẩm:", error);
    }
  }, []);

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
        totalFavorites,
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
        // voucher functionality
        appliedVoucher,
        applyVoucher,
        removeVoucher,
        // order
        orders,
        totalOrders,
        fetchAdminOrders,
        fetchAllAdminOrders,
        cancelOrder,
        contactCustomer,
        confirmOrder,
        fetchUserOrders,

        // review
        submitReview,
        fetchAdminReviews,
        adminReviews,
        totalReviews,
        fetchUserReviews,
        userReviews,
        fetchReviews,
        reviews,
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
