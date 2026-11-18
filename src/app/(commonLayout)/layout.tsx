import CurrentYear from "@/components/common/CurrentYear";
import { ReactNode } from "react";

export default function CommonLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Shared Navbar will be mounted here */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <span className="text-xl font-bold tracking-tight">EcomBD</span>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      {/* Shared Footer will be mounted here */}
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <p>&copy; <CurrentYear /> EcomBD. All rights reserved.</p>
      </footer>
    </div>
  );
}

