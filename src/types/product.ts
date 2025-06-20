export interface ProductType {
  _id?: string;
  name: string;
  brand: string;
  category: string;
  images: string[];
  description?: string;
  price: number;
  salePrice?: number;
  quantity: number;
  configuration?: Record<string, string | number | boolean | undefined>;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
