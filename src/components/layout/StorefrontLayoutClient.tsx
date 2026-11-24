"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useCart } from "@/providers/CartProvider";

interface StorefrontLayoutClientProps {
  children: React.ReactNode;
}

export default function StorefrontLayoutClient({
  children,
}: StorefrontLayoutClientProps) {
  const { isDrawerOpen } = useCart();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    mq.addEventListener("change", handleMediaChange);
    return () => mq.removeEventListener("change", handleMediaChange);
  }, []);

  return (
    <motion.div
      animate={{
        marginRight: isDrawerOpen && !isMobile ? 440 : 0,
      }}
      transition={{
        duration: 0.38,
        ease: [0.22, 1, 0.36, 1],
        delay: isDrawerOpen ? 0 : 0.02,
      }}
      className="flex min-h-screen flex-col w-full relative"
    >
      {children}
    </motion.div>
  );
}
