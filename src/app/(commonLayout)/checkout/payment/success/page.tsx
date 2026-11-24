"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, ShieldAlert, ArrowRight } from "lucide-react";
import { verifyStripeSession } from "@/services/payment.services";
import { useCart } from "@/providers/CartProvider";

interface VerifiedPaymentData {
  orderId: string;
  orderNumber: string;
  trxId: string;
  amount: number;
  codRemaining: number;
}

function StripeSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCart();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [data, setData] = useState<VerifiedPaymentData | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      setErrorMsg("Missing Stripe checkout session reference.");
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await verifyStripeSession(sessionId);
        if (cancelled) return;
        if (res?.data) {
          setData(res.data);
          setStatus("success");
          clearCart();
          try {
            window.localStorage.removeItem("fifthsense_checkout_draft_v1");
          } catch {
            // ignore storage errors
          }
        } else {
          setStatus("error");
          setErrorMsg("Could not verify your card payment.");
        }
      } catch (err: unknown) {
        if (cancelled) return;
        const error = err as { message?: string };
        setStatus("error");
        setErrorMsg(error?.message || "Payment verification failed.");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionId, clearCart]);

  if (status === "loading") {
    return (
      <section className="min-h-[75vh] bg-white dark:bg-neutral-950 py-20 px-4 flex items-center justify-center">
        <div className="max-w-md w-full border border-neutral-200 dark:border-neutral-800 bg-[#f9f6ed]/40 dark:bg-neutral-900/40 p-10 text-center">
          <Loader2 className="size-10 mx-auto mb-5 animate-spin text-[#c5a059]" />
          <p className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#9d8354] mb-2">
            Verifying Payment
          </p>
          <h1 className="font-serif text-2xl text-neutral-950 dark:text-white mb-2">
            Confirming Your Card Payment
          </h1>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            Please wait a moment while we finalize your order with Stripe.
          </p>
        </div>
      </section>
    );
  }

  if (status === "error") {
    return (
      <section className="min-h-[75vh] bg-white dark:bg-neutral-950 py-20 px-4 flex items-center justify-center">
        <div className="max-w-md w-full border border-neutral-200 dark:border-neutral-800 bg-[#f9f6ed]/40 dark:bg-neutral-900/40 p-10 text-center">
          <div className="size-14 mx-auto mb-5 flex items-center justify-center bg-red-50 dark:bg-red-950/40 text-red-600">
            <ShieldAlert className="size-7 stroke-[1.5]" />
          </div>
          <h1 className="font-serif text-2xl text-neutral-950 dark:text-white mb-2">
            Verification Issue
          </h1>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-6">
            {errorMsg}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/customer/orders"
              className="px-5 py-2.5 bg-[#09090b] text-white text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors"
            >
              View My Orders
            </Link>
            <Link
              href="/checkout"
              className="px-5 py-2.5 border border-neutral-300 dark:border-neutral-700 text-xs uppercase tracking-wider hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Back to Checkout
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[75vh] bg-white dark:bg-neutral-950 py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto border border-neutral-200 dark:border-neutral-800 bg-[#f9f6ed]/40 dark:bg-neutral-900/40 p-7 sm:p-12 text-center">
        <div className="size-16 mx-auto mb-6 flex items-center justify-center bg-[#09090b] text-[#c5a059]">
          <CheckCircle2 className="size-8 stroke-[1.5]" />
        </div>

        <p className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#9d8354] mb-2">
          Payment Successful
        </p>
        <h1 className="font-heading font-serif text-3xl sm:text-4xl font-normal text-neutral-950 dark:text-white mb-3">
          Thank You for Your Order
        </h1>
        <p className="font-sans text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto leading-relaxed mb-8">
          Your card payment has been confirmed via Stripe and your artisanal fragrance parcel is now being prepared.
        </p>

        {data && (
          <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-5 mb-8 text-left space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-neutral-500">Order Number</span>
              <span className="font-mono font-medium text-neutral-900 dark:text-white">
                {data.orderNumber}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Paid Amount</span>
              <span className="font-medium text-emerald-600">
                ৳{Number(data.amount).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Stripe Reference</span>
              <span className="font-mono text-[11px] text-neutral-700 dark:text-neutral-300 truncate max-w-[220px]">
                {data.trxId}
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/customer/orders"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#09090b] text-white text-xs uppercase tracking-[0.15em] hover:bg-neutral-800 transition-colors"
          >
            <span>Track My Order</span>
            <ArrowRight className="size-3.5" />
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-6 py-3 border border-neutral-300 dark:border-neutral-700 text-xs uppercase tracking-[0.15em] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function StripePaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="size-8 animate-spin text-[#c5a059]" />
        </div>
      }
    >
      <StripeSuccessContent />
    </Suspense>
  );
}
// Stripe success redirect note 2
// Stripe success redirect note 5
// Stripe success redirect note 8
