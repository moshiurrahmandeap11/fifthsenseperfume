import React from "react";
import { Metadata } from "next";
import { connection } from "next/server";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  MapPin,
  Package,
  Phone,
  Settings,
  Truck,
} from "lucide-react";
import { getMe } from "@/services/auth.services";
import { getMyOrders } from "@/services/order.services";
import { getMyAddresses } from "@/services/user.services";
import { formatFragrancePrice } from "@/components/modules/storefront/cart/cartUtils";

export const metadata: Metadata = {
  title: "Customer Dashboard | FIFTH SENSE PERFUMES",
  description:
    "Overview of your fragrance orders, loyalty points, saved addresses, and account settings.",
};
