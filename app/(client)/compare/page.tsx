import CompareProducts from "@/components/CompareProducts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Products | zamzam",
  description:
    "Compare multiple products side by side to make the best choice for your needs",
};

const ComparePage = () => {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Product Comparison
          </h1>
          <p className="text-gray-600">
            Compare products side by side to find the perfect match for your
            needs
          </p>
        </div>
        <CompareProducts />
      </div>
    </div>
  );
};

export default ComparePage;
