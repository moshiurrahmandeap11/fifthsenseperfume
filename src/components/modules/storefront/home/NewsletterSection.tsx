"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address.", {
        style: {
          background: "#09090b",
          color: "#ffffff",
          border: "1px solid #27272a",
        },
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setEmail("");
      toast.success("Thank you for subscribing to Fifth Sense newsletter!", {
        icon: "✉️",
        style: {
          background: "#09090b",
          color: "#ffffff",
          border: "1px solid #27272a",
        },
      });
    }, 400);
  };

  return (
    <section className="w-full py-16 sm:py-20 lg:py-24 bg-[#070504] select-none">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
        {/* Script Accent Subtitle (BrittanySignature) */}
        <p
          className="font-script text-2xl sm:text-3xl lg:text-[36px] leading-tight mb-2 sm:mb-2.5 select-none"
          style={{
            color: "#c6b189",
            fontFamily: 'var(--font-script), "BrittanySignature", cursive',
          }}
        >
          Newsletter
        </p>

        {/* Main Serif Heading (Cormorant Garamond) */}
        <h2 className="font-heading font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[42px] xl:text-[46px] uppercase tracking-normal text-white font-normal leading-[1.15] mb-7 sm:mb-9">
          SUBSCRIBE TO OUR
          <br />
          NEWSLETTER
        </h2>

        {/* Subscribe Form: Dark Warm Input + Champagne Gold Button */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-2.5 max-w-lg mx-auto w-full"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            className="w-full sm:w-[320px] md:w-[340px] h-11 sm:h-12 px-4 sm:px-5 bg-[#1b1712] text-white placeholder:text-neutral-500 font-sans text-xs sm:text-[13px] rounded-none border border-transparent focus:outline-none focus:border-[#c6b189] transition-colors"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto h-11 sm:h-12 px-7 sm:px-9 bg-[#cfb98f] hover:bg-[#bfa77a] active:bg-[#b0986b] text-white font-sans text-xs sm:text-[13px] font-medium tracking-normal uppercase transition-colors rounded-none border-none cursor-pointer shrink-0 disabled:opacity-70"
          >
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      </div>
    </section>
  );
}
