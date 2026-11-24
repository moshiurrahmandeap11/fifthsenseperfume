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
