"use client";
import { BRANDS_QUERYResult, Category, Product } from "@/sanity.types";
import { client } from "@/sanity/lib/client";
import React, { useEffect, useState } from "react";
import Container from "../Container";
import Title from "../Title";
import CategoryList from "./CategoryList";
import { Loader2 } from "lucide-react";
import ProductCard from "../ProductCard";
import NoProductAvailable from "../common/NoProductAvailable";
import BrandList from "./BrandList";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import PriceList from "./PriceList";

interface Props {
  categories: Category[];
  brands: BRANDS_QUERYResult;
}

const Shop = ({ categories, brands }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const brandParams = searchParams?.get("brand");
  const categoryParams = searchParams?.get("category");
  const priceParams = searchParams?.get("price");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    categoryParams || null
  );
  const [selectedBrand, setSelectedBrand] = useState<string | null>(
    brandParams || null
  );
  const [selectedPrice, setSelectedPrice] = useState<string | null>(
    priceParams || null
  );

  // Update URL when filters change
  const updateURL = (
    category: string | null,
    brand: string | null,
    price: string | null
  ) => {
    const params = new URLSearchParams();

    if (category) params.set("category", category);
    if (brand) params.set("brand", brand);
    if (price) params.set("price", price);

    const queryString = params.toString();
    const newURL = queryString ? `${pathname}?${queryString}` : pathname;

    router.replace(newURL);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Extract min and max price from selectedPrice
      let minPrice = 0;
      let maxPrice = 10000; // Default high value

      if (selectedPrice) {
        const [min, max] = selectedPrice.split("-").map(Number);
        minPrice = min;
        maxPrice = max;
      }
      const query = `
      *[_type == 'product' 
        && (!defined($selectedCategory) || references(*[_type == "category" && slug.current == $selectedCategory]._id))
        && (!defined($selectedBrand) || references(*[_type == "brand" && slug.current == $selectedBrand]._id))
        && price >= $minPrice && price <= $maxPrice
      ] 
      | order(name asc) {
        ...,"categories": categories[]->title
      }
    `;

      const data = await client.fetch(
        query,
        {
          selectedCategory,
          selectedBrand,
          minPrice,
          maxPrice,
        },
        { next: { revalidate: 0 } }
      );
      setProducts(data);
    } catch (error) {
      console.log("Shop product fetching Error", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
    // Update URL when filters change
    updateURL(selectedCategory, selectedBrand, selectedPrice);
  }, [selectedCategory, selectedBrand, selectedPrice]);

  // Update state when URL parameters change
  useEffect(() => {
    const newCategoryParam = searchParams?.get("category");
    const newBrandParam = searchParams?.get("brand");
    const newPriceParam = searchParams?.get("price");

    if (newCategoryParam !== selectedCategory) {
      setSelectedCategory(newCategoryParam);
    }
    if (newBrandParam !== selectedBrand) {
      setSelectedBrand(newBrandParam);
    }
    if (newPriceParam !== selectedPrice) {
      setSelectedPrice(newPriceParam);
    }
  }, [searchParams]);

  return (
    <div className="bg-white border-t">
      <Container className="mt-5">
        <div className="sticky top-0 z-10 mb-5">
          <div className="flex justify-between items-center">
            <Title className="text-lg uppercase tracking-wide">
              Get the products as your needs
            </Title>
            {(selectedCategory !== null ||
              selectedBrand !== null ||
              selectedPrice !== null) && (
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedBrand(null);
                  setSelectedPrice(null);
                  router.replace(pathname); // Clear URL parameters
                }}
                className="text-zamzam-primary underline text-sm mt-2 font-medium hover:text-dark-red hoverEffect"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-5 border-t border-t-zamzam-primary-dark/50">
          <div className="md:sticky md:top-20 md:self-start md:h-[calc(100vh-160px)] md:overflow-y-auto md:min-w-64 pb-5 scrollbar-hide border-r border-r-zamzam-primary-dark/50">
            <CategoryList
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
            <BrandList
              brands={brands}
              setSelectedBrand={setSelectedBrand}
              selectedBrand={selectedBrand}
            />
            <PriceList
              setSelectedPrice={setSelectedPrice}
              selectedPrice={selectedPrice}
            />
          </div>
          <div className="flex-1 pt-5">
            <div className="h-[calc(100vh-160px)] overflow-y-auto pr-2 scrollbar-hide">
              {loading ? (
                <div className="p-20 flex flex-col gap-4 items-center justify-center bg-white">
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-zamzam-primary rounded-full animate-bounce"></div>
                    <div
                      className="w-3 h-3 bg-zamzam-primary rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-3 h-3 bg-zamzam-primary rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <p className="font-semibold tracking-wide text-base text-zamzam-text-dark">
                    Products are loading...
                  </p>
                </div>
              ) : products?.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  {products?.map((product) => (
                    <ProductCard key={product?._id} product={product} />
                  ))}
                </div>
              ) : (
                <NoProductAvailable className="bg-white mt-0" />
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Shop;
