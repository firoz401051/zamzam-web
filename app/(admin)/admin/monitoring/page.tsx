import { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import SystemMonitoringDashboard from '@/components/admin/SystemMonitoringDashboard';

export const metadata: Metadata = {
  title: 'System Monitoring | Admin Dashboard',
  description: 'Real-time system health monitoring and performance tracking',
};

export default async function SystemMonitoringPage() {
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
      <SystemMonitoringDashboard />
    </div>
  );
}