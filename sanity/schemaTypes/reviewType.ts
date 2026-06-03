import { MessageSquareIcon } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";

export const reviewType = defineType({
  name: "review",
  title: "Product Review",
  type: "document",
  icon: MessageSquareIcon,
  fields: [
    defineField({
      name: "product",
      title: "Product",
      type: "reference",
      to: [{ type: "product" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "clerkUserId",
      title: "User ID",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "Clerk user ID of the reviewer",
    }),
    defineField({
      name: "userName",
      title: "User Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "userEmail",
      title: "User Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "rating",
      title: "Rating",
      type: "number",
      validation: (Rule) => Rule.required().min(1).max(5),
    }),
    defineField({
      name: "title",
      title: "Review Title",
      type: "string",
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: "content",
      title: "Review Content",
      type: "text",
      validation: (Rule) => Rule.required().min(20).max(1000),
    }),
    defineField({
      name: "status",
      title: "Review Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Approved", value: "approved" },
          { title: "Rejected", value: "rejected" },
        ],
      },
      initialValue: "pending",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "rejectionReason",
      title: "Rejection Reason",
      type: "text",
      description: "Optional reason for rejection (only if status is rejected)",
      hidden: ({ document }) => document?.status !== "rejected",
    }),
    defineField({
      name: "likes",
      title: "Likes Count",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "helpful",
      title: "Helpful Count",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "verified",
      title: "Verified Purchase",
      type: "boolean",
      initialValue: false,
      description: "Was this review from a verified purchase?",
    }),
    defineField({
      name: "orderNumber",
      title: "Order Number",
      type: "string",
      description: "Order number if this is from a verified purchase",
    }),
  ],
  preview: {
    select: {
      title: "title",
      userName: "userName",
      rating: "rating",
      status: "status",
      productName: "product.name",
    },
    prepare(select) {
      return {
        title: select.title,
        subtitle: `${select.userName} - ${select.rating}⭐ - ${select.status} - ${select.productName}`,
      };
    },
  },
});
