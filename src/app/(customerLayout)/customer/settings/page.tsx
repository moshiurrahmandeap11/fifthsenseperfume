import React from "react";
import { Metadata } from "next";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { getMe } from "@/services/auth.services";
import CustomerSettingsClient from "@/components/modules/customer/CustomerSettingsClient";

export const metadata: Metadata = {
  title: "Profile & Security | FIFTH SENSE PERFUMES",
  description: "Update your personal details and account password.",
};

export default async function CustomerSettingsPage() {
  await connection();
  const user = await getMe();

  if (!user) {
    redirect("/login?callbackUrl=/customer/settings");
  }

  return <CustomerSettingsClient user={user} />;
}
