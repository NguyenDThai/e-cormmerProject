/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import { useState } from "react";

const ImageProductDetail = ({ productDetail }: any) => {
  const [currentImage, setCurrentImage] = useState(
    productDetail.images[0] || "/placeholder.jpg"
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
        <Image
          src={currentImage}
          alt={productDetail.name}
          width={500}
          height={500}
          className="w-full h-auto max-h-[500px] object-contain"
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Hình ảnh khác</h2>
        <div className="grid grid-cols-4 gap-2">
          {productDetail.images.map((img, index) => (
            <div
              key={index}
              className="relative w-full aspect-square bg-gray-50 rounded-lg overflow-hidden"
              onClick={() => setCurrentImage(img)}
            >
              <Image
                src={img || "/placeholder.jpg"}
                alt={`${productDetail.name} - Ảnh ${index + 2}`}
                width={300}
                height={300}
                className={`w-full h-full object-contain hover:opacity-75 transition-opacity ${
                  currentImage === img ? "ring-2 ring-blue-500" : ""
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageProductDetail;
