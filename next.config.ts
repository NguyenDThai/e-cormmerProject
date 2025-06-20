import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.freepik.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "cdn.viettelstore.vn",
        port: "",
      },
      {
        protocol: "https",
        hostname: "images.samsung.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "store.storeimages.cdn-apple.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "www.sony.com.vn",
        port: "",
      },
      {
        protocol: "https",
        hostname: "dlcdnwebimgs.asus.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "resource.logitechg.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "cdn.tgdd.vn",
        port: "",
      },
      {
        protocol: "https",
        hostname: "i.dell.com",
        port: "",
      },
    ],
  },
};

export default nextConfig;
