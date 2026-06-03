import Container from "@/components/Container";
import ProductSkeleton from "@/components/ProductSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      {/* Hero Banner Skeleton */}
      <div className="relative w-full h-[300px] md:h-[450px] bg-gray-900 flex flex-col items-center justify-center p-6 space-y-4">
        <Skeleton className="h-12 w-3/4 md:w-1/2 bg-white/10" />
        <Skeleton className="h-6 w-full md:w-2/3 max-w-2xl bg-white/10" />
      </div>

      <Container className="py-10">
        {/* Product Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      </Container>
    </div>
  );
}
