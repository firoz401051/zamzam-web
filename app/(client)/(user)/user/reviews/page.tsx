import React from "react";
import {
  Star,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  getUserReviews,
  getUserReviewStats,
} from "@/sanity/helpers/reviewHelpers";
import { urlFor } from "@/sanity/image";
import DeleteReviewButton from "@/components/reviews/DeleteReviewButton";
import Link from "next/link";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "approved":
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Approved
        </Badge>
      );
    case "pending":
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" />
          Pending Review
        </Badge>
      );
    case "rejected":
      return (
        <Badge variant="secondary" className="bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" />
          Rejected
        </Badge>
      );
    default:
      return null;
  }
};

const renderStars = (rating: number) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

export default async function ReviewsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Fetch real data from Sanity
  const userReviews = await getUserReviews(userId);
  const stats = await getUserReviewStats(userId);

  const approvedReviews = userReviews.filter(
    (review: any) => review.status === "approved"
  );
  const pendingReviews = userReviews.filter(
    (review: any) => review.status === "pending"
  );
  const rejectedReviews = userReviews.filter(
    (review: any) => review.status === "rejected"
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-zamzam-text-dark">
          My Reviews
        </h2>
        <p className="text-zamzam-text-muted mt-1">
          Manage your product reviews and see their approval status
        </p>
      </div>

      {/* Review Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-white">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-zamzam-text-dark">
              {stats.total}
            </h3>
            <p className="text-sm text-zamzam-text-muted">Total Reviews</p>
          </div>
        </Card>

        <Card className="p-4 bg-white">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-green-600">
              {stats.approved}
            </h3>
            <p className="text-sm text-zamzam-text-muted">Approved</p>
          </div>
        </Card>

        <Card className="p-4 bg-white">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </h3>
            <p className="text-sm text-zamzam-text-muted">Pending</p>
          </div>
        </Card>

        <Card className="p-4 bg-white">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-red-600">
              {stats.rejected}
            </h3>
            <p className="text-sm text-zamzam-text-muted">Rejected</p>
          </div>
        </Card>
      </div>

      {/* Reviews List */}
      <Card className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Your Reviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          {userReviews.length > 0 ? (
            <div className="space-y-6">
              {userReviews.map((review: any) => (
                <div
                  key={review.id}
                  className="border border-gray-200 rounded-lg p-6 hover:border-zamzam-primary/50 transition-colors"
                >
                  {/* Review Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex gap-4">
                      {review.product?.image && (
                        <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                          <Image
                            src={urlFor(review.product.image)
                              .width(64)
                              .height(64)
                              .url()}
                            alt={review.product?.name || "Product"}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium text-zamzam-text-dark mb-1">
                          {review.product?.name || "Product"}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          {renderStars(review.rating)}
                          <span className="text-sm text-zamzam-text-muted">
                            {review.rating}/5
                          </span>
                        </div>
                        {getStatusBadge(review.status)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {review.status === "approved" && (
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}
                      {review.status === "pending" && (
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                      {review.status !== "approved" && (
                        <DeleteReviewButton reviewId={review._id} />
                      )}
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="mb-4">
                    <h4 className="font-medium text-zamzam-text-dark mb-2">
                      &ldquo;{review.title}&rdquo;
                    </h4>
                    <p className="text-zamzam-text-muted leading-relaxed">
                      {review.content}
                    </p>
                  </div>

                  {/* Review Stats & Meta */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4 text-zamzam-text-muted">
                      <span>
                        Posted{" "}
                        {review._createdAt &&
                          new Date(review._createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                      </span>
                      {review.status === "approved" && review.likes > 0 && (
                        <>
                          <span>•</span>
                          <span>{review.likes} likes</span>
                        </>
                      )}
                      {review.status === "approved" && review.helpful > 0 && (
                        <>
                          <span>•</span>
                          <span>{review.helpful} found helpful</span>
                        </>
                      )}
                      {review.verified && (
                        <>
                          <span>•</span>
                          <Badge
                            variant="secondary"
                            className="bg-blue-50 text-blue-700 text-xs"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified Purchase
                          </Badge>
                        </>
                      )}
                    </div>

                    {review.status === "rejected" && review.rejectionReason && (
                      <div className="text-red-600 text-sm">
                        Reason: {review.rejectionReason}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <h3 className="font-medium text-zamzam-text-dark mb-2">
                No reviews yet
              </h3>
              <p className="text-zamzam-text-muted mb-6">
                Start reviewing products you&apos;ve purchased to help other
                customers
              </p>
             <Link href="/products">
              <Button className="bg-zamzam-primary hover:bg-zamzam-primary/90">
                Browse Products to Review
              </Button>
             </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Guidelines */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Review Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-zamzam-text-dark mb-3">
                What makes a good review:
              </h4>
              <ul className="space-y-2 text-sm text-zamzam-text-muted">
                <li>• Be honest and detailed about your experience</li>
                <li>• Include both pros and cons</li>
                <li>• Mention specific features and quality</li>
                <li>• Add context about your usage</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-zamzam-text-dark mb-3">
                Review process:
              </h4>
              <ul className="space-y-2 text-sm text-zamzam-text-muted">
                <li>• Reviews are moderated within 24-48 hours</li>
                <li>• Approved reviews appear on product pages</li>
                <li>• Pending reviews can be edited or deleted</li>
                <li>• Approved reviews cannot be deleted</li>
                <li>• Rejected reviews can be edited and resubmitted</li>
                <li>• Spam or inappropriate content will be removed</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
