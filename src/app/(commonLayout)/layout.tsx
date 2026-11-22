import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
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
    <div className="flex min-h-screen flex-col">
      {/* Shared Storefront Navbar */}
      <Navbar initialUser={user} />

      <main className="flex-1">{children}</main>

      {/* Shared Editorial Luxury Footer */}
      <Footer />
    </div>
  );
}

