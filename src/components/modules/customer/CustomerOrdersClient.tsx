"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  MapPin,
  Package,
  Truck,
} from "lucide-react";
import { IOrder } from "@/types/order.types";
import { formatFragrancePrice } from "@/components/modules/storefront/cart/cartUtils";
import { cn } from "@/lib/utils";

interface CustomerOrdersClientProps {
  initialOrders: IOrder[];
}

type OrderFilter = "ALL" | "ACTIVE" | "DELIVERED" | "CANCELLED";
