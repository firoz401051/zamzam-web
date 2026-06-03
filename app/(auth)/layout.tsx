import Container from "@/components/Container";
import Logo from "@/components/layout/Logo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication | zamzam",
  description: "Sign in or create an account for zamzam",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
      <Container className="h-screen flex flex-col items-center justify-center gap-5">
        <div className="text-center flex flex-col items-center">
          {/* Logo/Brand Section */}

          <Logo />

          {/* Welcome Message */}
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-zamzam-primary via-pink-500 to-red-500 bg-clip-text text-transparent mb-3">
            Welcome to Zam Zam Fashion Store
          </h1>

          <div className="max-w-sm mx-auto">
            <p className="text-gray-600 text-sm leading-relaxed">
              Your ultimate destination for fashion and lifestyle.
              <br />
              Shop smart, live better.
            </p>
          </div>
        </div>
        {children}
      </Container>
    </div>
  );
}
