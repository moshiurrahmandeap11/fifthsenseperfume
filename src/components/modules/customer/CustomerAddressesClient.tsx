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
  const districts = districtsRes?.data?.districts ?? [];
  const thanas = thanasRes?.data?.thanas ?? [];

  const openCreateForm = () => {
    setEditingId(null);
    setLabel("Home");
    setRecipientName(defaultRecipientName);
    setPhoneNumber(defaultPhoneNumber);
    setDivision("Dhaka");
    setDistrict("Dhaka");
    setThana("");
    setFullAddress("");
    setIsDefault(addresses.length === 0);
    setIsFormOpen(true);
  };

  const openEditForm = (addr: ICustomerAddress) => {
    setEditingId(addr.id);
    setLabel(addr.label || "Home");
    setRecipientName(addr.recipientName);
    setPhoneNumber(addr.phoneNumber);
    setDivision(addr.division);
    setDistrict(addr.district);
    setThana(addr.thana);
    setFullAddress(addr.fullAddress);
    setIsDefault(addr.isDefault);
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim() || !phoneNumber.trim() || !thana || !fullAddress.trim()) {
      toast.error("Please fill in all required address fields.");
      return;
    }

    startTransition(async () => {
      try {
        const deliveryZone =
          shippingQuoteRes?.data?.deliveryZone || "INSIDE_DHAKA";

        if (editingId) {
          const res = await updateAddress(editingId, {
            label,
            recipientName: recipientName.trim(),
            phoneNumber: phoneNumber.trim(),
            division,
            district,
            thana,
            fullAddress: fullAddress.trim(),
            deliveryZone,
            isDefault,
          });
          if (res?.data) {
            setAddresses((prev) =>
              prev.map((a) => {
                if (a.id === editingId) return res.data!;
                return isDefault ? { ...a, isDefault: false } : a;
              })
            );
            toast.success("Address updated");
          }
        } else {
          const res = await createAddress({
            label,
            recipientName: recipientName.trim(),
            phoneNumber: phoneNumber.trim(),
            division,
            district,
            thana,
            fullAddress: fullAddress.trim(),
            deliveryZone,
            isDefault,
          });
          if (res?.data) {
            setAddresses((prev) =>
              isDefault
                ? [res.data!, ...prev.map((a) => ({ ...a, isDefault: false }))]
                : [...prev, res.data!]
            );
            toast.success("Address added");
          }
        }

        setIsFormOpen(false);
        router.refresh();
      } catch (err: unknown) {
        const error = err as { message?: string };
        toast.error(error?.message || "Failed to save address");
      }
    });
  };

  const handleDelete = async (addr: ICustomerAddress) => {
    const confirmed = await confirmAction({
      title: `Remove ${addr.label} address?`,
      text: "This delivery address will be removed from your account.",
      confirmText: "Delete",
      cancelText: "Keep",
      variant: "destructive",
    });
    if (!confirmed) return;

    startTransition(async () => {
      try {
        await deleteAddress(addr.id);
        setAddresses((prev) => prev.filter((a) => a.id !== addr.id));
        toast.success("Address removed");
        router.refresh();
      } catch (err: unknown) {
        const error = err as { message?: string };
        toast.error(error?.message || "Failed to delete address");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-serif text-2xl sm:text-3xl font-normal text-neutral-950 dark:text-white uppercase">
            Saved Addresses
          </h1>
          <p className="text-xs font-sans text-neutral-500 mt-1">
            Manage your delivery destinations for faster fragrance checkout.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#09090b] text-white dark:bg-white dark:text-black text-xs font-sans uppercase cursor-pointer hover:opacity-90 transition-opacity"
        >
          <Plus className="size-3.5" />
          <span>Add New Address</span>
        </button>
      </div>

      {/* Add / Edit Address Form */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="border border-neutral-300 dark:border-neutral-700 bg-[#f9f6ed]/40 dark:bg-neutral-900/40 p-5 sm:p-6 space-y-4"
        >
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
            <h2 className="font-heading font-serif text-lg font-normal text-neutral-950 dark:text-white uppercase">
              {editingId ? "Edit Address" : "New Delivery Address"}
            </h2>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="p-1 text-neutral-500 hover:text-black dark:hover:text-white cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-sans text-neutral-700 dark:text-neutral-300 mb-1">
                Label
              </label>
              <Select value={label} onValueChange={(v) => v && setLabel(v)}>
                <SelectTrigger className="w-full h-10 rounded-none border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Home">Home</SelectItem>
                  <SelectItem value="Office">Office</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-sans text-neutral-700 dark:text-neutral-300 mb-1">
                Recipient Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
