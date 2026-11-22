import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ReactNode } from "react";

export default function CommonLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Shared Storefront Navbar */}
      <Navbar />

      <main className="flex-1">{children}</main>

      {/* Shared Editorial Luxury Footer */}
      <Footer />
    </div>
  );
}

