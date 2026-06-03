import { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import LoyaltyPoints from '@/components/LoyaltyPoints';
import MembershipBadge from '@/components/MembershipBadge';
import Container from '@/components/Container';
import { getUserLoyaltyStats } from '@/lib/actions/loyalty';
import LoginRequiredMessage from "@/components/LoginRequiredMessage";

export const metadata: Metadata = {
  title: 'My Loyalty Points | zamzam',
  description: 'View your loyalty points, membership tier, and transaction history',
};

export default async function LoyaltyPointsPage() {
  const { userId } = await auth();
  
  if (!userId) {
    return (
     <Container className="py-8">
       <LoginRequiredMessage 
         details="Log in to view your loyalty points, membership tier, and transaction history. Join our loyalty program to earn rewards!" 
       />
     </Container>
    );
  }

  const loyaltyData = await getUserLoyaltyStats(userId);

  return (
    <Container className="py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">My Loyalty Points</h1>
          <p className="text-gray-600">
            Earn points with every purchase and enjoy exclusive member benefits
          </p>
        </div>

        {loyaltyData.success && loyaltyData.loyaltyData ? (
          <div className="space-y-6">
            {/* Membership Badge */}
            <MembershipBadge 
              tier={loyaltyData.loyaltyData.membershipType}
              points={loyaltyData.loyaltyData.loyaltyPoints}
              variant="card"
              showBenefits={true}
              className="mb-6"
            />

            {/* Loyalty Points Component */}
            <LoyaltyPoints showFullDetails={true} />
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">
              Unable to load your loyalty information at this time.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Please try again later or contact support.
            </p>
          </div>
        )}
      </div>
    </Container>
  );
}