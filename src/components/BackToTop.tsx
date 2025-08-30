"use client";
import React, { useEffect, useState } from "react";
import { HiArrowLongUp } from "react-icons/hi2";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Hiển thị nút khi cuộn xuống 300px
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Cuộn lên đầu trang mượt mà
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-40 right-8 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 group"
          aria-label="Back to top"
        >
          <HiArrowLongUp className="w-6 h-6 transform group-hover:-translate-y-1 transition-transform" />
        </button>
      )}
    </>
  );
};

export default BackToTop;
