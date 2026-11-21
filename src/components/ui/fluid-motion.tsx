"use client";

import { AnimatePresence, motion, HTMLMotionProps } from "motion/react";
import React from "react";

export { AnimatePresence, motion };

export interface FluidPageProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
}

export function FluidPage({ children, className, ...props }: FluidPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export interface FluidTabContentProps extends HTMLMotionProps<"div"> {
  tabKey: string;
  children: React.ReactNode;
}

export function FluidTabContent({
  tabKey,
  children,
  className,
  ...props
}: FluidTabContentProps) {
  return (
    <motion.div
      key={tabKey}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
