"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, CreditCard, Loader2, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import { initiatePayment } from "@/services/payment.services";

function StripeCancelContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [retrying, setRetrying] = useState(false);

  const handleRetryPayment = async () => {
    if (!orderId) return;
    setRetrying(true);
    try {
      const res = await initiatePayment({
        orderId,
        method: "STRIPE",
        transactionType: "FULL_PREPAID",
      });
      const url = res?.data?.redirectUrl || res?.data?.gatewayUrl;
      if (!url) {
        throw new Error("Could not restart Stripe checkout.");
      }
      window.location.href = url;
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error?.message || "Failed to retry payment");
      setRetrying(false);
    }
  };

  return (
    <section className="min-h-[75vh] bg-white dark:bg-neutral-950 py-20 px-4 flex items-center justify-center">
      <div className="max-w-lg w-full border border-neutral-200 dark:border-neutral-800 bg-[#f9f6ed]/40 dark:bg-neutral-900/40 p-8 sm:p-12 text-center">
        <div className="size-16 mx-auto mb-6 flex items-center justify-center bg-amber-50 dark:bg-amber-950/30 text-amber-600">
          <XCircle className="size-8 stroke-[1.5]" />
        </div>

        <p className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#9d8354] mb-2">
          Payment Cancelled
        </p>
        <h1 className="font-serif text-3xl font-normal text-neutral-950 dark:text-white mb-3">
          Card Payment Not Completed
        </h1>
        <p className="font-sans text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-8">
          No charges were made to your card. You can retry the card payment now or return to checkout to choose Cash on Delivery.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {orderId && (
            <button
              type="button"
              onClick={handleRetryPayment}
              disabled={retrying}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#09090b] text-white text-xs uppercase tracking-[0.15em] hover:bg-neutral-800 transition-colors cursor-pointer disabled:opacity-60"
            >
              {retrying ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <CreditCard className="size-3.5" />
              )}
              <span>Retry Card Payment</span>
            </button>
          )}

          <Link
            href="/checkout"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-neutral-300 dark:border-neutral-700 text-xs uppercase tracking-[0.15em] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Checkout</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function StripePaymentCancelPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="size-8 animate-spin text-[#c5a059]" />
        </div>
      }
    >
      <StripeCancelContent />
    </Suspense>
  );
}
// Stripe cancel redirect note 3
// Stripe cancel redirect note 6
