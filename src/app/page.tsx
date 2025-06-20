'use client';

import Banner from "@/components/Banner";
import ProductFeatured from "@/components/ProductFeatured";
import CategoriesList from "@/components/CategoriesList";
import RenderAllProduct from "@/components/RenderAllProduct";
import FlashSaleBanner from "@/components/FlashSaleBanner";
import FlashSaleSectionHeader from "@/components/FlashSaleSectionHeader";
import { useFlashSale } from "@/hooks/useFlashSale";

export default function Home() {
  const { activeFlashSale, hasActiveFlashSale, isLoading, error, refreshFlashSale } = useFlashSale();

  // Handler when flash sale expires
  const handleFlashSaleExpire = () => {
    // Refresh flash sale data to check for new active sales
    setTimeout(() => {
      refreshFlashSale();
    }, 1000);
  };

  return (
    <div className="container min-h-screen flex flex-col mx-auto ">
      {/* Banner */}
      <main className="flex-grow">
        <Banner />
        {/* Content Sections */}
        <div className="container mx-auto px-4 py-12">
          {/* Flash Sale Banner */}
          {hasActiveFlashSale && activeFlashSale && (
            <FlashSaleBanner 
              flashSale={activeFlashSale}
              onExpire={handleFlashSaleExpire}
            />
          )}

          {/* Featured Section - Flash Sale Products */}
          {(isLoading || hasActiveFlashSale) && (
            <section className="mb-16">
              <FlashSaleSectionHeader 
                flashSale={activeFlashSale}
                isLoading={isLoading}
                error={error}
                onRetry={refreshFlashSale}
              />
              
              {/* Products in Flash Sale */}
              {hasActiveFlashSale && <ProductFeatured />}
            </section>
          )}

          {/* No Flash Sale Message */}
          {!isLoading && !hasActiveFlashSale && !error && (
            <section className="mb-16">
              <div className="flex flex-col">
                <div className="flex items-center">
                  <span className="w-[20px] h-[40px] bg-gray-400 block rounded-md"></span>
                  <p className="text-lg text-gray-500 ml-4">Flash Sale</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center mt-4">
                  <div className="text-gray-500 mb-2">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg font-medium">Hiện tại chưa có Flash Sale</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Hãy theo dõi để không bỏ lỡ các deal hấp dẫn sắp tới!
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* categories */}
          <section className="mb-16">
            <div className="flex items-center">
              <span className="w-[20px] h-[40px] bg-blue-600 block rounded-md"></span>
              <p className="text-lg text-blue-500 ml-4">Danh sách sản phẩm</p>
            </div>
            <h2 className="text-4xl font-semibold mt-5">
              Theo thể loại sản phẩm
            </h2>
            <CategoriesList />
          </section>

          {/* San pham cua chung toi */}
          <section>
            <div className="flex items-center">
              <span className="w-[20px] h-[40px] bg-blue-600 block rounded-md"></span>
              <p className="text-lg text-blue-500 ml-4">
                Sản phẩm của chúng tôi
              </p>
            </div>
            <h2 className="text-4xl font-semibold mt-5">
              Khám phá sản phẩm của chúng tôi
            </h2>
            <RenderAllProduct />
          </section>
        </div>
      </main>
    </div>
  );
}
