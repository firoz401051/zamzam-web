import { sanityFetch } from "../lib/live"
import {
  ALL_PRODUCTS_QUERY,
  CATEGORIES_QUERY,
  BANNER_QUERY,
  BRAND_QUERY,
  FEATURED_CATEGORY_QUERY,
  NEW_ARRIVAL_PRODUCTS,
  PRODUCT_BY_SLUG_QUERY,
  ALL_CATEGORIES_QUERY,
  FEATURED_PRODUCTS,
  BRANDS_QUERY,
  LATEST_BLOG_QUERY,
  DEAL_PRODUCTS,
  GET_ALL_BLOG,
  SINGLE_BLOG_QUERY,
  BLOG_CATEGORIES,
  OTHERS_BLOG_QUERY,
  ADDRESS_QUERY,
  TOTAL_PRODUCTS_COUNT_QUERY,
  PRODUCTS_BY_BRAND_QUERY,
  PRODUCTS_BY_SEGMENT,
  COLLECTION_QUERY,
  SINGLE_COLLECTION_QUERY,
} from "./query"

import { client } from "../lib/client"

/* ----------------------------
 ✅ Banner
---------------------------- */
const getBanner = async () => {
  const { data } = await sanityFetch({ query: BANNER_QUERY })
  return data ?? []
}

/* ----------------------------
 ✅ Featured Category
---------------------------- */
const getFeaturedCategory = async (quantity: number) => {
  const { data } = await sanityFetch({
    query: FEATURED_CATEGORY_QUERY,
    params: { quantity },
  })
  return data ?? []
}

/* ----------------------------
 ✅ Products
---------------------------- */
const getAllProducts = async () => {
  const { data } = await sanityFetch({ query: ALL_PRODUCTS_QUERY })
  return data ?? []
}

const getDealProducts = async () => {
  const { data } = await sanityFetch({ query: DEAL_PRODUCTS })
  return data ?? []
}

const getFeaturedProducts = async () => {
  const { data } = await sanityFetch({ query: FEATURED_PRODUCTS })
  return data ?? []
}

/* ----------------------------
 ✅ Total Count
---------------------------- */
const getTotalProductsCount = async () => {
  const { data } = await sanityFetch({ query: TOTAL_PRODUCTS_COUNT_QUERY })
  return data ?? 0
}

/* ----------------------------
 ✅ Brand + Segment Filters
---------------------------- */
const getProductsByBrand = async (brandSlug: string) => {
  const { data } = await sanityFetch({
    query: PRODUCTS_BY_BRAND_QUERY,
    params: { brandSlug },
  })
  return data ?? []
}

const getProductsBySegment = async (segment: string, quantity: number) => {
  const { data } = await sanityFetch({
    query: PRODUCTS_BY_SEGMENT,
    params: { segment, quantity },
  })
  return data ?? []
}

/* ----------------------------
 ✅ Brands
---------------------------- */
const getAllBrands = async () => {
  const { data } = await sanityFetch({ query: BRANDS_QUERY })
  return data ?? []
}

/* ----------------------------
 ✅ Blogs
---------------------------- */
const getLatestBlogs = async (quantity: number = 4) => {
  const { data } = await sanityFetch({
    query: LATEST_BLOG_QUERY,
    params: { quantity },
  })
  return data ?? []
}

const getAllBlogs = async (quantity: number) => {
  const { data } = await sanityFetch({
    query: GET_ALL_BLOG,
    params: { quantity },
  })
  return data ?? []
}

const getSingleBlog = async (slug: string) => {
  const { data } = await sanityFetch({
    query: SINGLE_BLOG_QUERY,
    params: { slug },
  })
  return data ?? null
}

const getBlogCategories = async () => {
  const { data } = await sanityFetch({ query: BLOG_CATEGORIES })
  return data ?? []
}

const getOthersBlog = async (slug: string, quantity: number) => {
  const { data } = await sanityFetch({
    query: OTHERS_BLOG_QUERY,
    params: { slug, quantity },
  })
  return data ?? []
}

/* ----------------------------
 ✅ Address
---------------------------- */
const getAddresses = async () => {
  const { data } = await sanityFetch({ query: ADDRESS_QUERY })
  return data ?? []
}

/* ----------------------------
 ✅ Categories
---------------------------- */
const getCategories = async (quantity?: number) => {
  const query = quantity
    ? `*[_type == "category"] | order(name asc)[0...$quantity]{
        ...,
        "productCount": count(*[_type=="product" && references(^._id)])
      }`
    : `*[_type == "category"] | order(name asc){
        ...,
        "productCount": count(*[_type=="product" && references(^._id)])
      }`

  const { data } = await sanityFetch({
    query,
    params: quantity ? { quantity } : {},
  })

  return data ?? []
}

/* ----------------------------
 ✅ Product + Brand Page
---------------------------- */
const getProductBySlug = async (slug: string) => {
  const { data } = await sanityFetch({
    query: PRODUCT_BY_SLUG_QUERY,
    params: { slug },
  })
  return data ?? null
}

const getBrand = async (slug: string) => {
  const { data } = await sanityFetch({
    query: BRAND_QUERY,
    params: { slug },
  })
  return data ?? null
}

/* ----------------------------
 ✅ All Categories
---------------------------- */
const getAllCategories = async () => {
  return await client.fetch(ALL_CATEGORIES_QUERY)
}

/* ----------------------------
 ✅ Collections (FIXED POSITION)
---------------------------- */
const getCollections = async () => {
  const { data } = await sanityFetch({ query: COLLECTION_QUERY })
  return data ?? []
}

const getSingleCollection = async (slug: string) => {
  const { data } = await sanityFetch({
    query: SINGLE_COLLECTION_QUERY,
    params: { slug },
  })
  return data ?? null
}

/* ----------------------------
 ✅ EXPORTS (Always At Bottom)
---------------------------- */
export {
  getBanner,
  getFeaturedCategory,
  getAllProducts,
  getDealProducts,
  getFeaturedProducts,
  getAllBrands,
  getLatestBlogs,
  getSingleBlog,
  getAllBlogs,
  getBlogCategories,
  getOthersBlog,
  getAddresses,
  getCategories,
  getProductBySlug,
  getBrand,
  getAllCategories,
  getTotalProductsCount,
  getProductsByBrand,
  getProductsBySegment,
  getCollections,
  getSingleCollection,
}
