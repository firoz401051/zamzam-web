"use client";
import { useAdmin } from "@/lib/admin";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "@/components/Loading";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle } from "lucide-react";
import Link from "next/link";

interface AdminProtectedProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export const AdminProtected = ({
  children,
  fallback,
  redirectTo = "/dashboard",
}: AdminProtectedProps) => {
  const { isAdmin, isLoaded, user } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isAdmin && redirectTo) {
      router.push(redirectTo);
    }
  }, [isAdmin, isLoaded, router, redirectTo]);

  if (!isLoaded) {
    return <Loading />;
  }

  if (!user) {
    return (
      <Container className="py-10">
        <div className="text-center">
          <Shield className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-gray-600 mb-6">
            Please sign in to access this area.
          </p>
          <Link href="/sign-in">
            <Button>Sign In</Button>
          </Link>
        </div>
      </Container>
    );
  }

  if (!isAdmin) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Container className="py-10">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 mx-auto text-red-300 mb-4" />
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You don't have admin privileges to access this area.
          </p>
          <div className="space-x-4">
            <Link href="/dashboard">
              <Button variant="outline">Go to Dashboard</Button>
            </Link>
            <Link href="/">
              <Button>Go Home</Button>
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  return <>{children}</>;
};

export default AdminProtected;
