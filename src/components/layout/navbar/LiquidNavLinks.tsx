"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useTransition,
} from "react";
import { STOREFRONT_NAV_LINKS } from "./navLinks";
import { cn } from "@/lib/utils";

interface RectStyle {
  left: number;
  top: number;
  width: number;
  height: number;
  opacity: number;
}

export default function LiquidNavLinks() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // Find active tab index based on both pathname and searchParams
  const getActiveIndex = useCallback(() => {
    const gender = searchParams.get("gender")?.toUpperCase();
    const collection = searchParams.get("collection")?.toLowerCase();

    // Check specific query params first
    if (pathname === "/products" || pathname?.startsWith("/products/")) {
      if (collection === "winter") {
        const winterIdx = STOREFRONT_NAV_LINKS.findIndex(
          (l) => l.href.includes("collection=winter")
        );
        if (winterIdx !== -1) return winterIdx;
      }
      if (gender === "MEN") {
        const menIdx = STOREFRONT_NAV_LINKS.findIndex(
          (l) => l.href.includes("gender=MEN")
        );
        if (menIdx !== -1) return menIdx;
      }
      if (gender === "WOMEN") {
        const womenIdx = STOREFRONT_NAV_LINKS.findIndex(
          (l) => l.href.includes("gender=WOMEN")
        );
        if (womenIdx !== -1) return womenIdx;
      }

      // Default catalog
      const catalogIdx = STOREFRONT_NAV_LINKS.findIndex(
        (l) => l.href === "/products"
      );
      if (catalogIdx !== -1) return catalogIdx;
    }

    if (pathname === "/catalog") {
      const catalogIdx = STOREFRONT_NAV_LINKS.findIndex(
        (l) => l.href === "/products"
      );
      if (catalogIdx !== -1) return catalogIdx;
    }

    if (pathname === "/contact") {
      const contactIdx = STOREFRONT_NAV_LINKS.findIndex(
        (l) => l.href === "/contact"
      );
      if (contactIdx !== -1) return contactIdx;
    }

    if (pathname === "/") {
      return 0; // Home
    }

    // Default prefix match
    const foundIdx = STOREFRONT_NAV_LINKS.findIndex((link) => {
      if (link.href === "/") return pathname === "/";
      return pathname?.startsWith(link.href.split("?")[0]);
    });

    return foundIdx !== -1 ? foundIdx : 0;
  }, [pathname, searchParams]);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [isReady, setIsReady] = useState(false);

  const [activeRect, setActiveRect] = useState<RectStyle>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    opacity: 0,
  });

  const [hoverRect, setHoverRect] = useState<RectStyle>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    opacity: 0,
  });

  // Calculate exact position and dimensions of a tab relative to the container
  const getTabRect = useCallback((index: number): RectStyle | null => {
    const container = containerRef.current;
    const tab = tabRefs.current[index];
    if (!container || !tab) return null;

    const containerRect = container.getBoundingClientRect();
    const tabRect = tab.getBoundingClientRect();

    return {
      left: tabRect.left - containerRect.left,
      top: tabRect.top - containerRect.top,
      width: tabRect.width,
      height: tabRect.height,
      opacity: 1,
    };
  }, []);

  // Update active pill position
  const updateActivePill = useCallback(
    (index: number) => {
      const rect = getTabRect(index);
      if (rect) {
        setActiveRect(rect);
      }
    },
    [getTabRect]
  );

  // Sync active index with navigation changes
  useEffect(() => {
    const idx = getActiveIndex();
    setActiveIndex(idx);

    // Initial positioning
    const frameId = requestAnimationFrame(() => {
      updateActivePill(idx);
      // Enable fluid animations after initial pill has rendered
      setTimeout(() => {
        setIsReady(true);
      }, 50);
    });

    return () => cancelAnimationFrame(frameId);
  }, [getActiveIndex, updateActivePill]);

  // Recalculate on resize or layout changes with ResizeObserver
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      updateActivePill(activeIndex);
      if (hoverIndex !== null) {
        const hRect = getTabRect(hoverIndex);
        if (hRect) setHoverRect(hRect);
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [activeIndex, hoverIndex, updateActivePill, getTabRect]);

  const handleMouseEnterTab = (idx: number) => {
    setHoverIndex(idx);
    const rect = getTabRect(idx);
    if (rect) {
      setHoverRect(rect);
    }
  };

  const handleMouseLeaveContainer = () => {
    setHoverIndex(null);
    setHoverRect((prev) => ({ ...prev, opacity: 0 }));
  };

  const handleTabClick = (idx: number) => {
    // Instant optimistic slide for maximum responsiveness
    startTransition(() => {
      setActiveIndex(idx);
      updateActivePill(idx);
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseLeave={handleMouseLeaveContainer}
      className={cn(
        "relative flex items-center p-1.5 rounded-full",
        // Pure Liquid Glassmorphic Container
        "bg-white/50 dark:bg-zinc-950/45 backdrop-blur-2xl",
        "border border-white/80 dark:border-white/10",
        "shadow-[0_8px_32px_0_rgba(31,38,135,0.06),inset_0_1px_2px_rgba(255,255,255,0.4)] select-none",
        "transition-colors duration-300"
      )}
    >
      {/* 1. Translucent Liquid Amber Hover Spotlight */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute top-0 left-0 rounded-full z-[1]",
          "bg-amber-900/10 dark:bg-amber-100/10 backdrop-blur-xs",
          isReady
            ? "transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]"
            : "transition-none"
        )}
        style={{
          transform: `translate3d(${hoverRect.left}px, ${hoverRect.top}px, 0)`,
          width: `${hoverRect.width}px`,
          height: `${hoverRect.height}px`,
          opacity:
            hoverIndex !== null && hoverIndex !== activeIndex
              ? hoverRect.opacity
              : 0,
        }}
      />

      {/* 2. Magnetic Liquid Amber Cognac Pill (Perfume Atelier Elixir Tone) */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute top-0 left-0 rounded-full z-[2] overflow-hidden",
          // Rich Amber-Cognac Perfume Tone (Not plain black)
          "bg-gradient-to-r from-[#29170e] via-[#3f2214] to-[#29170e] text-[#fef9ee]",
          "border border-[#d97706]/35",
          "shadow-[0_4px_16px_rgba(180,83,9,0.22)]",
          isReady
            ? "transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
            : "transition-none"
        )}
        style={{
          transform: `translate3d(${activeRect.left}px, ${activeRect.top}px, 0)`,
          width: `${activeRect.width}px`,
          height: `${activeRect.height}px`,
          opacity: activeRect.opacity,
        }}
      >
        {/* Liquid Glass Highlight (subtle top meniscus reflection) */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1/2 rounded-t-full bg-gradient-to-b from-white/20 via-white/5 to-transparent pointer-events-none"
        />
      </span>

      {/* Navigation Links (Pure Text, No Icons, Normal Font Weight) */}
      {STOREFRONT_NAV_LINKS.map((link, idx) => {
        const isActive = activeIndex === idx;

        return (
          <Link
            key={link.title}
            ref={(el) => {
              tabRefs.current[idx] = el;
            }}
            href={link.href}
            onClick={() => handleTabClick(idx)}
            onMouseEnter={() => handleMouseEnterTab(idx)}
            className={cn(
              "relative z-[3] h-8 px-4 text-xs font-normal tracking-wide rounded-full",
              "inline-flex items-center justify-center leading-none",
              "transition-colors duration-200 select-none",
              isActive
                ? "text-[#fff8ea]"
                : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
            )}
          >
            <span className="relative z-10 inline-flex items-center justify-center leading-none">
              {link.title}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
