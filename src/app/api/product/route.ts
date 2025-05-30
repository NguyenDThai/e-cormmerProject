import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/product";
import { v2 as cloudinary } from "cloudinary";

// config cloudinary

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  //   const session = await getServerSession();
  //   if (!session || !session.user.email || session.user.role !== "admin") {
  //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  //   }

  try {
    await connectToDatabase();
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const brand = formData.get("brand") as string;
    const category = formData.get("category") as string;
    const price = formData.get("price") as string;
    const description = formData.get("description") as string;
    const salePrice = formData.get("salePrice")
      ? parseFloat(formData.get("salePrice") as string)
      : undefined;
    const image = formData.get("image") as File;

    if (!name || !brand || !category || !price || !image) {
      return NextResponse.json(
        { error: "Missing required failds" },
        { status: 400 }
      );
    }

    // Kiem tra loai san pham neu khong co trong list thi se bao loi
    const validCategories = ["phone", "laptop", "airport", "gaming", "mouse"];
    if (!validCategories.includes(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    // upload hinh anh len cloudinary

    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadResult = await new Promise((res, rej) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "products",
        },
        (error, result) => {
          if (error) rej(error);
          else res(result);
        }
      );
      uploadStream.end(buffer);
    });

    const imageUrl = (uploadResult as any).secure_url;

    // tao san pham tren mongoDB

    const product = await Product.create({
      name,
      brand,
      category,
      image: imageUrl,
      price,
      description,
      salePrice,
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Error uploading product:", error);
    return NextResponse.json(
      { error: "Failed to upload product" },
      { status: 500 }
    );
  }
}
