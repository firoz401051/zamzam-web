"use server";

import { auth } from "@clerk/nextjs/server";
import { deleteReview, createReview, updateReviewStatus } from "@/sanity/helpers/reviewHelpers";

import { revalidatePath } from "next/cache";

export async function deleteReviewAction(reviewId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        error: "You must be logged in to delete a review",
      };
    }

    await deleteReview(reviewId, userId);

    // Revalidate the reviews page
    revalidatePath("/user/reviews");

    return {
      success: true,
      message: "Review deleted successfully",
    };
  } catch (error: any) {
    console.error("Error in deleteReviewAction:", error);
    return {
      success: false,
      error: error.message || "Failed to delete review",
    };
  }
}

export async function createReviewAction(formData: FormData) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        error: "You must be logged in to submit a review",
      };
    }

    const productId = formData.get("productId") as string;
    const rating = parseInt(formData.get("rating") as string);
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const userName = formData.get("userName") as string;
    const userEmail = formData.get("userEmail") as string;

    if (!productId || !rating || !title || !content || !userName || !userEmail) {
      return {
        success: false,
        error: "All fields are required",
      };
    }

    await createReview({
      clerkUserId: userId,
      product: {
        _type: "reference",
        _ref: productId,
      },
      userName,
      userEmail,
      rating,
      title,
      content,
      verified: false, // Could optimize this with order check later
    });

    revalidatePath(`/products/${productId}`);
    revalidatePath("/user/reviews");
    // Admin dashboard path validation
    revalidatePath("/admin/reviews");

    return {
      success: true,
      message: "Review submitted successfully! It will be visible after moderation.",
    };
  } catch (error: any) {
    console.error("Error in createReviewAction:", error);
    return {
      success: false,
      error: error.message || "Failed to submit review",
    };
  }
}

export async function updateReviewStatusAction(
  reviewId: string,
  status: string,
  rejectionReason?: string
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    await updateReviewStatus(reviewId, status, rejectionReason);
    
    revalidatePath("/admin/reviews");
    revalidatePath("/user/reviews");
    // Revalidate all products potentially (or we need to know the product ID)
    // For now, simple revalidation is fine. Ideally we'd pass productId to this action too.
    
    return { success: true };
  } catch (error: any) {
    console.error("Error in updateReviewStatusAction:", error);
    return {
      success: false,
      error: error.message || "Failed to update review status",
    };
  }
}
