import HomeCategories from "@/components/HomeCategories";
import ProductTabs from "@/components/home/ProductTabs";
import SpecialOfferBanner from "@/components/home/SpecialOfferBanner";
import ServiceFeatures from "@/components/home/ServiceFeatures";
import Testimonials from "@/components/home/Testimonials";
import LatestBlog from "@/components/LatestBlog";
import Newsletter from "@/components/home/Newsletter";
import ShopByBrands from "@/components/ShopByBrands";
import { getFeaturedCategory, getProductsBySegment } from "@/sanity/queries";
import HomeBanner from "@/components/home/HomeBanner";
import CollectionSection from "@/components/home/CollectionSection";

export default async function Home() {
  const categories = await getFeaturedCategory(10);
  const products = await getProductsBySegment("new-arrival", 10);

  return (
    <div>
      <HomeBanner />
      <ProductTabs products={products} />
      <SpecialOfferBanner />
      <CollectionSection />
      <div className="py-10">
        <HomeCategories categories={categories} />
        <ShopByBrands />
      </div>
      <ServiceFeatures />
      <Testimonials />
      <LatestBlog />
      <Newsletter />
    </div>
  );
}
