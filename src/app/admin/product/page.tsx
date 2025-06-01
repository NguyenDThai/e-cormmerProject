import { Button } from "@/components/ui/button";
import Link from "next/link";

const ProductPage = () => {
  return (
    <div className="h-screen">
      <h1>Danh sach san pham</h1>
      <Link href="/admin/product/add-product">
        <Button>Them san pham</Button>
      </Link>
    </div>
  );
};

export default ProductPage;
