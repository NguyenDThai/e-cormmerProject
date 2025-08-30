import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const ProductNewArrival = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut" as const,
      },
    },
  };
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
      className="mb-16 px-4 md:px-8"
    >
      {/* Section Header */}
      <motion.div variants={itemVariants} className="mb-12">
        <div className="flex items-center mb-3">
          <span className="w-5 h-10 bg-blue-600 rounded-md"></span>
          <p className="text-lg font-medium text-blue-600 ml-4 tracking-wide">
            SẢN PHẨM NỔI BẬT
          </p>
        </div>
        <h2 className="text-4xl font-semibold text-gray-900">
          Sản phẩm mới về
        </h2>
        <div className="w-20 h-1 bg-blue-600 mt-4"></div>
      </motion.div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Main Product - PlayStation */}
        <motion.div
          variants={itemVariants}
          className="group relative bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden h-[600px] flex items-end justify-center transition-all duration-500 hover:shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
          <Image
            src="/playstation.png"
            alt="PlayStation 5"
            width={511}
            height={400}
            className="w-4/5 object-contain transform group-hover:scale-105 transition-transform duration-700 z-0"
          />
          <div className="absolute bottom-8 left-8 z-20 flex flex-col gap-4 max-w-xs">
            <p className="text-white text-2xl md:text-3xl font-bold">
              PlayStation 5
            </p>
            <p className="text-gray-300 text-sm md:text-base">
              Phiên bản màu đen và trắng của PS5 sắp ra mắt với hiệu suất đột
              phá.
            </p>
            <button className="flex items-center text-white font-medium text-lg group-hover:text-blue-400 transition-colors duration-300">
              Xem ngay
              <svg
                className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </div>
        </motion.div>

        {/* Secondary Products Column */}
        <motion.div
          variants={containerVariants}
          className="flex flex-col gap-6 md:gap-8"
        >
          {/* Women's Collection */}
          <motion.div
            variants={itemVariants}
            className="group relative bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden h-[286px] flex items-center transition-all duration-500 hover:shadow-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-10"></div>
            <div className="w-1/2 z-0">
              <Image
                src="/woman.png"
                alt="Bộ sưu tập của phụ nữ"
                width={432}
                height={286}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="absolute right-8 z-20 flex flex-col gap-3 max-w-xs text-right">
              <p className="text-white text-xl md:text-2xl font-bold">
                Bộ sưu tập của phụ nữ
              </p>
              <p className="text-gray-300 text-sm">
                Bộ sưu tập phụ nữ mang đến cho bạn một phong cách và sự tự tin
                khác biệt.
              </p>
              <button className="flex items-center justify-end text-white font-medium text-lg group-hover:text-blue-400 transition-colors duration-300 self-end">
                Xem ngay
                <svg
                  className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
            </div>
          </motion.div>

          {/* Smaller Products Row */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-2 gap-6 md:gap-8"
          >
            {/* Speaker */}
            <motion.div
              variants={itemVariants}
              className="group relative bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden h-[286px] flex flex-col items-center justify-center p-6 transition-all duration-500 hover:shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
              <Image
                src="/speakers.png"
                alt="Loa không dây Amazon"
                width={210}
                height={210}
                className="z-0 transform group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute bottom-6 left-6 z-20 flex flex-col gap-2">
                <p className="text-white text-xl font-bold">Loa</p>
                <p className="text-gray-300 text-sm">Loa không dây Amazon</p>
                <button className="text-white font-medium text-base group-hover:text-blue-400 transition-colors duration-300">
                  Xem ngay
                </button>
              </div>
            </motion.div>

            {/* Perfume */}
            <motion.div
              variants={itemVariants}
              className="group relative bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden h-[286px] flex flex-col items-center justify-center p-6 transition-all duration-500 hover:shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
              <Image
                src="/gucci.png"
                alt="Nước hoa Gucci"
                width={210}
                height={210}
                className="z-0 transform group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute bottom-6 left-6 z-20 flex flex-col gap-2">
                <p className="text-white text-xl font-bold">Nước hoa</p>
                <p className="text-gray-300 text-sm">Nước hoa Gucci cao cấp</p>
                <button className="text-white font-medium text-base group-hover:text-blue-400 transition-colors duration-300">
                  Xem ngay
                </button>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ProductNewArrival;
