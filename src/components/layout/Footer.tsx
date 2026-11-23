"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, Mail } from "lucide-react";
import CurrentYear from "@/components/common/CurrentYear";
import { useBrand } from "@/providers/BrandProvider";

export default function Footer() {
  const brand = useBrand();

  return (
    <footer className="w-full bg-[#070504] border-t border-[#444240] text-white select-none">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-16 sm:pt-20 lg:pt-24 pb-8 sm:pb-10">
        {/* 1. Top Centered Brand Block (Logo + Golden Accent Divider) */}
        <div className="flex flex-col items-center justify-center text-center mb-12 sm:mb-16">
          <Link
            href="/"
            className="inline-block transition-opacity duration-200 hover:opacity-85"
            title={brand.brandName}
          >
            <Image
              src={brand.logoUrl}
              alt={brand.brandName}
              width={200}
              height={60}
              className="h-10 sm:h-11 md:h-12 w-auto object-contain brightness-0 invert"
              priority={false}
            />
          </Link>

          {/* Golden Ambient Divider Line */}
          <div className="w-28 sm:w-36 h-[2px] bg-gradient-to-r from-transparent via-[#cfb98f] to-transparent mt-4 sm:mt-5 opacity-90" />
        </div>

        {/* 2. 4-Column Navigation & Contact Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 lg:gap-14 max-w-6xl mx-auto mb-14 sm:mb-16">
          {/* Column 1: Quick Link */}
          <div>
            <h3 className="font-heading font-serif text-lg sm:text-xl text-white font-normal mb-4 sm:mb-5 tracking-wide">
              Quick Link
            </h3>
            <ul className="space-y-2.5 sm:space-y-3 font-sans text-xs sm:text-[13px] text-neutral-400">
              <li>
                <Link
                  href="/our-story"
                  className="hover:text-white transition-colors"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  href="/how-to-buy"
                  className="hover:text-white transition-colors"
                >
                  How to Buy
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="hover:text-white transition-colors"
                >
                  Shipping
                </Link>
              </li>
              <li>
                <Link
                  href="/payment"
                  className="hover:text-white transition-colors"
                >
                  Payment
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Collection */}
          <div>
            <h3 className="font-heading font-serif text-lg sm:text-xl text-white font-normal mb-4 sm:mb-5 tracking-wide">
              Collection
            </h3>
            <ul className="space-y-2.5 sm:space-y-3 font-sans text-xs sm:text-[13px] text-neutral-400">
              <li>
                <Link
                  href="/products?category=attars"
                  className="hover:text-white transition-colors"
                >
                  Attars
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=perfumes"
                  className="hover:text-white transition-colors"
                >
                  Perfumes
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=oils"
                  className="hover:text-white transition-colors"
                >
                  Essential Oils
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h3 className="font-heading font-serif text-lg sm:text-xl text-white font-normal mb-4 sm:mb-5 tracking-wide">
              Support
            </h3>
            <ul className="space-y-2.5 sm:space-y-3 font-sans text-xs sm:text-[13px] text-neutral-400">
              <li>
                <Link
                  href="/faq"
                  className="hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/customer-service"
                  className="hover:text-white transition-colors"
                >
                  Customer Service
                </Link>
              </li>
              <li>
                <Link
                  href="/complaints"
                  className="hover:text-white transition-colors"
                >
                  Complaints
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-white transition-colors"
                >
                  Security and Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact With Us */}
          <div>
            <h3 className="font-heading font-serif text-lg sm:text-xl text-white font-normal mb-4 sm:mb-5 tracking-wide">
              Contact With Us
            </h3>
            <ul className="space-y-3 sm:space-y-3.5 font-sans text-xs sm:text-[13px] text-neutral-400">
              <li className="flex items-center gap-2.5">
                <Phone className="size-3.5 sm:size-4 text-[#cfb98f] shrink-0" />
                <a
                  href="tel:+88012345678"
                  className="hover:text-white transition-colors"
                >
                  (00) 1234-5678
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="size-3.5 sm:size-4 text-[#cfb98f] shrink-0" />
                <a
                  href="mailto:info@fifthsenseperfumes.com"
                  className="hover:text-white transition-colors break-all"
                >
                  info@fifthsenseperfumes.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 3. Bottom Copyright Bar */}
        <div className="pt-6 sm:pt-8 border-t border-[#333130] text-center font-sans text-xs text-neutral-500">
          <p>
            &copy; Copyright <CurrentYear /> Fifth Sense Perfumes. All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
