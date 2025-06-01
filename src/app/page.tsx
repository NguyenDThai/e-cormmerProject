import Banner from "@/components/Banner";
import ProductFeatured from "@/components/ProductFeatured";

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

          {/* Call to Action */}
          <section className="bg-blue-600 text-white rounded-xl p-8 mb-16">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
              <p className="text-xl mb-6">
                Join thousands of satisfied customers today.
              </p>
              <button className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition duration-300">
                Sign Up Now
              </button>
            </div>
          </section>

          {/* Testimonials */}
          <section>
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
          </section>
        </div>
      </main>
    </div>
  );
}
