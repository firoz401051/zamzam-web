import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { writeClient } from "@/sanity/lib/client";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, address, city, state, zip, email, default: isDefault } = body;

    // Validate required fields
    if (!name || !address || !city || !state || !zip || !email) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // If this is being set as default, unset all other default addresses for this user
    if (isDefault) {
      const existingAddresses = await writeClient.fetch(
        `*[_type == "address" && userId == $userId && default == true]`,
        { userId }
      );

      // Update all existing default addresses to false
      for (const addr of existingAddresses) {
        await writeClient.patch(addr._id).set({ default: false }).commit();
      }
    }

    // Create the new address
    const addressData = {
      _type: "address",
      name,
      address,
      city,
      state,
      zip,
      email,
      default: isDefault || false,
      userId,
    };

    const newAddress = await writeClient.create(addressData);

    return NextResponse.json({
      success: true,
      address: newAddress,
      message: "Address added successfully",
    });
  } catch (error) {
    console.error("Error creating address:", error);
    return NextResponse.json(
      { error: "Failed to create address" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    // Fetch all addresses for the user
    const addresses = await writeClient.fetch(
      `*[_type == "address" && userId == $userId] | order(default desc, _createdAt desc)`,
      { userId }
    );

    return NextResponse.json({
      success: true,
      addresses,
    });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return NextResponse.json(
      { error: "Failed to fetch addresses" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      id,
      name,
      address,
      city,
      state,
      zip,
      email,
      default: isDefault,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Address ID is required" },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!name || !address || !city || !state || !zip || !email) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Verify the address belongs to the user
    const existingAddress = await writeClient.fetch(
      `*[_type == "address" && _id == $id && userId == $userId][0]`,
      { id, userId }
    );

    if (!existingAddress) {
      return NextResponse.json(
        { error: "Address not found or unauthorized" },
        { status: 404 }
      );
    }

    // If this is being set as default, unset all other default addresses for this user
    if (isDefault) {
      const existingAddresses = await writeClient.fetch(
        `*[_type == "address" && userId == $userId && default == true && _id != $id]`,
        { userId, id }
      );

      // Update all existing default addresses to false
      for (const addr of existingAddresses) {
        await writeClient.patch(addr._id).set({ default: false }).commit();
      }
    }

    // Update the address
    const updatedAddress = await writeClient
      .patch(id)
      .set({
        name,
        address,
        city,
        state,
        zip,
        email,
        default: isDefault || false,
      })
      .commit();

    return NextResponse.json({
      success: true,
      address: updatedAddress,
      message: "Address updated successfully",
    });
  } catch (error) {
    console.error("Error updating address:", error);
    return NextResponse.json(
      { error: "Failed to update address" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Address ID is required" },
        { status: 400 }
      );
    }

    // Verify the address belongs to the user
    const existingAddress = await writeClient.fetch(
      `*[_type == "address" && _id == $id && userId == $userId][0]`,
      { id, userId }
    );

    if (!existingAddress) {
      return NextResponse.json(
        { error: "Address not found or unauthorized" },
        { status: 404 }
      );
    }

    // Delete the address
    await writeClient.delete(id);

    return NextResponse.json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting address:", error);
    return NextResponse.json(
      { error: "Failed to delete address" },
      { status: 500 }
    );
  }
}
