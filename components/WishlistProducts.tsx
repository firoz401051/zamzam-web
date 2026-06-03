"use client";

import useCartStore from "@/store";
import { useState } from "react";
import PriceFormatter from "./PriceFormatter";
import { Button } from "./ui/button";
import AddToCartButton from "./AddToCartButton";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/sanity.types";
import { urlFor } from "@/sanity/image";
import Container from "./Container";
import { Heart, X } from "lucide-react";
import toast from "react-hot-toast";

const WishlistProducts = () => {
  const [visibleProducts, setVisibleProducts] = useState(7);
  const { favoriteProduct, removeFromFavorite, resetFavorite } = useCartStore();

  const loadMore = () => {
    setVisibleProducts((prev) => Math.min(prev + 5, favoriteProduct.length));
  };

  const handleResetFavorite = () => {
    const confirmed = window.confirm(
      "Are you sure you want to remove all products from wishlist?"
    );
    if (confirmed) {
      resetFavorite();
      toast.success("All products removed from wishlist");
    }
  };

  return (
    <Container className="my-10">
      {favoriteProduct.length > 0 ? (
        <>
          {" "}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="border-b">
                <tr className="bg-amazonLight/10 rounded-md">
                  <th className="p-2 text-left">Image</th>
                  <th className="p-2 text-left hidden md:table-cell">
                    Category
                  </th>
                  <th className="p-2 text-left hidden md:table-cell">Type</th>
                  <th className="p-2 text-left hidden md:table-cell">Status</th>
                  <th className="p-2 text-left">Price</th>
                  <th className="p-2 text-center md:text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {favoriteProduct
                  ?.slice(0, visibleProducts)
                  .map((product: Product) => (
                    <tr key={product._id} className="border-b">
                      <td className="px-2 py-4 flex items-center gap-2">
                        <X
                          onClick={() => {
                            removeFromFavorite(product._id);
                            toast.success("Product removed from wishlist");
                          }}
                          size={18}
                          className="hover:text-zamzam-primary hoverEffect"
                        />
                        {product?.images && (
                          <Link
                            href={{
                              pathname: `/products/${product?.slug?.current}`,
                              query: { id: product?._id },
                            }}
                            className="border rounded-md group hidden md:inline-flex"
                          >
                            <Image
                              src={urlFor(product.images[0]).url()}
                              alt="productImage"
                              width={80}
                              height={80}
                              className={`rounded-md group-hover:scale-105 hoverEffect h-20 w-20 object-contain ${product?.stock === 0 ? "opacity-50" : ""}`}
                            />
                          </Link>
                        )}
                        <p className="line-clamp-1">{product?.name}</p>
                      </td>
                      <td className="p-2 capitalize hidden md:table-cell">
                        {product?.categories && (
                          <p className="uppercase line-clamp-1 text-xs font-medium">
                            {product.categories.map((cat) => cat).join(", ")}
                          </p>
                        )}
                      </td>
                      <td className="p-2 capitalize hidden md:table-cell">
                        {product?.variant}
                      </td>

                      <td
                        className={`p-2 w-24 ${
                          (product?.stock as number) > 0
                            ? "text-green-600"
                            : "text-red-600"
                        } font-medium text-sm hidden md:table-cell`}
                      >
                        {(product?.stock as number) > 0
                          ? "In Stock"
                          : "Out of Stock"}
                      </td>
                      <td className="p-2">
                        <PriceFormatter amount={product?.price} />
                      </td>
                      <td className="p-2">
                        <AddToCartButton product={product} className="w-full" />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {visibleProducts < favoriteProduct.length && (
            <div className="mt-8 text-center">
              <Button onClick={loadMore} variant="outline">
                Load More
              </Button>
            </div>
          )}
          {visibleProducts > 10 && (
            <div className="mt-8 text-center">
              <Button onClick={() => setVisibleProducts(10)} variant="outline">
                Load Less
              </Button>
            </div>
          )}
          {favoriteProduct.length > 0 && (
            <button
              className="m-2.5 border px-6 py-3 border-zamzam-primary/50 font-semibold text-zamzam-text-dark hover:text-zamzam-primary hover:border-zamzam-primary hover:bg-zamzam-primary/10 rounded-md hoverEffect"
              onClick={handleResetFavorite}
            >
              Reset Favorite
            </button>
          )}
        </>
      ) : (
        <div className="flex min-h-[400px] flex-col items-center justify-center space-y-6 px-4 text-center">
          <div className="relative mb-4">
            <div className="absolute -top-1 -right-1 h-4 w-4 animate-ping rounded-full bg-muted-foreground/20" />
            <Heart
              className="h-12 w-12 text-muted-foreground"
              strokeWidth={1.5}
            />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              Your wishlist is empty
            </h2>
            <p className="text-sm text-muted-foreground">
              Items added to your wishlist will appear here
            </p>
          </div>
          <Button asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      )}
    </Container>
  );
};

export default WishlistProducts;
