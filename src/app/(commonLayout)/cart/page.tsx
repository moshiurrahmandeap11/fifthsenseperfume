import type { Metadata } from "next";
import CartPageClient from "@/components/modules/storefront/cart/CartPageClient";

export const metadata: Metadata = {
  title: "Shopping Bag | FIFTH SENSE",
  description:
    "Review your selected artisanal fragrances, fine extraits, and Indian attars in your Fifth Sense shopping bag.",
};

export default function CartPage() {
  return <CartPageClient />;
}
