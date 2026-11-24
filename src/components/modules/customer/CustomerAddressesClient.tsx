"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  CheckCircle2,
  Edit3,
  Loader2,
  MapPin,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createAddress,
  deleteAddress,
  updateAddress,
} from "@/services/user.services";
import {
  getBangladeshLocations,
  getShippingQuote,
} from "@/services/system.services";
import { confirmAction } from "@/lib/swal";
import { ICustomerAddress } from "@/types/user.types";
import { cn } from "@/lib/utils";

interface CustomerAddressesClientProps {
  initialAddresses: ICustomerAddress[];
  defaultRecipientName?: string;
  defaultPhoneNumber?: string;
}

export default function CustomerAddressesClient({
  initialAddresses,
  defaultRecipientName = "",
  defaultPhoneNumber = "",
}: CustomerAddressesClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [addresses, setAddresses] =
    useState<ICustomerAddress[]>(initialAddresses);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [label, setLabel] = useState("Home");
  const [recipientName, setRecipientName] = useState(defaultRecipientName);
  const [phoneNumber, setPhoneNumber] = useState(defaultPhoneNumber);
  const [division, setDivision] = useState("Dhaka");
  const [district, setDistrict] = useState("Dhaka");
  const [thana, setThana] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const { data: divisionsRes } = useQuery({
    queryKey: ["bd-locations", "divisions"],
    queryFn: () => getBangladeshLocations(),
    staleTime: Infinity,
  });

  const { data: districtsRes } = useQuery({
    queryKey: ["bd-locations", "districts", division],
    queryFn: () => getBangladeshLocations({ division }),
    enabled: Boolean(division),
    staleTime: Infinity,
  });

  const { data: thanasRes } = useQuery({
    queryKey: ["bd-locations", "thanas", district],
    queryFn: () => getBangladeshLocations({ district }),
    enabled: Boolean(district),
    staleTime: Infinity,
  });

  const { data: shippingQuoteRes } = useQuery({
    queryKey: ["shipping-quote", division, district, thana, 0],
    queryFn: () => getShippingQuote({ division, district, thana, subtotal: 0 }),
    enabled: Boolean(division && district),
  });

  const divisions = divisionsRes?.data?.divisions ?? [];
