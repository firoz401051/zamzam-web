import { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import AdminLoyaltyManager from '@/components/admin/AdminLoyaltyManager';

export const metadata: Metadata = {
  title: 'Loyalty Management | Admin Dashboard',
  description: 'Manage customer loyalty points and membership tiers',
};

export default async function AdminLoyaltyPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  // TODO: Add admin role verification
  // const userRole = await getUserRole(userId);
  // if (userRole !== 'admin') {
  //   redirect('/');
  // }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Loyalty Management</h1>
        <p className="text-gray-600">
          Manage customer loyalty points, membership tiers, and program statistics
        </p>
      </div>
      
      <AdminLoyaltyManager />
    </div>
  );
}