"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

interface TopBarProps {
  message?: string;
}

export default function TopBar({
  message = '"Enjoy 20% off with code BUY2 — Complimentary tester on all prepaid orders"',
}: TopBarProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Store announcement"
      className="relative w-full bg-black text-white py-2 sm:py-2.5 px-4 text-center select-none rounded-none border-b border-neutral-900 transition-all duration-300"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <p className="text-xs sm:text-[13px] font-sans font-normal tracking-normal text-neutral-100 pr-10 sm:pr-0">
          {message}
        </p>
      </div>

      {/* Close / Dismiss Announcement Button - Positioned at the very right corner of the screen */}
      <button
        type="button"
        onClick={() => setIsVisible(false)}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer rounded-none"
        aria-label="Close announcement"
        title="Dismiss"
      >
        <X className="size-3.5 sm:size-4 stroke-[1.5]" />
      </button>
    </aside>
  );
}
