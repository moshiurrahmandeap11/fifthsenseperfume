import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";

interface ReviewItem {
  id: string;
  name: string;
  avatar: string;
  quote: string;
}

const CLIENT_REVIEWS: ReviewItem[] = [
  {
    id: "review-1",
    name: "Tanvisha Gupta",
    avatar: "https://res.cloudinary.com/rhjebh23/image/upload/v1795431924/ecombd/site-assets/tanvisha.webp",
    quote:
      "I've tried a lot of fragrances, but this one genuinely stands out. It's subtle, long-lasting, and I keep getting compliments without it ever feeling overpowering.",
  },
  {
    id: "review-2",
    name: "Tanya Banerjee",
    avatar: "/reviews/tanya.png",
    quote:
      "The scent feels incredibly well-balanced; fresh at first, then it settles into something warm and memorable. It's become part of my everyday routine.",
  },
];

export default function ClientReviewsSection() {
  return (
    <section className="w-full py-14 sm:py-18 lg:py-24 bg-white dark:bg-zinc-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Centered Editorial Section Header matching screenshot */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 lg:mb-16 select-none">
          <p
            className="font-script text-2xl sm:text-3xl lg:text-[34px] leading-normal mb-1 select-none"
            style={{
              color: "#c6b189",
              fontFamily: 'var(--font-script), "BrittanySignature", cursive',
            }}
          >
            Our Client Reviews
          </p>
          <h2 className="font-heading font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[40px] uppercase tracking-normal text-[#181818] dark:text-neutral-100 font-normal leading-tight">
            WHAT CLIENT SAYS ABOUT US
          </h2>
        </div>

        {/* 2-Column Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 max-w-6xl mx-auto">
          {CLIENT_REVIEWS.map((review) => (
            <div
              key={review.id}
              className="flex flex-col justify-between bg-[#f9f6ed] dark:bg-neutral-900/90 p-7 sm:p-9 md:p-10 lg:p-12 rounded-none border-none shadow-none"
            >
              <div>
                {/* 5-Star Rating */}
                <div className="flex items-center gap-1.5 mb-5 sm:mb-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="size-4 fill-[#ffa16a] text-[#ffa16a] stroke-none"
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="font-sans text-sm sm:text-[14.5px] lg:text-[15px] text-[#4a4a4a] dark:text-neutral-300 font-normal leading-[1.75] mb-8 sm:mb-10">
                  {review.quote}
                </p>
              </div>

              {/* Reviewer Profile */}
              <div className="flex items-center gap-3.5 pt-2">
                <div className="relative size-10 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-800 shrink-0">
                  <Image
                    src={review.avatar}
                    alt={review.name}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <span className="font-sans text-sm sm:text-[15px] font-medium text-[#181818] dark:text-neutral-100">
                  {review.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
