"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const banners = [
    "/banner1.jpg",
    "/banner2.jpg",
    "/banner3.jpg",
    "/banner4.jpg",
    "/banner5.jpg",
  ];

  // Tự động chuyển slide sau mỗi 5 giây
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);
  return (
    <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden">
      {/* Các banner */}
      {banners.map((banner, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={banner}
            alt={`banner ${index + 1}`}
            layout="fill"
            objectFit="cover" // Đảm bảo ảnh cover toàn bộ khu vực
            priority={index === 0}
          />
        </div>
      ))}

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${
              index === currentSlide ? "bg-white" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;
