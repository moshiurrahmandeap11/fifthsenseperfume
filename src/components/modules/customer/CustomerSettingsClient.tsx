"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Shield, User } from "lucide-react";
import toast from "react-hot-toast";
import { updateMyProfile } from "@/services/user.services";
import { ThumbnailDropzone } from "@/components/modules/admin/product/ImageUploadZone";
import ChangePasswordForm from "@/components/modules/auth/ChangePasswordForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Gender, IUser } from "@/types/auth.types";

interface CustomerSettingsClientProps {
  user: IUser;
}

export default function CustomerSettingsClient({
  user,
}: CustomerSettingsClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(user.name || "");
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || "");
  const [gender, setGender] = useState<Gender | "">(user.gender || "");
  const [address, setAddress] = useState(user.address || "");
  const [bio, setBio] = useState(user.bio || "");
  const [image, setImage] = useState(user.image || "");

  const handlePhotoChange = (url: string) => {
    setImage(url);
    startTransition(async () => {
      try {
        await updateMyProfile({ image: url });
        toast.success(url ? "Profile photo updated" : "Profile photo removed");
        router.refresh();
      } catch (err: unknown) {
        const error = err as { message?: string };
        toast.error(error?.message || "Failed to save profile photo");
      }
    });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      toast.error("Name must be at least 2 characters.");
      return;
    }

    startTransition(async () => {
      try {
        await updateMyProfile({
          name: name.trim(),
          phoneNumber: phoneNumber.trim() || undefined,
          gender: (gender as Gender) || undefined,
          address: address.trim() || undefined,
          bio: bio.trim() || undefined,
          image: image || undefined,
        });
        toast.success("Profile updated successfully");
        router.refresh();
      } catch (err: unknown) {
        const error = err as { message?: string };
        toast.error(error?.message || "Failed to update profile");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <h1 className="font-heading font-serif text-2xl sm:text-3xl font-normal text-neutral-950 dark:text-white uppercase">
          Profile &amp; Security
        </h1>
        <p className="text-xs font-sans text-neutral-500 mt-1">
          Update your personal details, avatar, and account password.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Profile Form */}
        <form
          onSubmit={handleSaveProfile}
          className="xl:col-span-7 border border-neutral-200 dark:border-neutral-800 p-5 sm:p-6 space-y-5 bg-white dark:bg-neutral-950"
        >
