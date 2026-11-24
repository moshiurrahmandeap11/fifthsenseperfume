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
