import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  scriptSubtitle?: string;
  title: string;
  description?: string;
  className?: string;
  scriptClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export default function SectionHeader({
  scriptSubtitle,
  title,
  description,
  className,
  scriptClassName,
  titleClassName,
  descriptionClassName,
}: SectionHeaderProps) {
  return (
    <div className={cn("text-center max-w-2xl mx-auto select-none", className)}>
      {/* 1. Script Accent Subtitle (Brittany Signature) - Controlled Delicate Size */}
      {scriptSubtitle && (
        <p
          className={cn(
            "font-script text-xl sm:text-2xl lg:text-[30px] leading-normal mb-0.5 sm:mb-1 select-none",
            scriptClassName
          )}
          style={{
            color: "#b0987e",
            fontFamily: 'var(--font-script), "BrittanySignature", cursive',
          }}
        >
          {scriptSubtitle}
        </p>
      )}

      {/* 2. Main Serif Heading (Cormorant Garamond) */}
      <h2
        className={cn(
          "font-heading font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[38px] uppercase tracking-normal text-neutral-950 dark:text-white font-normal leading-tight mb-2 sm:mb-2.5",
          titleClassName
        )}
      >
        {title}
      </h2>

      {/* 3. Description Subtitle (Inter) */}
      {description && (
        <p
          className={cn(
            "font-sans text-xs sm:text-[13px] md:text-sm text-neutral-500 dark:text-neutral-400 font-normal tracking-normal",
            descriptionClassName
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
