import { Suspense } from 'react';
import { Metadata } from 'next';
import AdminProductsClient from '@/components/admin/AdminProductsClient';
import { ProductsPageSkeleton } from '@/components/admin/ProductsPageSkeleton';

export const metadata: Metadata = {
  title: 'Products Management | zamzam Admin',
  description: 'Manage products, inventory, and categories',
};

export default function AdminProductsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
        <p className="text-gray-600 mt-2">
          Manage your product catalog, inventory, and pricing
        </p>
      </div>

      <Suspense fallback={<ProductsPageSkeleton />}>
        <AdminProductsClient />
      </Suspense>
    </div>
  );
}