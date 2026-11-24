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

