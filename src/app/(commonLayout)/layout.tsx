import CurrentYear from "@/components/common/CurrentYear";
import Navbar from "@/components/layout/Navbar";
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

      {/* Shared Footer */}
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p>&copy; <CurrentYear /> FIFTH SENSE PERFUMES. All rights reserved. Haute Parfumerie &amp; Olfactory Atelier.</p>
        </div>
      </footer>
    </div>
  );
}

