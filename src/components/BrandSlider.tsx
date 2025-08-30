import { motion } from "framer-motion";
import Image from "next/image";

const BrandSlider = () => {
  const brands = [
    { id: 1, name: "Apple", logo: "/apple.png" },
    { id: 2, name: "Logitech", logo: "/logitech.png" },
    { id: 3, name: "Asus", logo: "/asus.png" },
    { id: 4, name: "Samsung", logo: "/samsung.png" },
    { id: 5, name: "Sony", logo: "/sony.png" },
    { id: 6, name: "Microsoft", logo: "/microsoft.png" },
    { id: 7, name: "Dell", logo: "/dell.png" },
    { id: 8, name: "HP", logo: "/hp.png" },
    { id: 9, name: "Lenovo", logo: "/lenovo.png" },
    { id: 10, name: "Acer", logo: "/acer.png" },
  ];

  return (
    <div className="py-16 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
          Đối tác & Thương hiệu
        </h2>

        <div className="relative">
          {/* Gradient overlay */}
          {/* <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-gray-50 to-transparent z-10"></div>
          <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-gray-50 to-transparent z-10"></div> */}

          <motion.div
            className="flex space-x-12"
            animate={{
              x: [0, -1030], // Điều chỉnh giá trị này dựa trên tổng chiều rộng của các brand
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 30,
                ease: "linear",
              },
            }}
          >
            {brands.map((brand) => (
              <motion.div
                key={brand.id}
                className="flex-shrink-0 flex items-center justify-center px-8 py-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="relative w-40 h-20 grayscale hover:grayscale-0 transition-all duration-300 opacity-80 hover:opacity-100">
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    layout="fill"
                    objectFit="contain"
                    className="filter contrast-75 hover:contrast-100 transition-all duration-300"
                  />
                </div>
              </motion.div>
            ))}

            {/* Nhân bản để tạo hiệu ứng vô tận */}
            {brands.map((brand) => (
              <motion.div
                key={`duplicate-${brand.id}`}
                className="flex-shrink-0 flex items-center justify-center px-8 py-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="relative w-40 h-20 grayscale hover:grayscale-0 transition-all duration-300 opacity-80 hover:opacity-100">
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    layout="fill"
                    objectFit="contain"
                    className="filter contrast-75 hover:contrast-100 transition-all duration-300"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BrandSlider;
