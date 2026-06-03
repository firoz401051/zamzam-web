"use server";

import { getProductsBySegment } from "@/sanity/queries";

export const fetchProductsBySegment = async (
  segment: string,
  quantity: number = 10
) => {
  const products = await getProductsBySegment(segment, quantity);
  return products;
};
