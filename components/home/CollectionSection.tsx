import { getCollections } from "@/sanity/queries";
import Container from "../Container";
import Title from "../Title";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/image";
import ProductCard from "../ProductCard";

const CollectionSection = async () => {
  const collections = await getCollections();

  if (!collections || collections.length === 0) {
    return null;
  }

  return (
    <Container className="flex flex-col gap-16 pb-16">
      {collections.map((collection: any) => (
        <div key={collection._id} className="space-y-6">
          {/* Collection Banner */}
          <Link
            href={`/collection/${collection.slug.current}`}
            className="block group"
          >
            <div className="relative w-full h-[250px] md:h-[450px] overflow-hidden rounded-2xl">
              {collection.image ? (
                <Image
                  src={urlFor(collection.image).url()}
                  alt={collection.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full bg-zamzam-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-zamzam-primary">
                    {collection.title}
                  </span>
                </div>
              )}
              {/* Overlay Content */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-500 flex flex-col items-center justify-center text-center p-4">
                <h3 className="text-3xl md:text-5xl font-bold text-white mb-2 transform group-hover:-translate-y-2 transition-transform duration-500 bg-black/20 px-6 py-2 rounded-full backdrop-blur-sm">
                  {collection.title}
                </h3>
                {collection.description && (
                  <p className="text-white/90 text-lg max-w-2xl opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                    {collection.description}
                  </p>
                )}
                <div className="mt-6 px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-zamzam-primary hover:text-white transition-colors duration-300">
                  View Collection
                </div>
              </div>
            </div>
          </Link>

          {/* Collection Products Preview */}
          {collection.products && collection.products.length > 0 && (
            <Container>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
                {collection.products.map((product: any) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </Container>
          )}
        </div>
      ))}
    </Container>
  );
};

export default CollectionSection;
