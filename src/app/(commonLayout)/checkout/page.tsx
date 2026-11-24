import type { Metadata } from "next";
import { connection } from "next/server";
import { getMe } from "@/services/auth.services";
import { getMyAddresses } from "@/services/user.services";
import CheckoutClient from "@/components/modules/storefront/checkout/CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout | FIFTH SENSE",
  description:
    "Complete your artisanal fragrance order with express delivery across Bangladesh.",
};

export default async function CheckoutPage() {
  await connection();
  const user = await getMe().catch(() => null);
  const addressesRes = user
    ? await getMyAddresses().catch(() => ({ data: [] }))
    : { data: [] };

  return (
    <CheckoutClient
      initialUser={user}
      initialAddresses={addressesRes?.data || []}
    />
  );
}
