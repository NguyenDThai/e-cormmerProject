import connectToDatabase from "@/lib/mongodb";
import FlashSale from "@/models/flashSale";
import Product from "@/models/product";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET - Lấy flash sale theo ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params;

    const flashSale = await FlashSale.findById(id)
      .populate({
        path: "products",
        select:
          "name brand category images price salePrice quantity description",
      })
      .populate("createdBy", "name email");

    if (!flashSale) {
      return NextResponse.json(
        { error: "Flash sale not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ flashSale }, { status: 200 });
  } catch (error) {
    console.error("Error fetching flash sale:", error);
    return NextResponse.json(
      { error: "Failed to fetch flash sale" },
      { status: 500 }
    );
  }
}

// PUT - Cập nhật flash sale
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const { id } = await params;
    const body = await request.json();

    const {
      name,
      description,
      startTime,
      endTime,
      discountPercent,
      products,
      maxQuantityPerUser,
      isActive,
    } = body;

    // Find existing flash sale
    const existingFlashSale = await FlashSale.findById(id);
    if (!existingFlashSale) {
      return NextResponse.json(
        { error: "Flash sale not found" },
        { status: 404 }
      );
    }

    // Validate dates if provided
    if (startTime && endTime) {
      const start = new Date(startTime);
      const end = new Date(endTime);

      if (start >= end) {
        return NextResponse.json(
          { error: "End time must be after start time" },
          { status: 400 }
        );
      }
    }

    // Validate discount percent if provided
    if (
      discountPercent !== undefined &&
      (discountPercent < 0 || discountPercent > 100)
    ) {
      return NextResponse.json(
        { error: "Discount percent must be between 0 and 100" },
        { status: 400 }
      );
    }

    // Validate products if provided
    if (products && products.length > 0) {
      const existingProducts = await Product.find({
        _id: { $in: products },
      });

      if (existingProducts.length !== products.length) {
        return NextResponse.json(
          { error: "Some products do not exist" },
          { status: 400 }
        );
      }
    }

    const oldProductIds = existingFlashSale.products.map((p) => p.toString());
    const newProductIds = products ? products : oldProductIds;

    // Logic to handle product price updates
    // const productsToAdd = newProductIds.filter((id: string) => !oldProductIds.includes(id));
    const productsToRemove = oldProductIds.filter(
      (id: string) => !newProductIds.includes(id)
    );

    // Update flash sale
    const updateData: Record<string, unknown> = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (startTime) updateData.startTime = new Date(startTime);
    if (endTime) updateData.endTime = new Date(endTime);
    if (discountPercent !== undefined)
      updateData.discountPercent = discountPercent;
    if (products) updateData.products = products;
    if (maxQuantityPerUser !== undefined)
      updateData.maxQuantityPerUser = maxQuantityPerUser;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedFlashSale = await FlashSale.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate(
        "products",
        "name brand category images price salePrice quantity"
      )
      .populate("createdBy", "name email");

    if (!updatedFlashSale) {
      return NextResponse.json(
        { error: "Failed to update flash sale" },
        { status: 500 }
      );
    }

    // Remove salePrice from products that are no longer in the flash sale
    if (productsToRemove.length > 0) {
      await Product.updateMany(
        { _id: { $in: productsToRemove } },
        { $unset: { salePrice: "" } }
      );
    }

    // Update product sale prices for new and existing products
    const productsToUpdate = newProductIds;
    const newDiscountPercent =
      discountPercent !== undefined
        ? discountPercent
        : existingFlashSale.discountPercent;

    // Determine the final active state
    const finalIsActive =
      isActive !== undefined ? isActive : existingFlashSale.isActive;

    if (finalIsActive) {
      await Promise.all(
        productsToUpdate.map(async (productId: string) => {
          const product = await Product.findById(productId);
          if (product) {
            const salePrice = Math.round(
              product.price * (1 - newDiscountPercent / 100)
            );
            await Product.findByIdAndUpdate(productId, { salePrice });
          }
        })
      );
    } else {
      // If the entire sale is made inactive, remove salePrice from all associated products
      await Product.updateMany(
        { _id: { $in: productsToUpdate } },
        { $unset: { salePrice: "" } }
      );
    }

    return NextResponse.json(
      {
        message: "Flash sale updated successfully",
        flashSale: updatedFlashSale,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating flash sale:", error);
    return NextResponse.json(
      { error: "Failed to update flash sale" },
      { status: 500 }
    );
  }
}

// DELETE - Xóa flash sale
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const { id } = await params;

    const flashSale = await FlashSale.findById(id);
    if (!flashSale) {
      return NextResponse.json(
        { error: "Flash sale not found" },
        { status: 404 }
      );
    }

    // Remove sale prices from products
    await Product.updateMany(
      { _id: { $in: flashSale.products } },
      { $unset: { salePrice: 1 } }
    );

    // Delete flash sale
    await FlashSale.findByIdAndDelete(id);

    return NextResponse.json(
      {
        message: "Flash sale deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting flash sale:", error);
    return NextResponse.json(
      { error: "Failed to delete flash sale" },
      { status: 500 }
    );
  }
}
