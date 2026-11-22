import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/modules/storefront/cart/CartDrawer";
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
      <div className="flex min-h-screen flex-col">
        {/* Shared Storefront Navbar */}
        <Navbar initialUser={user} />

        <main className="flex-1">{children}</main>

        {/* Shared Editorial Luxury Footer */}
        <Footer />

        {/* Slide-Over Luxury Fragrance Bag Drawer */}
        <CartDrawer />
      </div>
    </CartProvider>
  );
}

