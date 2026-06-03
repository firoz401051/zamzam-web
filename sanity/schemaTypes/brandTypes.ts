import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const brandType = defineType({
  name: "brand",
  title: "Brand",
  type: "document",
  icon: TagIcon,
  fields: [
    // Basic Information
    defineField({
      name: "title",
      title: "Brand Name",
      type: "string",
      description: "The official brand name",
      validation: (Rule) => Rule.required().min(2).max(100),
    }),
    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      description: "URL-friendly version of the brand name",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "brandCode",
      title: "Brand Code",
      type: "string",
      description: "Unique brand identifier code (e.g., NIKE, APPLE, etc.)",
      validation: (Rule) => Rule.required().min(2).max(20).uppercase(),
    }),
    defineField({
      name: "status",
      title: "Brand Status",
      type: "string",
      description: "Current status of the brand partnership",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Inactive", value: "inactive" },
          { title: "Pending", value: "pending" },
          { title: "Discontinued", value: "discontinued" },
        ],
      },
      initialValue: "active",
    }),

    // Brand Description & Story
    defineField({
      name: "shortDescription",
      title: "Short Description",
      type: "text",
      description: "Brief description of the brand (150 characters max)",
      validation: (Rule) => Rule.max(150),
      rows: 3,
    }),
    defineField({
      name: "fullDescription",
      title: "Full Description",
      type: "array",
      description: "Detailed brand story and information",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "tagline",
      title: "Brand Tagline",
      type: "string",
      description: "Brand's official tagline or slogan",
      validation: (Rule) => Rule.max(100),
    }),

    // Brand Visuals
    defineField({
      name: "logo",
      title: "Brand Logo",
      type: "image",
      description: "Primary brand logo",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "logoVariants",
      title: "Logo Variants",
      type: "array",
      description: "Alternative logo versions (dark, light, horizontal, etc.)",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "variant",
              title: "Variant Type",
              type: "string",
              options: {
                list: [
                  { title: "Primary", value: "primary" },
                  { title: "Secondary", value: "secondary" },
                  { title: "Dark Background", value: "dark" },
                  { title: "Light Background", value: "light" },
                  { title: "Horizontal", value: "horizontal" },
                  { title: "Vertical", value: "vertical" },
                  { title: "Icon Only", value: "icon" },
                ],
              },
            }),
            defineField({
              name: "image",
              title: "Logo Image",
              type: "image",
              options: { hotspot: true },
            }),
          ],
          preview: {
            select: { title: "variant", media: "image" },
          },
        },
      ],
    }),
    defineField({
      name: "brandColors",
      title: "Brand Colors",
      type: "array",
      description: "Official brand color palette",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Color Name",
              type: "string",
              description: "E.g., Primary Blue, Secondary Red",
            }),
            defineField({
              name: "hex",
              title: "HEX Code",
              type: "string",
              description: "E.g., #FF0000",
              validation: (Rule) =>
                Rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
            }),
            defineField({
              name: "rgb",
              title: "RGB Values",
              type: "string",
              description: "E.g., rgb(255, 0, 0)",
            }),
            defineField({
              name: "usage",
              title: "Usage",
              type: "string",
              description: "When to use this color",
            }),
          ],
          preview: {
            select: { title: "name", subtitle: "hex" },
          },
        },
      ],
    }),

    // Brand Information
    defineField({
      name: "foundedYear",
      title: "Founded Year",
      type: "number",
      description: "Year the brand was founded",
      validation: (Rule) => Rule.min(1800).max(new Date().getFullYear()),
    }),
    defineField({
      name: "founder",
      title: "Founder(s)",
      type: "string",
      description: "Name(s) of the brand founder(s)",
    }),
    defineField({
      name: "headquarters",
      title: "Headquarters",
      type: "object",
      description: "Brand headquarters location",
      fields: [
        defineField({
          name: "city",
          title: "City",
          type: "string",
        }),
        defineField({
          name: "state",
          title: "State/Province",
          type: "string",
        }),
        defineField({
          name: "country",
          title: "Country",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "categories",
      title: "Brand Categories",
      type: "array",
      description: "Product categories this brand specializes in",
      of: [{ type: "reference", to: { type: "category" } }],
    }),
    defineField({
      name: "targetAudience",
      title: "Target Audience",
      type: "array",
      description: "Primary target demographics",
      of: [
        {
          type: "string",
        },
      ],
      options: {
        list: [
          { title: "All Audiences", value: "all" },
          { title: "Men", value: "men" },
          { title: "Women", value: "women" },
          { title: "Kids", value: "kids" },
          { title: "Teens", value: "teens" },
          { title: "Adults", value: "adults" },
          { title: "Seniors", value: "seniors" },
          { title: "Professionals", value: "professionals" },
          { title: "Athletes", value: "athletes" },
          { title: "Luxury Consumers", value: "luxury" },
          { title: "Budget Conscious", value: "budget" },
        ],
      },
    }),

    // Contact & Business Information
    defineField({
      name: "contactInfo",
      title: "Contact Information",
      type: "object",
      description: "Brand contact details",
      fields: [
        defineField({
          name: "website",
          title: "Official Website",
          type: "url",
          description: "Brand's official website URL",
        }),
        defineField({
          name: "email",
          title: "Contact Email",
          type: "string",
          validation: (Rule) => Rule.email(),
        }),
        defineField({
          name: "phone",
          title: "Phone Number",
          type: "string",
        }),
        defineField({
          name: "address",
          title: "Business Address",
          type: "text",
          rows: 3,
        }),
      ],
    }),
    defineField({
      name: "socialMedia",
      title: "Social Media Links",
      type: "object",
      description: "Brand's social media presence",
      fields: [
        defineField({
          name: "instagram",
          title: "Instagram",
          type: "url",
        }),
        defineField({
          name: "facebook",
          title: "Facebook",
          type: "url",
        }),
        defineField({
          name: "twitter",
          title: "Twitter/X",
          type: "url",
        }),
        defineField({
          name: "linkedin",
          title: "LinkedIn",
          type: "url",
        }),
        defineField({
          name: "youtube",
          title: "YouTube",
          type: "url",
        }),
        defineField({
          name: "tiktok",
          title: "TikTok",
          type: "url",
        }),
      ],
    }),

    // Business Metrics
    defineField({
      name: "tier",
      title: "Brand Tier",
      type: "string",
      description: "Brand positioning in the market",
      options: {
        list: [
          { title: "Luxury/Premium", value: "luxury" },
          { title: "Mid-Range", value: "mid-range" },
          { title: "Budget/Value", value: "budget" },
          { title: "Mass Market", value: "mass-market" },
        ],
      },
    }),
    defineField({
      name: "popularity",
      title: "Popularity Score",
      type: "number",
      description: "Brand popularity rating (1-10)",
      validation: (Rule) => Rule.min(1).max(10),
    }),
    defineField({
      name: "marketShare",
      title: "Market Share",
      type: "number",
      description: "Estimated market share percentage",
      validation: (Rule) => Rule.min(0).max(100),
    }),

    // SEO & Marketing
    defineField({
      name: "seo",
      title: "SEO Information",
      type: "object",
      description: "SEO optimization for brand pages",
      fields: [
        defineField({
          name: "metaTitle",
          title: "Meta Title",
          type: "string",
          validation: (Rule) => Rule.max(60),
        }),
        defineField({
          name: "metaDescription",
          title: "Meta Description",
          type: "text",
          validation: (Rule) => Rule.max(160),
          rows: 3,
        }),
        defineField({
          name: "keywords",
          title: "SEO Keywords",
          type: "array",
          of: [{ type: "string" }],
          description: "Relevant SEO keywords for this brand",
        }),
      ],
    }),
    defineField({
      name: "featuredBrand",
      title: "Featured Brand",
      type: "boolean",
      description: "Mark as featured brand for homepage display",
      initialValue: false,
    }),
    defineField({
      name: "displayOrder",
      title: "Display Order",
      type: "number",
      description: "Order for displaying brands (lower numbers appear first)",
      validation: (Rule) => Rule.min(0),
    }),

    // Partnerships & Certifications
    defineField({
      name: "partnerships",
      title: "Partnerships",
      type: "array",
      description: "Notable partnerships or collaborations",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "partner",
              title: "Partner Name",
              type: "string",
            }),
            defineField({
              name: "type",
              title: "Partnership Type",
              type: "string",
              options: {
                list: [
                  { title: "Collaboration", value: "collaboration" },
                  { title: "Sponsorship", value: "sponsorship" },
                  { title: "Joint Venture", value: "joint-venture" },
                  { title: "Licensing", value: "licensing" },
                ],
              },
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 2,
            }),
          ],
          preview: {
            select: { title: "partner", subtitle: "type" },
          },
        },
      ],
    }),
    defineField({
      name: "certifications",
      title: "Certifications & Awards",
      type: "array",
      description: "Brand certifications, awards, and recognitions",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Certification/Award Name",
              type: "string",
            }),
            defineField({
              name: "issuedBy",
              title: "Issued By",
              type: "string",
            }),
            defineField({
              name: "year",
              title: "Year Received",
              type: "number",
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 2,
            }),
          ],
          preview: {
            select: { title: "name", subtitle: "year" },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "shortDescription",
      media: "logo",
      status: "status",
    },
    prepare(selection) {
      const { title, subtitle, media, status } = selection;
      return {
        title: title,
        subtitle: subtitle || `Status: ${status}`,
        media: media,
      };
    },
  },
});
