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
import { Flame } from "lucide-react";
import { STOREFRONT_NAV_LINKS } from "./navLinks";
import { cn } from "@/lib/utils";

interface RectStyle {
  left: number;
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
    width: 0,
    height: 0,
    opacity: 0,
  });

  const [hoverRect, setHoverRect] = useState<RectStyle>({
    left: 0,
    width: 0,
    height: 0,
    opacity: 0,
  });

  // Calculate position of a tab relative to the container
  const getTabRect = useCallback((index: number): RectStyle | null => {
    const container = containerRef.current;
    const tab = tabRefs.current[index];
    if (!container || !tab) return null;

    const containerRect = container.getBoundingClientRect();
    const tabRect = tab.getBoundingClientRect();

    return {
      left: tabRect.left - containerRect.left,
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
        "bg-neutral-100/90 dark:bg-neutral-900/90 backdrop-blur-xl",
        "border border-neutral-200/70 dark:border-neutral-800/70",
        "shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] select-none",
        "transition-colors duration-300"
      )}
    >
      {/* 1. Translucent Liquid Hover Spotlight (flows seamlessly between items on mouse hover) */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute top-1.5 rounded-full z-[1]",
          "bg-black/[0.06] dark:bg-white/[0.08] backdrop-blur-xs",
          isReady
            ? "transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]"
            : "transition-none"
        )}
        style={{
          transform: `translateX(${hoverRect.left}px)`,
          width: `${hoverRect.width}px`,
          height: `${hoverRect.height}px`,
          opacity:
            hoverIndex !== null && hoverIndex !== activeIndex
              ? hoverRect.opacity
              : 0,
        }}
      />

      {/* 2. Magnetic Liquid Active Indicator Pill (High-Contrast Black & White with Liquid Physics) */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute top-1.5 rounded-full z-[2] overflow-hidden",
          "bg-black text-white dark:bg-white dark:text-black",
          "shadow-[0_4px_12px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.08)]",
          "dark:shadow-[0_4px_16px_rgba(255,255,255,0.16),0_1px_2px_rgba(255,255,255,0.08)]",
          isReady
            ? "transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
            : "transition-none"
        )}
        style={{
          transform: `translateX(${activeRect.left}px)`,
          width: `${activeRect.width}px`,
          height: `${activeRect.height}px`,
          opacity: activeRect.opacity,
        }}
      >
        {/* Liquid Glass Highlight (subtle top meniscus reflection) */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1/2 rounded-t-full bg-gradient-to-b from-white/20 dark:from-black/10 to-transparent pointer-events-none"
        />
      </span>

      {/* Navigation Links */}
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
              "relative z-[3] px-4 py-1.5 text-xs font-medium rounded-full",
              "transition-colors duration-200 select-none flex items-center gap-1.5",
              isActive
                ? "text-white dark:text-black font-semibold"
                : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
            )}
          >
            <span className="relative z-10 transition-transform duration-200 active:scale-95">
              {link.title}
            </span>

            {/* Badge Indicator (e.g. Hot badge for Winter Collection) */}
            {link.badge && (
              <span
                className={cn(
                  "relative z-10 text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider flex items-center gap-0.5 transition-colors duration-200",
                  isActive
                    ? "bg-white text-black dark:bg-black dark:text-white"
                    : "bg-black text-white dark:bg-white dark:text-black"
                )}
              >
                <Flame className="size-2.5 text-orange-500 fill-orange-500" />
                {link.badge}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
