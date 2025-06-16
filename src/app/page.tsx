import Banner from "@/components/Banner";
import ProductFeatured from "@/components/ProductFeatured";
import CategoriesList from "@/components/CategoriesList";
import RenderAllProduct from "@/components/RenderAllProduct";
import Coundown from "@/components/Coundown";

export default function Home() {
  return (
    <div className="container min-h-screen flex flex-col mx-auto ">
      {/* Banner */}
      <main className="flex-grow">
        <Banner />
        {/* Content Sections */}
        <div className="container mx-auto px-4 py-12">
          {/* Featured Section */}
          <section className="mb-16">
            <div className="flex flex-col">
              <div className="flex items-center">
                <span className="w-[20px] h-[40px] bg-blue-600 block rounded-md"></span>
                <p className="text-lg text-blue-500 ml-4">Hôm nay</p>
              </div>
              <div className="flex items-center gap-10">
                <h2 className="text-4xl font-semibold">Flash sale</h2>
                <Coundown />
              </div>
            </div>
            <ProductFeatured />
          </section>

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
