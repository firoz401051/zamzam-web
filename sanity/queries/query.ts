import { defineQuery } from "next-sanity";

/* ----------------------------
   ✅ Banner Query
---------------------------- */
const BANNER_QUERY = defineQuery(
  `*[_type == 'banner'] | order(publishedAt desc)`
);

/* ----------------------------
   ✅ Featured Category Query
---------------------------- */
const FEATURED_CATEGORY_QUERY = defineQuery(
  `*[_type == 'category' && featured == true] | order(sortOrder asc, title asc) {
    _id,
    title,
    slug,
    description,
    shortDescription,
    range,
    featured,
    image,
    color,
    icon,
    sortOrder,
    "productCount": count(*[_type == "product" && references(^._id)])
  }`
);

/* ----------------------------
   ✅ All Products Query
---------------------------- */
const ALL_PRODUCTS_QUERY = defineQuery(
  `*[_type=="product" && status in ["new", "hot", "sale", "active"]] 
  | order(name asc){
    ...,
    productSegments,
    "categories": categories[]->title,
    "brand": brand->name
  }`
);

/* ----------------------------
   ✅ New Arrival Products
---------------------------- */
const NEW_ARRIVAL_PRODUCTS = defineQuery(
  `*[_type == 'product' && status == "active" && "new-arrival" in productSegments] 
  | order(_createdAt desc){
    ...,
    "categories": categories[]->title,
    "brand": brand->name
  }`
);

/* ----------------------------
   ✅ Best Seller Products
---------------------------- */
const BEST_SELLER_PRODUCTS = defineQuery(
  `*[_type == 'product' && status == "active" && "best-seller" in productSegments] 
  | order(salesCount desc){
    ...,
    "categories": categories[]->title,
    "brand": brand->name
  }`
);

/* ----------------------------
   ✅ Featured Products
---------------------------- */
const FEATURED_PRODUCTS = defineQuery(
  `*[_type == 'product' && status == "active" && "featured" in productSegments] 
  | order(name asc){
    ...,
    "categories": categories[]->title,
    "brand": brand->name
  }`
);

/* ----------------------------
   ✅ Special Offer Products
---------------------------- */
const SPECIAL_OFFER_PRODUCTS = defineQuery(
  `*[_type == 'product' && status == "active" && "special-offer" in productSegments] 
  | order(discount desc){
    ...,
    "categories": categories[]->title,
    "brand": brand->name
  }`
);

/* ----------------------------
   ✅ Products by Segment (Generic)
---------------------------- */
const PRODUCTS_BY_SEGMENT = defineQuery(
  `*[_type == 'product' && status == "active" && $segment in productSegments] 
  | order(_createdAt desc)[0...$quantity]{
    ...,
    "categories": categories[]->title,
    "brand": brand->name
  }`
);

/* ----------------------------
   ✅ All Products With Segments
---------------------------- */
const ALL_PRODUCTS_WITH_SEGMENTS = defineQuery(
  `*[_type == 'product' && status == "active"] 
  | order(_createdAt desc){
    ...,
    "categories": categories[]->title,
    "brand": brand->name
  }`
);

/* ----------------------------
   ✅ Brand Query
---------------------------- */
const BRANDS_QUERY = defineQuery(
  `*[_type=='brand'] | order(title asc) {
    _id,
    title,
    slug,
    brandCode,
    status,
    shortDescription,
    tagline,
    logo,
    featured
  }`
);

/* ----------------------------
   ✅ Blog Queries
---------------------------- */
const LATEST_BLOG_QUERY = defineQuery(
  `*[_type == 'blog' && isLatest == true]
  | order(publishedAt desc)[0...$quantity]{
    ...,
    blogcategories[]->{
      title
    }
  }`
);

const GET_ALL_BLOG = defineQuery(
  `*[_type == 'blog'] 
  | order(publishedAt desc)[0...$quantity]{
    ...,
    blogcategories[]->{
      title
    }
  }`
);

const SINGLE_BLOG_QUERY = defineQuery(
  `*[_type == "blog" && slug.current == $slug][0]{
    ...,
    author->{
      name,
      image,
    },
    blogcategories[]->{
      title,
      "slug": slug.current,
    },
  }`
);

const BLOG_CATEGORIES = defineQuery(
  `*[_type == "blog"]{
    blogcategories[]->{
      ...
    }
  }`
);

const OTHERS_BLOG_QUERY = defineQuery(
  `*[
    _type == "blog"
    && defined(slug.current)
    && slug.current != $slug
  ]
  | order(publishedAt desc)[0...$quantity]{
    ...,
    publishedAt,
    title,
    mainImage,
    slug,
    author->{
      name,
      image,
    }
  }`
);

/* ----------------------------
   ✅ Address Query
---------------------------- */
const ADDRESS_QUERY = defineQuery(
  `*[_type=="address"] | order(publishedAt desc)`
);

/* ----------------------------
   ✅ Category Query
---------------------------- */
const CATEGORIES_QUERY = defineQuery(
  `*[_type == 'category'] | order(name asc) [0...$quantity]`
);

/* ----------------------------
   ✅ Product By Slug Query
---------------------------- */
const PRODUCT_BY_SLUG_QUERY = defineQuery(
  `*[_type == "product" && slug.current == $slug][0]{
    ...,
    "relatedProducts": *[
      _type == "product" &&
      references(^.categories[]._ref) &&
      _id != ^._id
    ][0...4]{
      _id,
      name,
      slug,
      images,
      price,
      salePrice
    }
  }`
);

/* ----------------------------
   ✅ Brand Page Query
---------------------------- */
const BRAND_QUERY = defineQuery(
  `*[_type == "brand" && slug.current == $slug][0]{
    ...
  }`
);

/* ----------------------------
   ✅ All Categories Query
---------------------------- */
const ALL_CATEGORIES_QUERY = defineQuery(
  `*[_type == 'category'] | order(sortOrder asc, title asc){
    ...,
    "productCount": count(*[_type == "product" && references(^._id)])
  }`
);

/* ----------------------------
   ✅ TOTAL PRODUCTS COUNT
---------------------------- */
const TOTAL_PRODUCTS_COUNT_QUERY = defineQuery(
  `count(*[_type == "product" && status == "active"])`
);

/* ----------------------------
   ✅ ✅✅ ORDER QUERY (FOREVER FIX)
---------------------------- */
const ORDER_BY_NUMBER_QUERY = defineQuery(`
*[
  _type == "order" &&
  orderNumber == $orderNumber &&
  clerkUserId == $userId
][0]{
  _id,
  orderNumber,
  totalPrice,
  status,
  paymentStatus,
  paymentMethod,
  orderDate,

  products[]{
    _key,
    quantity,
    product->{
      _id,
      name,
      price,
      images
    }
  },

  address
}
`);

const COLLECTION_QUERY = defineQuery(
  `*[_type == "collection"] | order(title asc) {
    ...,
    products[0...5]->{
      ...,
      "categories": categories[]->title,
      "brand": brand->name
    }
  }`
);

const SINGLE_COLLECTION_QUERY = defineQuery(
  `*[_type == "collection" && slug.current == $slug][0]{
    ...,
    products[]->{
      ...,
      "categories": categories[]->title,
      "brand": brand->name
    }
  }`
);

const DEAL_PRODUCTS = defineQuery(
  `*[_type == "product" && status == "active" && "special-offer" in productSegments]
  | order(discount desc){
    ...,
    "categories": categories[]->title,
    "brand": brand->name
  }`
)

const PRODUCTS_BY_BRAND_QUERY = defineQuery(`
*[_type == "product" && status == "active" && brand->slug.current == $brandSlug]
| order(name asc){
  ...,
  "brand": brand->title,
  "brandSlug": brand->slug.current,
  "categories": categories[]->title
}
`)


/* ----------------------------
   ✅ EXPORTS
---------------------------- */
export {
  // ✅ Banner + Categories
  BANNER_QUERY,
  FEATURED_CATEGORY_QUERY,
  CATEGORIES_QUERY,
  ALL_CATEGORIES_QUERY,

  // ✅ Products
  ALL_PRODUCTS_QUERY,
  NEW_ARRIVAL_PRODUCTS,
  FEATURED_PRODUCTS,
  DEAL_PRODUCTS,
  PRODUCT_BY_SLUG_QUERY,

  // ✅ Brands
  BRANDS_QUERY,
  BRAND_QUERY,

  // ✅ Blog
  LATEST_BLOG_QUERY,
  GET_ALL_BLOG,
  SINGLE_BLOG_QUERY,
  BLOG_CATEGORIES,
  OTHERS_BLOG_QUERY,

  // ✅ Address
  ADDRESS_QUERY,

  // ✅ Counts + Filters
  TOTAL_PRODUCTS_COUNT_QUERY,
  PRODUCTS_BY_BRAND_QUERY,
  PRODUCTS_BY_SEGMENT,

  // ✅ Collections
  COLLECTION_QUERY,
  SINGLE_COLLECTION_QUERY,

  // ✅ Orders (Our New Fix)
  ORDER_BY_NUMBER_QUERY,
}
