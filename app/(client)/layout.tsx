import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCategories } from "@/sanity/queries";
import { headers } from "next/headers";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getCategories(5);

  // ✅ Detect current path safely
  const headerList = await headers();
  const pathname = headerList.get("x-next-url") || "";

  // ✅ Hide Header/Footer on Checkout page
  const isCheckoutPage = pathname.startsWith("/checkout");

  return (
    <>
      {!isCheckoutPage && <Header />}

      <main>{children}</main>

      {!isCheckoutPage && <Footer categories={categories} />}
    </>
  );
}
