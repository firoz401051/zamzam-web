import type { StructureResolver } from "sanity/structure";
import {
  TagIcon,
  BasketIcon,
  UsersIcon,
  DocumentTextIcon,
  HomeIcon,
  CreditCardIcon,
  BlockContentIcon,
  ImagesIcon,
  StarIcon,
  TrolleyIcon,
  CopyIcon,
} from "@sanity/icons";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("zamzam Admin")
    .items([
      // Shop Management
      S.listItem()
        .title("Shop Management")
        .icon(TrolleyIcon)
        .child(
          S.list()
            .title("Shop Management")
            .items([
              S.listItem()
                .title("Products")
                .icon(TagIcon)
                .schemaType("product")
                .child(S.documentTypeList("product").title("All Products")),
              S.listItem()
                .title("Collections")
                .icon(CopyIcon)
                .schemaType("collection")
                .child(S.documentTypeList("collection").title("Collections")),
              S.listItem()
                .title("Categories")
                .icon(BlockContentIcon)
                .schemaType("category")
                .child(S.documentTypeList("category").title("Categories")),
              S.listItem()
                .title("Brands")
                .icon(StarIcon)
                .schemaType("brand")
                .child(S.documentTypeList("brand").title("Brands")),
              S.listItem()
                .title("Banners")
                .icon(ImagesIcon)
                .schemaType("banner")
                .child(S.documentTypeList("banner").title("Banners")),
            ])
        ),

      S.divider(),

      // Order Management
      S.listItem()
        .title("Order Management")
        .icon(BasketIcon)
        .child(
          S.list()
            .title("Order Management")
            .items([
              S.listItem()
                .title("Orders")
                .icon(BasketIcon)
                .schemaType("order")
                .child(S.documentTypeList("order").title("All Orders")),
              S.listItem()
                .title("Payment Methods")
                .icon(CreditCardIcon)
                .schemaType("paymentMethod")
                .child(
                  S.documentTypeList("paymentMethod").title("Payment Methods")
                ),
            ])
        ),

      S.divider(),

      // User Management
      S.listItem()
        .title("User Management")
        .icon(UsersIcon)
        .child(
          S.list()
            .title("User Management")
            .items([
              S.listItem()
                .title("Authors")
                .icon(UsersIcon)
                .schemaType("author")
                .child(S.documentTypeList("author").title("Authors")),
              S.listItem()
                .title("Reviews")
                .icon(StarIcon)
                .schemaType("review")
                .child(S.documentTypeList("review").title("Reviews")),
              S.listItem()
                .title("User Addresses")
                .icon(HomeIcon)
                .schemaType("address")
                .child(S.documentTypeList("address").title("User Addresses")),
            ])
        ),

      S.divider(),

      // Content Management
      S.listItem()
        .title("Content Management")
        .icon(DocumentTextIcon)
        .child(
          S.list()
            .title("Content Management")
            .items([
              S.listItem()
                .title("Blog Posts")
                .icon(DocumentTextIcon)
                .schemaType("blog")
                .child(S.documentTypeList("blog").title("Blog Posts")),
              S.listItem()
                .title("Blog Categories")
                .icon(BlockContentIcon)
                .schemaType("blogcategory")
                .child(
                  S.documentTypeList("blogcategory").title("Blog Categories")
                ),
            ])
        ),

      S.divider(),

      // Catch-all for other items
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() &&
          ![
            "product",
            "category",
            "banner",
            "brand",
            "order",
            "paymentMethod",
            "author",
            "review",
            "address",
            "blog",
            "blogcategory",
            "loyaltyTransaction", // Excluding derived or hidden types if needed
            "media.tag", // If media plugin is installed
          ].includes(item.getId()!)
      ),
    ]);
