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
