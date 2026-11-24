"use client";

import React, { useSyncExternalStore } from "react";
import { X } from "lucide-react";
import { useBrand } from "@/providers/BrandProvider";

interface TopBarProps {
  message?: string;
}

const DISMISSED_ANNOUNCEMENT_KEY = "fifthsense_dismissed_announcement";

function subscribeToDismissed(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("announcement-dismissed", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("announcement-dismissed", callback);
  };
}

function getDismissedSnapshot(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(DISMISSED_ANNOUNCEMENT_KEY);
  } catch {
    return null;
  }
}

function getServerSnapshot(): string | null {
  return null;
}

export default function TopBar({ message }: TopBarProps) {
  const brand = useBrand();
  const dismissedText = useSyncExternalStore(
    subscribeToDismissed,
    getDismissedSnapshot,
    getServerSnapshot
  );

  const content =
    message ||
    brand.announcementText ||
    "Complimentary discovery sample included with every flacon order.";

  if (dismissedText === content) return null;

  const handleDismiss = () => {
    try {
      window.localStorage.setItem(DISMISSED_ANNOUNCEMENT_KEY, content);
      window.dispatchEvent(new Event("announcement-dismissed"));
    } catch {
      // ignore storage errors
    }
  };

  return (
    <aside
      aria-label="Store announcement"
      className="relative w-full bg-black text-white py-2 sm:py-2.5 px-4 text-center select-none rounded-none border-b border-neutral-900 transition-all duration-300"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <p className="text-xs sm:text-[13px] font-sans font-normal tracking-normal text-neutral-100 pr-10 sm:pr-0">
          {content}
        </p>
      </div>

      {/* Close / Dismiss Announcement Button - Positioned at the very right corner of the screen */}
      <button
        type="button"
        onClick={handleDismiss}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer rounded-none"
        aria-label="Close announcement"
        title="Dismiss"
      >
        <X className="size-3.5 sm:size-4 stroke-[1.5]" />
      </button>
    </aside>
  );
}
