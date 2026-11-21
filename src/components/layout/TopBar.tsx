import React from "react";

interface TopBarProps {
  message?: string;
}

export default function TopBar({
  message = '"Enjoy 20% off with code BUY2 — Complimentary tester on all prepaid orders"',
}: TopBarProps) {
  return (
    <aside
      aria-label="Store announcement"
      className="w-full bg-black text-white py-2 sm:py-2.5 px-4 text-center select-none rounded-none border-b border-neutral-900"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <p className="text-xs sm:text-[13px] font-sans font-normal tracking-normal text-neutral-100">
          {message}
        </p>
      </div>
    </aside>
  );
}
