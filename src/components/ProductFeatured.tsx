"use client";
import React, { useRef } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";

const ProductFeatured = () => {
  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300, // Điều chỉnh giá trị này để thay đổi khoảng cuộn
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300, // Điều chỉnh giá trị này để thay đổi khoảng cuộn
        behavior: "smooth",
      });
    }
  };
  return (
    <div className="relative ">
      {/* Nút mũi tên trái */}
      <button
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300"
        aria-label="Scroll left"
      >
        <FaChevronLeft />
      </button>

      {/* Container sản phẩm */}
      <div
        ref={scrollContainerRef}
        className="grid grid-flow-col auto-cols-[minmax(300px,1fr)] gap-8 overflow-x-hidden scrollbar-hide snap-x snap-mandatory py-4 px-2"
      >
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 snap-start"
          >
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Product Image {item}</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Product {item}
              </h3>
              <p className="text-gray-600 mb-4">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </p>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition duration-300">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Nút mũi tên phải */}
      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300"
        aria-label="Scroll right"
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default ProductFeatured;
