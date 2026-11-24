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
