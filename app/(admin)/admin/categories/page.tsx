import { Suspense } from 'react';
import { Metadata } from 'next';
import AdminCategoriesClient from '@/components/admin/AdminCategoriesClient';
import { CategoriesPageSkeleton } from '@/components/admin/CategoriesPageSkeleton';

export const metadata: Metadata = {
  title: 'Categories Management | zamzam Admin',
  description: 'Manage product categories and hierarchies',
};

export default function AdminCategoriesPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Categories Management</h1>
        <p className="text-gray-600 mt-2">
          Organize your products with categories and subcategories
        </p>
      </div>

      <Suspense fallback={<CategoriesPageSkeleton />}>
        <AdminCategoriesClient />
      </Suspense>
    </div>
  );
}