import React from "react";
import { Metadata } from "next";
import { connection } from "next/server";
import { getMyOrders } from "@/services/order.services";
import CustomerOrdersClient from "@/components/modules/customer/CustomerOrdersClient";

export const metadata: Metadata = {
  title: "My Orders | FIFTH SENSE PERFUMES",
  description: "Track and manage your fragrance orders.",
};

export default async function CustomerOrdersPage() {
  await connection();
  const res = await getMyOrders().catch(() => ({ data: [] }));

  return <CustomerOrdersClient initialOrders={res?.data || []} />;
}
