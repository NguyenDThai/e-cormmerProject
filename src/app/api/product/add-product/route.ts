import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/product";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const ram = searchParams.get("ram");
    const storage = searchParams.get("storage");

    const query: Record<string, unknown> = {};
    if (category) query.category = category;
    if (ram) query["configuration.ram"] = parseInt(ram);
    if (storage) query["configuration.storage"] = parseInt(storage);

    const product = await Product.find(query)
      .select(
        "name brand category images description price salePrice quantity configuration"
      )
      .lean()
      .limit(20);

    const formattedProducts = product.map((product) => ({
      ...product,
    }));

    return NextResponse.json({ products: formattedProducts }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const brand = formData.get("brand") as string;
    const category = formData.get("category") as string;
    const price = formData.get("price") as string;
    const description = formData.get("description") as string;
    const quantity = formData.get("quantity") as string;
    const salePrice = formData.get("salePrice")
      ? parseFloat(formData.get("salePrice") as string)
      : undefined;
    const images = formData.getAll("images") as File[];

    const configuration = formData.get("configuration")
      ? JSON.parse(formData.get("configuration") as string)
      : {};

    if (!name || !brand || !category || !price || !images) {
      return NextResponse.json(
        { error: "Missing required failds" },
        { status: 400 }
      );
    }

    const validCategories = [
      "phone",
      "laptop",
      "airport",
      "gaming",
      "mouse",
      "camera",
      "other",
    ];
    if (!validCategories.includes(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const parsedQuantity = parseInt(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity < 0) {
      return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
    }

    const imageUrls = [];
    for (const image of images) {
      if (image.size > 0) {
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
        imageUrls.push((uploadResult as { secure_url: string }).secure_url);
      }
    }

    const cleanedConfiguration = Object.fromEntries(
      Object.entries(configuration).filter(
        ([, v]) => v !== "" && v !== null && v !== undefined
      )
    );

    const product = await Product.create({
      name,
      brand,
      category,
      images: imageUrls,
      price,
      description,
      salePrice,
      quantity: parsedQuantity,
      configuration: cleanedConfiguration,
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
