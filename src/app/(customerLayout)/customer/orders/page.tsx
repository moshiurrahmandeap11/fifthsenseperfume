import React from "react";
import { Metadata } from "next";
import { connection } from "next/server";
import { getMyOrders } from "@/services/order.services";
import CustomerOrdersClient from "@/components/modules/customer/CustomerOrdersClient";

export const metadata: Metadata = {
  title: "My Orders | FIFTH SENSE PERFUMES",
