import { TrolleyIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { AsinInput } from "../components/AsinInput";

export const productType = defineType({
  name: "product",
  title: "Products",
  type: "document",
  icon: TrolleyIcon,
  groups: [
    { name: "basic", title: "Basic Info" },
    { name: "media", title: "Media" },
    { name: "pricing", title: "Pricing & Inventory" },
    { name: "organization", title: "Categories & Tags" },
    { name: "segments", title: "Product Segments" },
    { name: "zamzam", title: "zamzam Features" },
    { name: "reviews", title: "Reviews & Ratings" },
    { name: "variants", title: "Product Variants" },
    { name: "seo", title: "SEO & Marketing" },
    { name: "analytics", title: "Analytics" },
  ],
  fields: [
    // Basic Product Information
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      group: "basic",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Product Slug/SKU",
      type: "slug",
      group: "basic",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
      description:
        "Unique product identifier - serves as both URL slug and SKU",
    }),
    defineField({
      name: "asin",
      title: "ASIN (zamzam Standard Identification Number)",
      type: "string",
      group: "zamzam",
      description:
        "zamzam's unique product identifier - auto-generated from product name",
      components: {
        input: AsinInput,
      },
    }),

    // Media
    defineField({
      name: "images",
      title: "Product Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (Rule) => Rule.min(1).max(10),
    }),
    defineField({
      name: "videoUrl",
      title: "Product Video URL",
      type: "url",
      description: "YouTube, Vimeo, or direct video URL",
    }),

    // Descriptions
    defineField({
      name: "shortDescription",
      title: "Short Description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: "description",
      title: "Full Description",
      type: "blockContent",
    }),
    defineField({
      name: "specifications",
      title: "Product Specifications",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "attribute", type: "string", title: "Attribute" },
            { name: "value", type: "string", title: "Value" },
          ],
        },
      ],
    }),
    defineField({
      name: "keyFeatures",
      title: "Key Features",
      type: "array",
      of: [{ type: "string" }],
      description: "Bullet points of key product features",
    }),
    defineField({
      name: "aboutThisItem",
      title: "About this item",
      type: "array",
      group: "basic",
      description:
        "Detailed bullet points about the product (like Amazon's 'About this item' section)",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.max(10).min(3),
      options: {
        layout: "list",
      },
    }),

    // Pricing & Inventory
    defineField({
      name: "price",
      title: "Regular Price",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "salePrice",
      title: "Sale Price",
      type: "number",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "costPrice",
      title: "Cost Price",
      type: "number",
      validation: (Rule) => Rule.min(0),
      description: "Internal cost for profit calculations",
    }),
    defineField({
      name: "discount",
      title: "Discount Percentage",
      type: "number",
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({
      name: "stock",
      title: "Stock Quantity",
      type: "number",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "lowStockThreshold",
      title: "Low Stock Alert Threshold",
      type: "number",
      initialValue: 10,
    }),
    defineField({
      name: "trackInventory",
      title: "Track Inventory",
      type: "boolean",
      initialValue: true,
    }),

    // Product Organization
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: { type: "category" } }],
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: "brand",
      title: "Brand",
      type: "reference",
      to: { type: "brand" },
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),

    // Product Segments & Status
    defineField({
      name: "productSegments",
      title: "Product Segments",
      type: "array",
      of: [
        {
          type: "string",
        },
      ],
      options: {
        list: [
          { title: "New Arrival", value: "new-arrival" },
          { title: "Best Seller", value: "best-seller" },
          { title: "Featured", value: "featured" },
          { title: "Special Offer", value: "special-offer" },
          { title: "Editor's Choice", value: "editors-choice" },
          { title: "Trending", value: "trending" },
          { title: "Limited Edition", value: "limited-edition" },
          { title: "Exclusive", value: "exclusive" },
        ],
      },
      description: "Select applicable product segments",
    }),
    defineField({
      name: "status",
      title: "Product Status",
      type: "string",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "Active", value: "active" },
          { title: "Inactive", value: "inactive" },
          { title: "Discontinued", value: "discontinued" },
          { title: "Out of Stock", value: "out-of-stock" },
        ],
      },
      initialValue: "active",
    }),
    defineField({
      name: "visibility",
      title: "Visibility",
      type: "string",
      options: {
        list: [
          { title: "Public", value: "public" },
          { title: "Hidden", value: "hidden" },
          { title: "Members Only", value: "members-only" },
        ],
      },
      initialValue: "public",
    }),

    // zamzam-style Fields
    defineField({
      name: "zamzamChoice",
      title: "zamzam's Choice",
      type: "boolean",
      group: "zamzam",
      initialValue: false,
      description:
        "Mark as zamzam's Choice product - featured recommendation",
    }),
    defineField({
      name: "zamzamPlusEligible",
      title: "zamzam Plus Eligible",
      type: "boolean",
      group: "zamzam",
      initialValue: false,
      description: "Eligible for zamzam Plus premium shipping benefits",
    }),
    defineField({
      name: "freeShipping",
      title: "Free Shipping",
      type: "boolean",
      group: "zamzam",
      initialValue: false,
      description: "Qualifies for free standard shipping",
    }),
    defineField({
      name: "deliveryTime",
      title: "Delivery Time",
      type: "string",
      options: {
        list: [
          { title: "Same Day", value: "same-day" },
          { title: "Next Day", value: "next-day" },
          { title: "2-3 Days", value: "2-3-days" },
          { title: "3-5 Days", value: "3-5-days" },
          { title: "5-7 Days", value: "5-7-days" },
          { title: "1-2 Weeks", value: "1-2-weeks" },
        ],
      },
    }),

    // Ratings & Reviews
    defineField({
      name: "averageRating",
      title: "Average Rating",
      type: "number",
      validation: (Rule) => Rule.min(0).max(5),
      description: "Average customer rating (0-5 stars)",
    }),
    defineField({
      name: "totalReviews",
      title: "Total Reviews Count",
      type: "number",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "ratingBreakdown",
      title: "Rating Breakdown",
      type: "object",
      fields: [
        { name: "five", type: "number", title: "5 Stars" },
        { name: "four", type: "number", title: "4 Stars" },
        { name: "three", type: "number", title: "3 Stars" },
        { name: "two", type: "number", title: "2 Stars" },
        { name: "one", type: "number", title: "1 Star" },
      ],
    }),

    // Product Variants
    defineField({
      name: "hasVariants",
      title: "Has Variants",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "variants",
      title: "Product Variants",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "name", type: "string", title: "Variant Name" },
            {
              name: "slug",
              type: "slug",
              title: "Variant Slug",
              options: {
                source: "name",
                maxLength: 96,
              },
              description:
                "Auto-generated from variant name - serves as unique identifier",
            },
            { name: "price", type: "number", title: "Variant Price" },
            { name: "stock", type: "number", title: "Variant Stock" },
            { name: "image", type: "image", title: "Variant Image" },
            {
              name: "attributes",
              type: "array",
              title: "Variant Attributes",
              of: [
                {
                  type: "object",
                  fields: [
                    { name: "name", type: "string", title: "Attribute" },
                    { name: "value", type: "string", title: "Value" },
                  ],
                },
              ],
            },
          ],
        },
      ],
      hidden: ({ parent }) => !parent?.hasVariants,
    }),

    // SEO & Marketing
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Meta Description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: "seoKeywords",
      title: "SEO Keywords",
      type: "array",
      of: [{ type: "string" }],
    }),

    // Timestamps & Analytics
    defineField({
      name: "launchDate",
      title: "Launch Date",
      type: "datetime",
      description: "When the product was first launched",
    }),
    defineField({
      name: "salesCount",
      title: "Total Sales Count",
      type: "number",
      validation: (Rule) => Rule.min(0),
      initialValue: 0,
    }),
    defineField({
      name: "viewCount",
      title: "View Count",
      type: "number",
      validation: (Rule) => Rule.min(0),
      initialValue: 0,
    }),

    // Legacy Fields (for backward compatibility)
    defineField({
      name: "variant",
      title: "Product Type (Legacy)",
      type: "string",
      options: {
        list: [
          { title: "Gadget", value: "gadget" },
          { title: "Appliances", value: "appliances" },
          { title: "Refrigerators", value: "refrigerators" },
          { title: "Others", value: "others" },
        ],
      },
      hidden: true, // Hide from UI but keep for backward compatibility
    }),
    defineField({
      name: "isFeatured",
      title: "Featured Product (Legacy)",
      type: "boolean",
      description: "Legacy field - use Product Segments instead",
      initialValue: false,
      hidden: true, // Hide from UI but keep for backward compatibility
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "images",
      subtitle: "price",
      salePrice: "salePrice",
      stock: "stock",
      segments: "productSegments",
      status: "status",
    },
    prepare(selection) {
      const { title, subtitle, salePrice, stock, segments, status, media } =
        selection;
      const image = media && media[0];
      const price = salePrice || subtitle;
      const stockStatus = stock > 0 ? `(${stock} in stock)` : "(Out of stock)";
      const segmentBadge =
        segments && segments.length > 0 ? ` • ${segments[0]}` : "";

      return {
              title,
              subtitle: `₹${Number(price).toLocaleString("en-IN")} ${stockStatus}${segmentBadge}`,
              media: image,
            };
    },
  },
  orderings: [
    {
      title: "Name A-Z",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
    {
      title: "Price Low-High",
      name: "priceAsc",
      by: [{ field: "price", direction: "asc" }],
    },
    {
      title: "Price High-Low",
      name: "priceDesc",
      by: [{ field: "price", direction: "desc" }],
    },
    {
      title: "Newest First",
      name: "newest",
      by: [{ field: "_createdAt", direction: "desc" }],
    },
    {
      title: "Best Sellers",
      name: "bestSellers",
      by: [{ field: "salesCount", direction: "desc" }],
    },
  ],
});
