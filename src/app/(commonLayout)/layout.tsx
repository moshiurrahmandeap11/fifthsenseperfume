import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/modules/storefront/cart/CartDrawer";
import WhatsAppConcierge from "@/components/layout/WhatsAppConcierge";
import StorefrontLayoutWrapper from "@/components/layout/StorefrontLayoutWrapper";
import { CartProvider } from "@/providers/CartProvider";
import { getMe } from "@/services/auth.services";
import { connection } from "next/server";
import { ReactNode } from "react";

export default async function CommonLayout({
  children,
}: {
  children: ReactNode;
}) {
  await connection();
  const user = await getMe();

  return (
    <CartProvider>
      {/* Luxury Scaled Canvas Wrapper on Desktop when Drawer Opens */}
      <StorefrontLayoutWrapper>
        {/* Shared Storefront Navbar */}
        <Navbar initialUser={user} />

        <main className="flex-1">{children}</main>

        {/* Shared Editorial Luxury Footer */}
        <Footer />

        {/* Floating WhatsApp Concierge Button */}
        <WhatsAppConcierge />
      </StorefrontLayoutWrapper>

      {/* Slide-Over Luxury Fragrance Bag Drawer */}
      <CartDrawer />
    </CartProvider>
  );
}

