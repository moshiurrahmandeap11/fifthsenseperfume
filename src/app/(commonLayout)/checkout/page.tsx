import type { Metadata } from "next";
import { connection } from "next/server";
import { getMe } from "@/services/auth.services";
import CheckoutClient from "@/components/modules/storefront/checkout/CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout | FIFTH SENSE",
  description:
