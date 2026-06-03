"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  MoreHorizontal, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Filter
} from "lucide-react";
import { updateReviewStatusAction } from "@/actions/review-actions";
import toast from "react-hot-toast";
import Image from "next/image";
import { urlFor } from "@/sanity/image";

interface Review {
  _id: string;
  _createdAt: string;
  product: {
    _id: string;
    name: string;
    image: any;
  };
  userName: string;
  userEmail: string;
  rating: number;
  title: string;
  content: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
}

interface ReviewAdminTableProps {
  initialReviews: Review[];
}

const ReviewAdminTable: React.FC<ReviewAdminTableProps> = ({ initialReviews }) => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const filteredReviews = reviews.filter((review) => {
    if (filter === "all") return true;
    return review.status === filter;
  });

  const handleStatusUpdate = async (reviewId: string, status: string) => {
    setProcessingId(reviewId);
    let rejectionReason = undefined;
    
    if (status === "rejected") {
      rejectionReason = prompt("Enter reason for rejection (optional):") || undefined;
    }

    try {
      const result = await updateReviewStatusAction(reviewId, status, rejectionReason);
      
      if (result.success) {
        toast.success(`Review ${status} successfully`);
        // Update local state
        setReviews((prev) =>
          prev.map((r) =>
            r._id === reviewId ? { ...r, status: status as any, rejectionReason } : r
          )
        );
      } else {
        toast.error(result.error as string);
      }
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div>
      <div className="p-4 border-b flex gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          All
        </Button>
        <Button
          variant={filter === "pending" ? "default" : "outline"}
          size="sm"
          className={filter === "pending" ? "bg-yellow-500 hover:bg-yellow-600" : ""}
          onClick={() => setFilter("pending")}
        >
          <Clock className="w-4 h-4 mr-2" />
          Pending
        </Button>
        <Button
          variant={filter === "approved" ? "default" : "outline"}
          size="sm"
          className={filter === "approved" ? "bg-green-600 hover:bg-green-700" : ""}
          onClick={() => setFilter("approved")}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Approved
        </Button>
        <Button
          variant={filter === "rejected" ? "default" : "outline"}
          size="sm"
          className={filter === "rejected" ? "bg-red-600 hover:bg-red-700" : ""}
          onClick={() => setFilter("rejected")}
        >
          <XCircle className="w-4 h-4 mr-2" />
          Rejected
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Reviewer</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead className="w-[300px]">Review</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredReviews.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                No reviews found
              </TableCell>
            </TableRow>
          ) : (
            filteredReviews.map((review) => (
              <TableRow key={review._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {review.product?.image && (
                      <div className="w-10 h-10 relative rounded overflow-hidden bg-gray-100 shrink-0">
                        <Image
                          src={urlFor(review.product.image).width(40).height(40).url()}
                          alt={review.product.name || ""}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <span className="font-medium text-sm line-clamp-2 max-w-[150px]">
                      {review.product?.name || "Unknown Product"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{review.userName}</span>
                    <span className="text-xs text-gray-500">{review.userEmail}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <span className="font-bold">{review.rating}</span>
                    <span className="text-gray-400 text-xs">/5</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-sm">{review.title}</span>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {review.content}
                    </p>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(review.status)}</TableCell>
                <TableCell className="text-xs text-gray-500">
                  {new Date(review._createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" disabled={processingId === review._id}>
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleStatusUpdate(review._id, "approved")}>
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                        Approve
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusUpdate(review._id, "rejected")}>
                        <XCircle className="w-4 h-4 mr-2 text-red-600" />
                        Reject
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusUpdate(review._id, "pending")}>
                        <Clock className="w-4 h-4 mr-2 text-yellow-600" />
                        Mark Pending
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReviewAdminTable;
