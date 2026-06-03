"use client"
import React, { useState } from "react";
import { RatingStars } from "../product/RatingStars";
import { 
  Star, 
  MessageSquare, 
  CheckCircle, 
  User,
  ThumbsUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import ReviewForm from "./ReviewForm";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface Review {
  _id: string;
  _createdAt: string;
  userName: string;
  rating: number;
  title: string;
  content: string;
  helpful: number;
  verified: boolean;
}

interface ProductReviewsProps {
  productId: string;
  reviews: Review[];
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId, reviews }) => {
  const { user } = useUser();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  // Count per star rating
  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    percentage: reviews.length > 0 
      ? (reviews.filter((r) => r.rating === star).length / reviews.length) * 100 
      : 0
  }));

  const handleWriteReview = () => {
    if (!user) {
      router.push("/sign-in");
      return;
    }
    setOpen(true);
  };

  return (
    <div className="space-y-8" id="reviews">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zamzam-text-dark">
          Customer Reviews
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Rating Summary */}
        <div className="md:col-span-4 space-y-6">
          <Card className="bg-gray-50 border-none">
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-zamzam-text-dark mb-2">
                  {averageRating}
                </div>
                  <div className="flex justify-center gap-1 mb-2">
                    <RatingStars rating={Number(averageRating)} size={20} showText={false} />
                  </div>
                <p className="text-sm text-zamzam-text-muted">
                  Based on {reviews.length} reviews
                </p>
              </div>

              <div className="space-y-2">
                {ratingCounts.map(({ star, count, percentage }) => (
                  <div key={star} className="flex items-center gap-2 text-sm">
                    <span className="w-3">{star}</span>
                    <Star className="w-3 h-3 text-gray-400" />
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-orange-400 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-gray-500">{count}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Sheet open={open} onOpenChange={setOpen}>
                  <SheetTrigger asChild>
                    <Button 
                      onClick={handleWriteReview}
                      className="w-full bg-zamzam-primary hover:bg-zamzam-primary-hover"
                    >
                      Write a Review
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Write a Review</SheetTitle>
                      <SheetDescription>
                        Share your experience with this product. Reviews are moderated before publishing.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6">
                      <ReviewForm 
                        productId={productId} 
                        onSuccess={() => setOpen(false)} 
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reviews List */}
        <div className="md:col-span-8 space-y-6">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review._id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <div className="font-medium text-sm text-zamzam-text-dark">
                        {review.userName}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-zamzam-text-muted">
                    {new Date(review._createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <div className="flex gap-0.5">
                    <RatingStars rating={review.rating} size={16} showText={false} />
                  </div>
                  {review.verified && (
                    <Badge variant="secondary" className="bg-green-50 text-green-700 text-xs gap-1 border-green-100">
                      <CheckCircle className="w-3 h-3" />
                      Verified Purchase
                    </Badge>
                  )}
                </div>

                <h3 className="font-semibold text-zamzam-text-dark mb-1">
                  {review.title}
                </h3>
                <p className="text-zamzam-text-muted text-sm leading-relaxed mb-4">
                  {review.content}
                </p>

                {/* Helpful count - Placeholder for now as we haven't implemented liking yet */}
                {review.helpful > 0 && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <ThumbsUp className="w-3 h-3" />
                    <span>{review.helpful} people found this helpful</span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <MessageSquare className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <h3 className="font-medium text-zamzam-text-dark mb-2">
                No reviews yet
              </h3>
              <p className="text-zamzam-text-muted mb-6">
                Be the first to share your thoughts on this product!
              </p>
              <Button 
                variant="outline"
                onClick={handleWriteReview}
              >
                Write a Review
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;
