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
