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
  image: string;
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
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

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
      imageUrl: product.image, // Map image to imageUrl for consistency
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
  { params }: { params: { id: string } }
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
    const salePrice = formData.get("salePrice")
      ? parseFloat(formData.get("salePrice") as string)
      : undefined;
    const image = formData.get("image") as File | null;
    const configuration = formData.get("configuration")
      ? JSON.parse(formData.get("configuration") as string)
      : {};

    if (!name || !brand || !category || !price) {
      return NextResponse.json(
        { error: "Missing required fields" },
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

    // Remove undefined fields
    const filteredConfiguration = Object.fromEntries(
      Object.entries(cleanedConfiguration).filter(([_, v]) => v !== undefined)
    );

    let imageUrl = (
      (await Product.findById(id).select("image").lean()) as IProduct
    )?.image;
    if (image && image.size > 0) {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "products" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(buffer);
      });
      imageUrl = (uploadResult as any).secure_url;
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
          image: imageUrl,
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
        imageUrl: updatedProduct.image,
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
