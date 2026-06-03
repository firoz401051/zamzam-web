import { backendClient } from "@/sanity/lib/backendClient";
import { writeClient } from "@/sanity/lib/client";


// Get all reviews for a specific user
export async function getUserReviews(userId: string) {
  try {
    const query = `*[_type == "review" && clerkUserId == $userId] | order(_createdAt desc) {
      _id,
      _createdAt,
      _updatedAt,
      "product": product->{
        _id,
        name,
        "image": images[0]
      },
      rating,
      title,
      content,
      status,
      rejectionReason,
      likes,
      helpful,
      verified,
      orderNumber
    }`;

    const reviews = await backendClient.fetch(query, { userId });
    return reviews;
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    return [];
  }
}

// Delete a review (only if not approved)
export async function deleteReview(reviewId: string, userId: string) {
  try {
    // First check if review belongs to user and is not approved
    const review = await backendClient.fetch(
      `*[_type == "review" && _id == $reviewId && clerkUserId == $userId][0]{
        _id,
        status
      }`,
      { reviewId, userId }
    );

    if (!review) {
      throw new Error(
        "Review not found or you don't have permission to delete it"
      );
    }

    if (review.status === "approved") {
      throw new Error("Cannot delete approved reviews");
    }

    await backendClient.delete(reviewId);
    return { success: true };
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;
  }
}

// Get review statistics for a user
export async function getUserReviewStats(userId: string) {
  try {
    const query = `{
      "total": count(*[_type == "review" && clerkUserId == $userId]),
      "approved": count(*[_type == "review" && clerkUserId == $userId && status == "approved"]),
      "pending": count(*[_type == "review" && clerkUserId == $userId && status == "pending"]),
      "rejected": count(*[_type == "review" && clerkUserId == $userId && status == "rejected"])
    }`;

    const stats = await backendClient.fetch(query, { userId });
    return stats;
  } catch (error) {
    console.error("Error fetching review stats:", error);
    return { total: 0, approved: 0, pending: 0, rejected: 0 };
  }
}

// Get approved reviews for a specific product
export async function getProductReviews(productId: string) {
  try {
    const query = `*[_type == "review" && product._ref == $productId && status == "approved"] | order(_createdAt desc) {
      _id,
      _createdAt,
      userName,
      rating,
      title,
      content,
      helpful,
      verified
    }`;

    const reviews = await backendClient.fetch(query, { productId });
    return reviews;
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    return [];
  }
}

// Define minimal interfaces for local usage if not imported
interface ReviewInput {
  rating: number;
  title: string;
  content: string;
  productId: string;
  userId: string;
  userName: string;
  // Add other fields as needed
  [key: string]: unknown;
}

interface ReviewRating {
  rating: number;
}

// Create a new review
export async function createReview(reviewData: ReviewInput) {
  try {
    const newReview = await writeClient.create({
      _type: "review",
      status: "pending", // Always pending initially
      ...reviewData,
    });
    return newReview;
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;
  }
}

// Get all reviews (for admin)
export async function getAllReviews() {
  try {
    const query = `*[_type == "review"] | order(_createdAt desc) {
      _id,
      _createdAt,
      "product": product->{
        _id,
        name,
        "image": images[0]
      },
      userName,
      userEmail,
      rating,
      title,
      content,
      status,
      rejectionReason
    }`;

    const reviews = await backendClient.fetch(query);
    return reviews;
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    return [];
  }
}

// Update product rating stats
async function updateProductRating(productId: string) {
  try {
    // 1. Fetch all approved reviews for the product
    const reviews: ReviewRating[] = await backendClient.fetch(
      `*[_type == "review" && product._ref == $productId && status == "approved"] { rating }`,
      { productId }
    );

    // 2. Calculate stats
    const totalReviews = reviews.length;
    const sumRating = reviews.reduce((acc: number, r) => acc + (r.rating || 0), 0);
    const averageRating = totalReviews > 0 ? sumRating / totalReviews : 0;

    const ratingBreakdown = {
      five: reviews.filter((r) => r.rating === 5).length,
      four: reviews.filter((r) => r.rating === 4).length,
      three: reviews.filter((r) => r.rating === 3).length,
      two: reviews.filter((r) => r.rating === 2).length,
      one: reviews.filter((r) => r.rating === 1).length,
    };

    // 3. Update Product
    await writeClient
      .patch(productId)
      .set({
        averageRating,
        totalReviews,
        ratingBreakdown,
      })
      .commit();
      
  } catch (error) {
    console.error("Error updating product rating:", error);
  }
}

// Update review status (admin)
export async function updateReviewStatus(
  reviewId: string,
  status: string,
  rejectionReason?: string
) {
  try {
    // 1. Get the review first to find the product ID
    const review = await backendClient.fetch(
      `*[_type == "review" && _id == $reviewId][0]{ product }`,
      { reviewId }
    );

    if (!review) throw new Error("Review not found");

    const updateData: { status: string; rejectionReason?: string } = { status };
    if (status === "rejected" && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    // 2. Update the review status
    await writeClient.patch(reviewId).set(updateData).commit();

    // 3. Update the product's aggregated rating
    if (review.product?._ref) {
      // We start this but don't await it to keep the UI snappy? 
      // Actually, for admin actions, it's better to await to ensure consistency.
      await updateProductRating(review.product._ref);
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating review status:", error);
    throw error;
  }
}
