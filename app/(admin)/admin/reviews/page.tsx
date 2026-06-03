import React from "react";
import { getAllReviews } from "@/sanity/helpers/reviewHelpers";
import ReviewAdminTable from "@/components/reviews/ReviewAdminTable";

const ReviewsAdminPage = async () => {
  const reviews = await getAllReviews();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Review Moderation</h1>
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border text-sm font-medium">
          Total Reviews: {reviews.length}
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <ReviewAdminTable initialReviews={reviews} />
      </div>
    </div>
  );
};

export default ReviewsAdminPage;
