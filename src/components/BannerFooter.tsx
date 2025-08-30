"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "./ui/button";

const BannerFooter = () => {
  // / Variants for animation
  const bannerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const,
      },
    },
  };

  const floatVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
  };
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={bannerVariants}
      className="relative mb-16 bg-gradient-to-r from-gray-900 to-black w-full h-[500px] flex items-center justify-between overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj4KICA8ZyBmaWxsPSJub25lIiBzdHJva2U9IiMwMDciIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iMC4yIj4KICAgIDxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjE1Ii8+CiAgICA8Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyNSIvPgogIDwvZz4KPC9zdmc+')]"></div>
      </div>

      {/* Content section */}
      <motion.div
        variants={contentVariants}
        className="relative z-10 w-[500px] ml-[56px] space-y-8"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-blue-400 font-medium text-lg tracking-wider"
        >
          LOẠI SẢN PHẨM
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-5xl font-bold text-white leading-tight"
        >
          Nâng cao trải nghiệm <span className="text-blue-400">âm nhạc</span>{" "}
          của bạn
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-gray-300 text-lg max-w-md"
        >
          Khám phá các sản phẩm âm thanh cao cấp với chất lượng vượt trội, thiết
          kế tinh tế và công nghệ tiên tiến.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="flex gap-4"
        >
          <Button className="px-10 py-4 rounded-lg bg-blue-600 text-white font-medium text-lg hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl flex items-center gap-2 group">
            Mua ngay
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
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
          </Button>

          <Button className="px-10 py-4 rounded-lg bg-transparent border border-gray-600 text-white font-medium text-lg hover:bg-white/10 transition-all duration-300">
            Xem thêm
          </Button>
        </motion.div>
      </motion.div>

      {/* Image section */}
      <motion.div
        variants={imageVariants}
        className="relative z-10 w-[600px] mr-12 transform hover:scale-105 transition-transform duration-700"
      >
        <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl"></div>
        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.5 }}>
          <Image
            src="/bannersection.png"
            alt="banner-footer"
            width={600}
            height={500}
            className="w-full h-auto object-contain relative z-10"
          />
        </motion.div>

        {/* Floating elements */}
        <motion.div
          variants={floatVariants}
          animate="animate"
          className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/30 rounded-full blur-xl"
        ></motion.div>
        <motion.div
          variants={floatVariants}
          animate="animate"
          transition={{ delay: 2 }}
          className="absolute bottom-8 -left-8 w-32 h-32 bg-purple-500/30 rounded-full blur-xl"
        ></motion.div>
      </motion.div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black/50 to-transparent"></div>
    </motion.div>
  );
};

export default BannerFooter;
