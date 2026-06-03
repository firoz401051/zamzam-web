import { defineField, defineType } from "sanity";
import { CopyIcon } from "@sanity/icons";

export const collectionType = defineType({
  name: "collection",
  title: "Collection",
  type: "document",
  icon: CopyIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "image",
      title: "Collection Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "products",
      title: "Products",
      type: "array",
      of: [{ type: "reference", to: { type: "product" } }],
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
    },
  },
});
