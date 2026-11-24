import React from "react";
import { Metadata } from "next";
import { connection } from "next/server";
import { getMe } from "@/services/auth.services";
import { getMyAddresses } from "@/services/user.services";
import CustomerAddressesClient from "@/components/modules/customer/CustomerAddressesClient";

export const metadata: Metadata = {
  title: "Saved Addresses | FIFTH SENSE PERFUMES",
  description: "Manage your saved delivery addresses.",
};

export default async function CustomerAddressesPage() {
