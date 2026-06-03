"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { createReviewAction } from "@/actions/review-actions";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";

interface ReviewFormProps {
  productId: string;
  onSuccess?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId, onSuccess }) => {
  const { user } = useUser();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    if (!user) {
      toast.error("Please sign in to write a review");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    
    // Add additional data to formData
    formData.append("productId", productId);
    formData.append("rating", rating.toString());
    formData.append("userName", user.fullName || "Anonymous");
    formData.append("userEmail", user.emailAddresses[0].emailAddress);

    try {
      const result = await createReviewAction(formData);
      
      if (result.success) {
        toast.success(result.message as string);
        if (onSuccess) onSuccess();
        // Reset form (optional, might want to close modal instead)
        setRating(0);
      } else {
        toast.error(result.error as string);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Rating</Label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="focus:outline-none transition-colors"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
            >
              <Star
                className={`w-6 h-6 ${
                  star <= (hoverRating || rating)
                    ? "fill-orange-400 text-orange-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Review Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="Summary of your experience (e.g., Great product!)"
          required
          maxLength={100}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Review Content</Label>
        <Textarea
          id="content"
          name="content"
          placeholder="Tell us more about your experience..."
          required
          minLength={20}
          maxLength={1000}
          rows={5}
        />
        <p className="text-xs text-gray-500 text-right">
          Min 20 characters
        </p>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-zamzam-primary hover:bg-zamzam-primary-hover"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
};

export default ReviewForm;
