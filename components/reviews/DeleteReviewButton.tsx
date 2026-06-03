"use client";

import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteReviewAction } from "@/actions/review-actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DeleteReviewButtonProps {
  reviewId: string;
}

export default function DeleteReviewButton({
  reviewId,
}: DeleteReviewButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this review? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteReviewAction(reviewId);

      if (result.success) {
        toast.success(result.message || "Review deleted successfully");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete review");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the review");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 hover:text-red-700 hover:bg-red-50"
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  );
}
