import ChangePasswordForm from "@/components/modules/auth/ChangePasswordForm";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getMe } from "@/services/auth.services";
import {
  Award,
  CheckCircle2,
  Clock,
  Footprints,
  Mail,
  MapPin,
  Package,
  Phone,
  Ruler,
  Shield,
  ShoppingBag,
  Sparkles,
  User,
} from "lucide-react";
import { Metadata } from "next";
import { connection } from "next/server";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "Customer Dashboard | EcomBD Footwear",
  description: "Manage your profile, saved shoe size, orders, and account security",
};

export default async function CustomerDashboardPage() {
  await connection();
  const user = await getMe();

  const displayName = user?.name || "Customer";
  const displayEmail = user?.email || "";
  const displayPhone = user?.phoneNumber || "Not set";
  const displayShoeSize = user?.savedShoeSize || "41";
  const displayAddress = user?.address || "No address saved";
  const loyaltyPoints = user?.loyaltyPoints || 0;
  const isVerified = !!user?.emailVerified;

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 max-w-6xl">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 text-white shadow-xl">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="size-16 sm:size-20 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-xl sm:text-2xl font-bold tracking-tight shadow-inner">
            {initials || "U"}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                {displayName}
              </h1>
              {isVerified ? (
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 gap-1 text-xs">
                  <CheckCircle2 className="size-3" />
                  <span>Verified</span>
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-amber-500/20 text-amber-300 border-amber-500/30 gap-1 text-xs">
                  <Clock className="size-3" />
                  <span>Unverified</span>
                </Badge>
              )}
            </div>
            <p className="text-xs sm:text-sm text-neutral-400 flex items-center gap-1.5">
              <Mail className="size-3.5" />
              <span>{displayEmail}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-neutral-900 hover:bg-neutral-100 px-4 py-2 text-xs font-semibold transition-all shadow-sm cursor-pointer"
          >
            <ShoppingBag className="size-3.5" />
            <span>Browse Footwear</span>
          </Link>
        </div>
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Saved Shoe Size */}
        <Card className="shadow-xs border-border/70 hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Saved Shoe Size
            </CardTitle>
            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Ruler className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              EU {displayShoeSize}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Used for 1-click personalized fit recommendations
            </p>
          </CardContent>
        </Card>

        {/* Loyalty Points */}
        <Card className="shadow-xs border-border/70 hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Loyalty Points
            </CardTitle>
            <div className="size-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Sparkles className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {loyaltyPoints} pts
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Redeemable for discount vouchers on checkout
            </p>
          </CardContent>
        </Card>

        {/* Phone Number */}
        <Card className="shadow-xs border-border/70 hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Phone Number
            </CardTitle>
            <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Phone className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-base sm:text-lg font-bold text-foreground truncate">
              {displayPhone}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Used for courier parcel delivery and tracking
            </p>
          </CardContent>
        </Card>

        {/* My Orders */}
        <Card className="shadow-xs border-border/70 hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Orders & Returns
            </CardTitle>
            <div className="size-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Package className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              Active
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              View live courier shipments & 30-day size exchanges
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Two-Column Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Column: Profile Details */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="shadow-xs border-border/70">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <User className="size-4 text-primary" />
                <span>Account Profile Information</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Your personal details, saved delivery address, and footwear preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50 space-y-1">
                  <span className="text-[11px] font-semibold uppercase text-muted-foreground">
                    Full Name
                  </span>
                  <p className="text-sm font-medium text-foreground">{displayName}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50 space-y-1">
                  <span className="text-[11px] font-semibold uppercase text-muted-foreground">
                    Email Address
                  </span>
                  <p className="text-sm font-medium text-foreground truncate">{displayEmail}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50 space-y-1">
                  <span className="text-[11px] font-semibold uppercase text-muted-foreground">
                    Mobile Number
                  </span>
                  <p className="text-sm font-medium text-foreground">{displayPhone}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50 space-y-1">
                  <span className="text-[11px] font-semibold uppercase text-muted-foreground">
                    Default Shoe Size
                  </span>
                  <p className="text-sm font-medium text-foreground">EU {displayShoeSize}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase text-muted-foreground">
                  <MapPin className="size-3.5" />
                  <span>Primary Delivery Address</span>
                </div>
                <p className="text-sm font-medium text-foreground mt-0.5">
                  {displayAddress}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Security & Change Password */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="shadow-xs border-border/70">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Shield className="size-4 text-primary" />
                <span>Security & Password</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Update your account password to keep your profile secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChangePasswordForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
