"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Loader2,
  MapPin,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Tag,
  Truck,
  User,
} from "lucide-react";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "@/providers/CartProvider";
import { useBrand } from "@/providers/BrandProvider";
import { formatFragrancePrice } from "../cart/cartUtils";
import { checkoutOrder, incompleteCapture } from "@/services/order.services";
import {
  getBangladeshLocations,
  getShippingQuote,
} from "@/services/system.services";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IUser } from "@/types/auth.types";
import { IOrder, PaymentMethod } from "@/types/order.types";
import { DeliveryZone } from "@/types/user.types";
import { cn } from "@/lib/utils";

interface CheckoutClientProps {
  initialUser: IUser | null;
}

const CHECKOUT_DRAFT_STORAGE_KEY = "fifthsense_checkout_draft_v1";

interface CheckoutDraft {
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  division?: string;
  district?: string;
  thana?: string;
  shippingAddress?: string;
  customerNote?: string;
  paymentMethod?: PaymentMethod;
  couponInput?: string;
}

const PAYMENT_OPTIONS: Array<{
  value: PaymentMethod;
  label: string;
  subtitle: string;
}> = [
  {
    value: "COD",
    label: "Cash on Delivery",
    subtitle: "Pay in cash upon receiving your fragrance parcel",
  },
  {
    value: "BKASH",
    label: "bKash",
    subtitle: "Instant mobile wallet payment",
  },
  {
    value: "NAGAD",
    label: "Nagad",
    subtitle: "Fast digital wallet checkout",
  },
  {
    value: "ROCKET",
    label: "Rocket",
    subtitle: "DBBL Rocket mobile banking",
  },
  {
    value: "SSLCOMMERZ",
    label: "Card / Online Banking",
    subtitle: "Visa, Mastercard, AMEX & Net Banking",
  },
  {
    value: "AAMARPAY",
    label: "aamarPay",
    subtitle: "Cards, Mobile Wallets & Net Banking",
  },
];

export default function CheckoutClient({ initialUser }: CheckoutClientProps) {
  const brand = useBrand();
  const {
    items,
    subtotal,
    discountAmount,
    activeCoupon,
    applyCoupon,
    removeCoupon,
    clearCart,
  } = useCart();

  const freeShippingThreshold = brand.freeShippingThreshold || 5000;

  const [customerName, setCustomerName] = useState(initialUser?.name || "");
  const [customerPhone, setCustomerPhone] = useState(initialUser?.phoneNumber || "");
  const [customerEmail, setCustomerEmail] = useState(initialUser?.email || "");
  const [division, setDivision] = useState("Dhaka");
  const [district, setDistrict] = useState("Dhaka");
  const [thana, setThana] = useState("");

  const { data: divisionsRes, isLoading: isDivisionsLoading } = useQuery({
    queryKey: ["bd-locations", "divisions"],
    queryFn: () => getBangladeshLocations(),
    staleTime: Infinity,
  });

  const { data: districtsRes, isLoading: isDistrictsLoading } = useQuery({
    queryKey: ["bd-locations", "districts", division],
    queryFn: () => getBangladeshLocations({ division }),
    enabled: Boolean(division),
    staleTime: Infinity,
  });

  const { data: thanasRes, isLoading: isThanasLoading } = useQuery({
    queryKey: ["bd-locations", "thanas", district],
    queryFn: () => getBangladeshLocations({ district }),
    enabled: Boolean(district),
    staleTime: Infinity,
  });

  const divisions = divisionsRes?.data?.divisions ?? [];
  const districts = districtsRes?.data?.districts ?? [];
  const thanas = thanasRes?.data?.thanas ?? [];

  const handleDivisionChange = (nextDivision: string) => {
    setDivision(nextDivision);
    setDistrict("");
    setThana("");
  };

  const handleDistrictChange = (nextDistrict: string) => {
    setDistrict(nextDistrict);
    setThana("");
  };
  const [shippingAddress, setShippingAddress] = useState(initialUser?.address || "");
  const [customerNote, setCustomerNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");

  const availablePaymentOptions = useMemo(() => {
    const enabled = brand.enabledPaymentMethods || [
      "COD",
      "BKASH",
      "NAGAD",
      "SSLCOMMERZ",
    ];
    const filtered = PAYMENT_OPTIONS.filter((opt) =>
      enabled.includes(opt.value)
    );
    return filtered.length > 0 ? filtered : [PAYMENT_OPTIONS[0]];
  }, [brand.enabledPaymentMethods]);

  useEffect(() => {
    if (!availablePaymentOptions.some((opt) => opt.value === paymentMethod)) {
      setPaymentMethod(availablePaymentOptions[0].value);
    }
  }, [availablePaymentOptions, paymentMethod]);

  const [couponInput, setCouponInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<IOrder | null>(null);

  const lastCapturedPhoneRef = useRef<string>("");
  const hasHydratedDraftRef = useRef(false);
  const sessionKeyRef = useRef<string>(
    `chk_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  );

  // Restore saved checkout draft from localStorage on mount (before user fallback)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CHECKOUT_DRAFT_STORAGE_KEY);
      if (raw) {
        const draft = JSON.parse(raw) as CheckoutDraft;
        if (typeof draft.customerName === "string") setCustomerName(draft.customerName);
        if (typeof draft.customerPhone === "string") setCustomerPhone(draft.customerPhone);
        if (typeof draft.customerEmail === "string") setCustomerEmail(draft.customerEmail);
        if (typeof draft.division === "string") setDivision(draft.division);
        if (typeof draft.district === "string") setDistrict(draft.district);
        if (typeof draft.thana === "string") setThana(draft.thana);
        if (typeof draft.shippingAddress === "string") setShippingAddress(draft.shippingAddress);
        if (typeof draft.customerNote === "string") setCustomerNote(draft.customerNote);
        if (draft.paymentMethod) setPaymentMethod(draft.paymentMethod);
        if (typeof draft.couponInput === "string") setCouponInput(draft.couponInput);
      }
    } catch {
      // ignore storage read errors
    } finally {
      hasHydratedDraftRef.current = true;
    }
  }, []);

  // Persist checkout form inputs across page refreshes
  useEffect(() => {
    if (!hasHydratedDraftRef.current || completedOrder) return;
    try {
      const draft: CheckoutDraft = {
        customerName,
        customerPhone,
        customerEmail,
        division,
        district,
        thana,
        shippingAddress,
        customerNote,
        paymentMethod,
        couponInput,
      };
      window.localStorage.setItem(
        CHECKOUT_DRAFT_STORAGE_KEY,
        JSON.stringify(draft)
      );
    } catch {
      // ignore storage write errors
    }
  }, [
    customerName,
    customerPhone,
    customerEmail,
    division,
    district,
    thana,
    shippingAddress,
    customerNote,
    paymentMethod,
    couponInput,
    completedOrder,
  ]);

  // Sync user details if initialUser arrives and fields are still empty
  useEffect(() => {
    if (!initialUser) return;
    setCustomerName((prev) => prev || initialUser.name || "");
    setCustomerPhone((prev) => prev || initialUser.phoneNumber || "");
    setCustomerEmail((prev) => prev || initialUser.email || "");
    setShippingAddress((prev) => prev || initialUser.address || "");
  }, [initialUser]);

  const { data: shippingQuoteRes, isFetching: isQuoteFetching } = useQuery({
    queryKey: ["shipping-quote", division, district, thana, subtotal],
    queryFn: () =>
      getShippingQuote({
        division,
        district,
        thana,
        subtotal,
      }),
    enabled: Boolean(division && district),
  });

  const shippingQuote = shippingQuoteRes?.data;
  const deliveryZone: DeliveryZone =
    shippingQuote?.deliveryZone || "INSIDE_DHAKA";
  const selectedZoneCharge = shippingQuote ? shippingQuote.charge : brand.insideDhakaShipping;
  const effectiveFreeThreshold =
    shippingQuote?.freeShippingThreshold ?? freeShippingThreshold;

  const netSubtotal = Math.max(0, subtotal - discountAmount);
  const grandTotal = netSubtotal + selectedZoneCharge;

  // Silent Abandoned Cart Capture when phone number reaches >= 10 digits
  useEffect(() => {
    const cleanPhone = customerPhone.replace(/\s+/g, "");
    if (
      cleanPhone.length < 10 ||
      items.length === 0 ||
      completedOrder ||
      lastCapturedPhoneRef.current === cleanPhone
    ) {
      return;
    }

    const timer = setTimeout(() => {
      lastCapturedPhoneRef.current = cleanPhone;
      incompleteCapture({
        sessionKey: sessionKeyRef.current,
        customerName: customerName.trim() || undefined,
        customerPhone: cleanPhone,
        customerEmail: customerEmail.trim() || undefined,
        shippingAddress: shippingAddress.trim() || undefined,
        division: division || undefined,
        district: district.trim() || undefined,
        thana: thana.trim() || undefined,
        itemsJson: items.map((i) => ({
          variantId: i.variantId,
          productName: i.productName,
          size: i.size,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
        })),
        totalAmount: grandTotal,
        source: "WEBSITE",
      }).catch(() => {
        // Silently ignore background capture errors
      });
    }, 1200);

    return () => clearTimeout(timer);
  }, [
    customerPhone,
    customerName,
    customerEmail,
    shippingAddress,
    division,
    district,
    thana,
    items,
    grandTotal,
    completedOrder,
  ]);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const res = applyCoupon(couponInput);
    if (res.ok) {
      toast.success(res.message);
      setCouponInput("");
    } else {
      toast.error(res.message);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error("Your fragrance bag is empty.");
      return;
    }

    const cleanName = customerName.trim();
    const cleanPhone = customerPhone.replace(/\s+/g, "");
    const cleanAddress = shippingAddress.trim();
    const cleanDistrict = district.trim();
    const cleanThana = thana.trim();

    if (cleanName.length < 2) {
      toast.error("Please enter your full name (at least 2 characters).");
      return;
    }
    if (cleanPhone.length < 10) {
      toast.error("Please enter a valid 10+ digit phone number.");
      return;
    }
    if (division.trim().length < 2) {
      toast.error("Please select a delivery division.");
      return;
    }
    if (cleanDistrict.length < 2) {
      toast.error("Please enter your district.");
      return;
    }
    if (cleanThana.length < 2) {
      toast.error("Please enter your thana / area.");
      return;
    }
    if (cleanAddress.length < 5) {
      toast.error("Please enter your full delivery address.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await checkoutOrder({
        customerName: cleanName,
        customerPhone: cleanPhone,
        customerEmail: customerEmail.trim() || undefined,
        shippingAddress: cleanAddress,
        division: division.trim(),
        district: cleanDistrict,
        thana: cleanThana,
        deliveryZone,
        paymentMethod,
        source: "WEBSITE",
        couponCode: activeCoupon?.code || undefined,
        customerNote: customerNote.trim() || undefined,
        items: items.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
        })),
      });

      if (response?.data) {
        setCompletedOrder(response.data);
        clearCart();
        try {
          window.localStorage.removeItem(CHECKOUT_DRAFT_STORAGE_KEY);
        } catch {
          // ignore storage errors
        }
        toast.success("Order confirmed! Thank you for choosing Fifth Sense.");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error?.message || "Could not place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1. Order Confirmation / Thank You Screen
  if (completedOrder) {
    return (
      <section className="min-h-[75vh] bg-white dark:bg-neutral-950 py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto border border-neutral-200 dark:border-neutral-800 bg-[#f9f6ed]/40 dark:bg-neutral-900/40 p-7 sm:p-12 text-center">
          <div className="size-16 mx-auto mb-6 flex items-center justify-center bg-[#09090b] text-[#c5a059]">
            <CheckCircle2 className="size-8 stroke-[1.5]" />
          </div>

          <p className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#9d8354] mb-2">
            Order Confirmed
          </p>
          <h1 className="font-heading font-serif text-3xl sm:text-4xl font-normal text-neutral-950 dark:text-white mb-3">
            Thank You, {completedOrder.customerName}
          </h1>
          <p className="font-sans text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto leading-relaxed mb-8">
            Your artisanal fragrance parcel is being carefully prepared. You can track your order anytime using your order number and phone.
          </p>

          <div className="border-y border-neutral-200 dark:border-neutral-800 py-5 my-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left font-sans text-xs">
            <div>
              <span className="block text-[10px] uppercase text-neutral-400 mb-1">
                Order Number
              </span>
              <span className="font-mono font-medium text-neutral-950 dark:text-white">
                {completedOrder.orderNumber}
              </span>
            </div>
            <div>
              <span className="block text-[10px] uppercase text-neutral-400 mb-1">
                Phone
              </span>
              <span className="text-neutral-900 dark:text-neutral-100">
                {completedOrder.customerPhone}
              </span>
            </div>
            <div>
              <span className="block text-[10px] uppercase text-neutral-400 mb-1">
                Payment
              </span>
              <span className="text-neutral-900 dark:text-neutral-100">
                {completedOrder.paymentMethod}
              </span>
            </div>
            <div>
              <span className="block text-[10px] uppercase text-neutral-400 mb-1">
                Total Payable
              </span>
              <span className="font-medium text-neutral-950 dark:text-white">
                ৳{formatFragrancePrice(completedOrder.totalAmount)}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            <Link
              href="/products"
              className="w-full sm:w-auto px-7 py-3 bg-[#232323] hover:bg-black text-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 text-xs font-sans font-medium uppercase tracking-normal transition-colors flex items-center justify-center gap-2"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="size-3.5" />
            </Link>
            {initialUser ? (
              <Link
                href="/customer/dashboard"
                className="w-full sm:w-auto px-7 py-3 border border-neutral-900 dark:border-neutral-300 text-neutral-950 dark:text-neutral-100 hover:bg-neutral-950 hover:text-white dark:hover:bg-white dark:hover:text-black text-xs font-sans font-medium uppercase tracking-normal transition-colors text-center"
              >
                View My Orders
              </Link>
            ) : (
              <Link
                href="/contact"
                className="w-full sm:w-auto px-7 py-3 border border-neutral-900 dark:border-neutral-300 text-neutral-950 dark:text-neutral-100 hover:bg-neutral-950 hover:text-white dark:hover:bg-white dark:hover:text-black text-xs font-sans font-medium uppercase tracking-normal transition-colors text-center"
              >
                Need Help?
              </Link>
            )}
          </div>
        </div>
      </section>
    );
  }

  // 2. Empty Cart Guard
  if (items.length === 0) {
    return (
      <section className="min-h-[65vh] bg-white dark:bg-neutral-950 flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="size-16 flex items-center justify-center bg-[#f9f6ed] dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 mb-5">
          <ShoppingBag className="size-7 stroke-[1.25] text-[#c6b189]" />
        </div>
        <h1 className="font-heading font-serif text-3xl font-normal text-neutral-950 dark:text-white mb-2">
          Your Bag is Empty
        </h1>
        <p className="font-sans text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mb-7">
          Add your signature fragrances to your bag before proceeding to checkout.
        </p>
        <Link
          href="/products"
          className="px-7 py-3 bg-[#232323] hover:bg-black text-white dark:bg-white dark:text-black text-xs font-sans font-medium uppercase tracking-normal transition-colors flex items-center gap-2"
        >
          <span>Explore Fragrances</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </section>
    );
  }

  // 3. 1-Page Luxury Checkout Form
  return (
    <section className="bg-white dark:bg-neutral-950 py-8 sm:py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Top Breadcrumb / Back Link */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
          <div>
            <Link
              href="/cart"
              className="inline-flex items-center gap-1.5 text-xs font-sans text-neutral-500 hover:text-neutral-950 dark:hover:text-white transition-colors mb-2"
            >
              <ArrowLeft className="size-3.5" />
              <span>Return to Bag</span>
            </Link>
            <h1 className="font-heading font-serif text-3xl sm:text-4xl font-normal text-neutral-950 dark:text-white uppercase tracking-normal">
              Express Checkout
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs font-sans text-neutral-500 dark:text-neutral-400">
            <ShieldCheck className="size-4 text-[#c5a059]" />
            <span>
              {initialUser
                ? `Signed in as ${initialUser.name}`
                : "Guest Checkout Enabled — No Login Required"}
            </span>
          </div>
        </div>

        <form
          onSubmit={handlePlaceOrder}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
        >
          {/* LEFT COLUMN: Shipping & Payment */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Contact Information */}
            <div className="border border-neutral-200 dark:border-neutral-800 p-5 sm:p-7 space-y-5">
              <div className="flex items-center gap-2.5 border-b border-neutral-100 dark:border-neutral-900 pb-3.5">
                <User className="size-4 text-[#c5a059]" />
                <h2 className="font-heading font-serif text-xl font-normal text-neutral-950 dark:text-white uppercase tracking-normal">
                  1. Contact Information
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Tanvir Ahmed"
                    className="w-full h-11 px-3.5 text-xs font-sans bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-950 dark:text-neutral-100 focus:outline-none focus:border-black dark:focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400" />
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full h-11 pl-9 pr-3.5 text-xs font-sans bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-950 dark:text-neutral-100 focus:outline-none focus:border-black dark:focus:border-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-sans text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Email Address{" "}
                  <span className="text-neutral-400">(Optional — for digital receipt)</span>
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full h-11 px-3.5 text-xs font-sans bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-950 dark:text-neutral-100 focus:outline-none focus:border-black dark:focus:border-white"
                />
              </div>
            </div>

            {/* Step 2: Delivery Address & Auto-Calculated Zone */}
            <div className="border border-neutral-200 dark:border-neutral-800 p-5 sm:p-7 space-y-5">
              <div className="flex items-center gap-2.5 border-b border-neutral-100 dark:border-neutral-900 pb-3.5">
                <MapPin className="size-4 text-[#c5a059]" />
                <h2 className="font-heading font-serif text-xl font-normal text-neutral-950 dark:text-white uppercase tracking-normal">
                  2. Shipping Destination
                </h2>
              </div>

              {/* Cascading Location Selectors (Division -> District -> Thana) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-sans text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Division <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={division}
                    onValueChange={(val) => val && handleDivisionChange(val)}
                    disabled={isDivisionsLoading}
                  >
                    <SelectTrigger className="w-full h-11 rounded-none border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-xs font-sans">
                      <SelectValue
                        placeholder={
                          isDivisionsLoading ? "Loading divisions..." : "Select division"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="max-h-64">
                      {divisions.map((div) => (
                        <SelectItem key={div} value={div}>
                          {div}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-xs font-sans text-neutral-700 dark:text-neutral-300 mb-1.5">
                    District <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={district}
                    onValueChange={(val) => val && handleDistrictChange(val)}
                    disabled={!division || isDistrictsLoading || districts.length === 0}
                  >
                    <SelectTrigger className="w-full h-11 rounded-none border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-xs font-sans">
                      <SelectValue
                        placeholder={
                          isDistrictsLoading
                            ? "Loading districts..."
                            : division
                              ? "Select district"
                              : "Select division first"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="max-h-64">
                      {districts.map((dist) => (
                        <SelectItem key={dist} value={dist}>
                          {dist}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-xs font-sans text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Thana / Area <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={thana}
                    onValueChange={(val) => setThana(val || "")}
                    disabled={!district || isThanasLoading || thanas.length === 0}
                  >
                    <SelectTrigger className="w-full h-11 rounded-none border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-xs font-sans">
                      <SelectValue
                        placeholder={
                          isThanasLoading
                            ? "Loading areas..."
                            : district
                              ? "Select thana / area"
                              : "Select district first"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="max-h-64">
                      {thanas.map((area) => (
                        <SelectItem key={area} value={area}>
                          {area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Read-Only Auto-Detected Delivery Zone & Charge (Server-Authoritative) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-sans text-neutral-700 dark:text-neutral-300">
                    Assigned Delivery Zone &amp; Charge
                  </label>
                  <span className="text-[10px] font-sans uppercase tracking-wider text-[#9d8354]">
                    Auto-calculated by address
                  </span>
                </div>
                <div className="w-full p-3.5 border border-black/80 dark:border-white/80 bg-[#f9f6ed]/70 dark:bg-neutral-900 flex items-center justify-between select-none">
                  <div>
                    <p className="text-xs font-sans font-medium text-neutral-950 dark:text-white flex items-center gap-2">
                      <Truck className="size-3.5 text-[#c5a059]" />
                      <span>
                        {shippingQuote?.label ||
                          (district
                            ? "Calculating delivery zone..."
                            : "Select your division & district above")}
                      </span>
                    </p>
                    <p className="text-[11px] font-sans text-neutral-500 mt-0.5">
                      Estimated delivery: {shippingQuote?.eta || "24 – 48 Hours"}
                    </p>
                  </div>
                  <span className="text-xs font-sans font-medium text-neutral-950 dark:text-white">
                    {isQuoteFetching ? (
                      <Loader2 className="size-3.5 animate-spin text-neutral-500" />
                    ) : selectedZoneCharge === 0 ? (
                      "Free"
                    ) : (
                      `৳${formatFragrancePrice(selectedZoneCharge)}`
                    )}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-sans text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Full Delivery Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="House #, Road #, Block / Sector, Apartment..."
                  className="w-full p-3.5 text-xs font-sans bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-950 dark:text-neutral-100 focus:outline-none focus:border-black dark:focus:border-white resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-sans text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Order Note / Gift Message{" "}
                  <span className="text-neutral-400">(Optional)</span>
                </label>
                <input
                  type="text"
                  maxLength={300}
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  placeholder="Special delivery instructions or gift note..."
                  className="w-full h-11 px-3.5 text-xs font-sans bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-950 dark:text-neutral-100 focus:outline-none focus:border-black dark:focus:border-white"
                />
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="border border-neutral-200 dark:border-neutral-800 p-5 sm:p-7 space-y-4">
              <div className="flex items-center gap-2.5 border-b border-neutral-100 dark:border-neutral-900 pb-3.5">
                <CreditCard className="size-4 text-[#c5a059]" />
                <h2 className="font-heading font-serif text-xl font-normal text-neutral-950 dark:text-white uppercase tracking-normal">
                  3. Payment Method
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {availablePaymentOptions.map((opt) => {
                  const isSelected = paymentMethod === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setPaymentMethod(opt.value)}
                      className={cn(
                        "p-3.5 border text-left transition-colors cursor-pointer",
                        isSelected
                          ? "border-black dark:border-white bg-[#f9f6ed]/70 dark:bg-neutral-900"
                          : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-400"
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-sans font-medium text-neutral-950 dark:text-white">
                          {opt.label}
                        </span>
                        <span
                          className={cn(
                            "size-3.5 rounded-full border flex items-center justify-center",
                            isSelected
                              ? "border-black dark:border-white"
                              : "border-neutral-400"
                          )}
                        >
                          {isSelected && (
                            <span className="size-2 rounded-full bg-black dark:bg-white" />
                          )}
                        </span>
                      </div>
                      <p className="text-[11px] font-sans text-neutral-500">
