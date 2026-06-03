import Link from "next/link";
import React from "react";
import { auth } from "@clerk/nextjs/server";

import Container from "./Container";
import { getMyOrders } from "@/sanity/helpers";

import HeaderMenu from "./layout/HeaderMenu";
import Logo from "./layout/Logo";
import MobileMenu from "./layout/MobileMenu";
import TopBar from "./layout/TopBar";

import HeaderScrollEffect from "./layout/HeaderScrollEffect";
import StickyHeader from "./layout/StickyHeader";

// ✅ NEW Client Component
import HeaderUserSection from "./layout/HeaderUserSection";

const Header = async () => {
  const { userId } = await auth();

  let ordersCount = 0;
  if (userId) {
    const orders = await getMyOrders(userId);
    ordersCount = orders?.length || 0;
  }

  const phoneNumber = process.env.NEXT_PUBLIC_COMPANY_PHONE || "1234567890";
  const emailAddress =
    process.env.NEXT_PUBLIC_COMPANY_EMAIL || "info@example.com";
  const companyAddress =
    process.env.NEXT_PUBLIC_COMPANY_ADDRESS || "123 Main St";

  return (
    <StickyHeader
      topBar={
        <TopBar
          phoneNumber={phoneNumber}
          emailAddress={emailAddress}
          companyAddress={companyAddress}
        />
      }
    >
      <HeaderScrollEffect>
        <Container className="flex items-center justify-between gap-7 text-zamzam-text-medium">
          {/* Logo + Mobile */}
          <div className="w-auto md:w-1/3 flex items-center gap-2.5">
            <div className="md:hidden">
              <MobileMenu />
            </div>
            <Logo />
          </div>

          {/* Menu */}
          <HeaderMenu />

          {/* ✅ Client-only User Section */}
          <HeaderUserSection ordersCount={ordersCount} />
        </Container>
      </HeaderScrollEffect>
    </StickyHeader>
  );
};

export default Header;
