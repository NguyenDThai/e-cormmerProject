import Banner from "@/components/Banner";
import ProductFeatured from "@/components/ProductFeatured";
import CategoriesList from "@/components/CategoriesList";

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
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              Featured Products
            </h2>
            <ProductFeatured />
          </section>

          {/* categories */}
          <section>
            <div className="flex items-center">
              <span className="w-[20px] h-[40px] bg-blue-600 block rounded-md"></span>
              <p className="text-lg text-blue-500 ml-4">Danh sach san pham</p>
            </div>
            <h2 className="text-4xl font-semibold mt-5">
              Theo thể loại sản phẩm
            </h2>
            <CategoriesList />
          </section>

          {/* Testimonials */}
          {/* <section>
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              What Our Customers Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2].map((item) => (
                <div key={item} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                    <div>
                      <h4 className="font-semibold">Customer {item}</h4>
                      <p className="text-gray-500 text-sm">Verified Buyer</p>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    "Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quisquam voluptatum, quibusdam, voluptates, quia voluptate
                    quod quos voluptatibus quas quidem doloribus quae. Quisquam
                    voluptatum, quibusdam, voluptates."
                  </p>
                </div>
              ))}
            </div>
          </section> */}
        </div>
      </main>
    </div>
  );
}
