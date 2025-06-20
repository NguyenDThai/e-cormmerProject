/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextResponse } from "next/server";
import mongoose, { FlattenMaps, Types } from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/product";
import { v2 as cloudinary } from "cloudinary";

interface IProduct {
  _id: any;
  name: string;
  brand: string;
  category: string;
  price: number;
  description: string;
  salePrice?: number;
  quantity: number; // Added quantity
  images: string[];
  configuration: {
    ram: number;
    storage: number;
    screenSize: number;
    [key: string]: any;
  };
  __v?: number;
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid product ID format" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const product = (await Product.findById(
      id
    ).lean()) as FlattenMaps<IProduct> & { _id: Types.ObjectId };
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...product,
      _id: product._id.toString(),
      images: product.images, // Trả về mảng images
      quantity: product.quantity, // Added quantity
    });
  } catch (error) {
    console.error("[PRODUCT_EDIT_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid product ID format" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const brand = formData.get("brand") as string;
    const category = formData.get("category") as string;
    const price = parseFloat(formData.get("price") as string);
    const description = formData.get("description") as string;
    const quantity = parseFloat(formData.get("quantity") as string); // Added quantity
    const salePrice = formData.get("salePrice")
      ? parseFloat(formData.get("salePrice") as string)
      : undefined;
    const images = formData.getAll("images") as File[];
    const existingImages = JSON.parse(
      formData.get("existingImages") as string
    ) as string[];
    const deletedImages = JSON.parse(
      formData.get("deletedImages") as string
    ) as string[]; // Nhận danh sách ảnh bị xóa
    const configuration = formData.get("configuration")
      ? JSON.parse(formData.get("configuration") as string)
      : {};

    if (!name || !brand || !category || !price) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate quantity
    if (quantity < 0) {
      return NextResponse.json(
        { error: "Quantity must be non-negative" },
        { status: 400 }
      );
    }

    const validCategories = [
      "phone",
      "laptop",
      "airpod",
      "gaming",
      "mouse",
      "camera",
      "other",
    ];
    if (!validCategories.includes(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    // Convert configuration fields to numbers where applicable
    const cleanedConfiguration = {
      ram: configuration.ram ? parseFloat(configuration.ram) : undefined,
      storage: configuration.storage
        ? parseFloat(configuration.storage)
        : undefined,
      screenSize: configuration.screenSize
        ? parseFloat(configuration.screenSize)
        : undefined,
      battery: configuration.battery
        ? parseFloat(configuration.battery)
        : undefined,
      processor: configuration.processor || undefined,
      cpu: configuration.cpu || undefined,
      gpu: configuration.gpu || undefined,
      sensorResolution: configuration.sensorResolution
        ? parseFloat(configuration.sensorResolution)
        : undefined,
      lensType: configuration.lensType || undefined,
      videoResolution: configuration.videoResolution || undefined,
      type: configuration.type || undefined,
      features: configuration.features || [],
      custom: configuration.custom || {},
    };

    const filteredConfiguration = Object.fromEntries(
      Object.entries(cleanedConfiguration).filter(([_, v]) => v !== undefined)
    );

    const currentProduct = (await Product.findById(id).lean()) as IProduct;
    let updatedImages = currentProduct.images || [];

    // Xử lý ảnh mới
    if (images.length > 0) {
      for (const image of images) {
        if (image.size > 0) {
          try {
            const arrayBuffer = await image.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const uploadResult = await new Promise((resolve, reject) => {
              cloudinary.uploader
                .upload_stream({ folder: "products" }, (error, result) => {
                  if (error) reject(error);
                  else resolve(result);
                })
                .end(buffer);
            });
            updatedImages.push((uploadResult as any).secure_url);
            console.log("Uploaded Image:", (uploadResult as any).secure_url);
          } catch (uploadError) {
            console.error("Upload Error:", uploadError);
            continue;
          }
        }
      }
    }

    // Kết hợp existingImages với updatedImages (bao gồm ảnh mới)
    updatedImages = [...new Set([...existingImages, ...updatedImages])];
    console.log("Updated Images Before Delete:", updatedImages);

    // Xóa ảnh từ deletedImages
    for (const img of deletedImages) {
      try {
        const publicId = img.split("/").pop()?.split(".")[0];
        if (publicId) {
          await cloudinary.uploader.destroy(`products/${publicId}`);
          console.log("Deleted Image Public ID from Deleted List:", publicId);
          updatedImages = updatedImages.filter((url) => url !== img); // Loại bỏ khỏi updatedImages
        }
      } catch (deleteError) {
        console.error("Delete Error:", deleteError);
      }
    }

    // Xóa ảnh không còn trong updatedImages (tránh trùng lặp với deletedImages)
    const imagesToDelete = currentProduct.images.filter(
      (img) => !updatedImages.includes(img) && !deletedImages.includes(img)
    );
    for (const img of imagesToDelete) {
      try {
        const publicId = img.split("/").pop()?.split(".")[0];
        if (publicId) {
          await cloudinary.uploader.destroy(`products/${publicId}`);
          console.log("Deleted Image Public ID:", publicId);
        }
      } catch (deleteError) {
        console.error("Delete Error:", deleteError);
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        $set: {
          name,
          brand,
          category,
          price,
          description,
          salePrice,
          quantity, // Added quantity
          images: updatedImages,
          configuration: filteredConfiguration,
          updatedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...updatedProduct.toObject(),
        _id: updatedProduct._id.toString(),
        images: updatedProduct.images,
        quantity: updatedProduct.quantity, // Added quantity
      },
    });
  } catch (error) {
    console.error("[PRODUCT_EDIT_PUT]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const result = await Product.deleteOne({ _id: new mongoose.Types.ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
