import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import { getSingleCollection } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import Image from "next/image";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

const CollectionPage = async ({ params }: Props) => {
  const { slug } = await params;
  const collection = await getSingleCollection(slug);

  if (!collection) {
    notFound();
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
    
      {/* Hero Banner */}
      <div className="relative w-full h-[300px] md:h-[450px] bg-gray-900">
        {collection.image ? (
          <Image
            src={urlFor(collection.image).url()}
            alt={collection.title || "Collection Banner"}
            fill
            className="object-cover opacity-50"
            priority
          />
        ) : (
             <div className="absolute inset-0 bg-zamzam-primary/20" />
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-md">
            {collection.title}
          </h1>
          {collection.description && (
            <p className="text-lg text-white/90 max-w-2xl mx-auto drop-shadow-sm">
              {collection.description}
            </p>
          )}
        </div>
      </div>

      <Container className="py-10">
        {collection.products && collection.products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {collection.products.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
            <div className="text-center py-20">
                <p className="text-gray-500 text-lg">No products found in this collection.</p>
            </div>
        )}
      </Container>
    </div>
  );
};

export default CollectionPage;
