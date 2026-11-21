"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createCoupon, deleteCoupon, updateCoupon } from "@/services/marketing.services";
import { DiscountType, ICoupon } from "@/types/marketing.types";
import {
  CheckCircle2,
  Clock,
  Percent,
  Plus,
  Search,
  Sparkles,
  Tag,
  Trash2,
  XCircle,
} from "lucide-react";
import React, { useMemo, useState, useTransition } from "react";
import toast from "react-hot-toast";

interface CouponsMarketingClientProps {
  initialCoupons: ICoupon[];
}

export default function CouponsMarketingClient({
  initialCoupons,
}: CouponsMarketingClientProps) {
  const [coupons, setCoupons] = useState<ICoupon[]>(initialCoupons);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();

  // Create Coupon Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState<DiscountType>("PERCENTAGE");
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minOrderAmount, setMinOrderAmount] = useState<number>(2000);
  const [usageLimit, setUsageLimit] = useState<number>(100);

  const filteredCoupons = useMemo(() => {
    return coupons.filter(
      (c) =>
        c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [coupons, searchTerm]);

  const activeCount = coupons.filter((c) => c.isActive).length;
  const totalUsedCount = coupons.reduce((sum, c) => sum + (c.usedCount || 0), 0);

  const handleCreateCoupon = () => {
    if (!code.trim()) {
      toast.error("Please provide a promo coupon code (e.g. FIFTHSENSE10)");
      return;
    }

    startTransition(async () => {
      try {
        const res = await createCoupon({
          code: code.trim().toUpperCase(),
          description,
          discountType,
          discountValue: Number(discountValue),
          minOrderAmount: Number(minOrderAmount),
          usageLimit: Number(usageLimit) || undefined,
          isActive: true,
        });

        if (res?.data) {
          setCoupons((prev) => [res.data, ...prev]);
        }
        toast.success(`Coupon ${code.toUpperCase()} created successfully`);
        setIsAddOpen(false);
        setCode("");
        setDescription("");
      } catch (err: unknown) {
        const error = err as { message?: string };
        toast.error(error.message || "Failed to create coupon");
      }
    });
  };

  const handleToggleStatus = (coupon: ICoupon) => {
    startTransition(async () => {
      try {
        await updateCoupon(coupon.id, { isActive: !coupon.isActive });
        setCoupons((prev) =>
          prev.map((c) => (c.id === coupon.id ? { ...c, isActive: !c.isActive } : c))
        );
        toast.success(`Coupon ${coupon.code} ${!coupon.isActive ? "activated" : "deactivated"}`);
      } catch (err: unknown) {
        const error = err as { message?: string };
        toast.error(error.message || "Failed to update coupon status");
      }
    });
  };

  const handleDelete = (id: string, couponCode: string) => {
    if (!confirm(`Are you sure you want to permanently delete coupon "${couponCode}"?`)) return;

    startTransition(async () => {
      try {
        await deleteCoupon(id);
        setCoupons((prev) => prev.filter((c) => c.id !== id));
        toast.success(`Coupon ${couponCode} deleted`);
      } catch (err: unknown) {
        const error = err as { message?: string };
        toast.error(error.message || "Failed to delete coupon");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Marketing KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-xs border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Active Promo Campaigns
            </CardTitle>
            <Tag className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {activeCount}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Active promotional discount codes
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Redemptions
            </CardTitle>
            <Percent className="size-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-emerald-600">
              {totalUsedCount} times
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Perfume voucher redemptions recorded
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Campaign Conversion
            </CardTitle>
            <Sparkles className="size-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              VIP Atelier
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              First-order &amp; discovery set incentives
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search coupon code or campaign..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 text-xs h-9 bg-background"
          />
        </div>

        <Button
          size="sm"
          onClick={() => setIsAddOpen(true)}
          className="h-9 text-xs cursor-pointer gap-1.5"
        >
          <Plus className="size-3.5" />
          <span>Create Coupon Code</span>
        </Button>
      </div>

      {/* Coupons Table */}
      <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="text-xs font-semibold">Promo Code</TableHead>
              <TableHead className="text-xs font-semibold">Discount Offer</TableHead>
              <TableHead className="text-xs font-semibold">Min. Order Value</TableHead>
              <TableHead className="text-xs font-semibold">Usage / Limit</TableHead>
              <TableHead className="text-xs font-semibold">Status</TableHead>
              <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCoupons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-44 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground space-y-2">
                    <Tag className="size-8 stroke-[1.5]" />
                    <p className="text-xs font-medium">No fragrance promo coupons found</p>
                    <p className="text-[11px] text-muted-foreground/80">
                      Create promotional codes (e.g. FIFTHSENSE10 or WINTEROUD) to reward customers
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredCoupons.map((coupon) => (
                <TableRow key={coupon.id} className="hover:bg-muted/20">
                  <TableCell>
                    <div className="space-y-0.5">
                      <div className="font-mono font-bold text-xs text-foreground flex items-center gap-1.5">
                        <Tag className="size-3 text-primary" />
                        <span>{coupon.code}</span>
                      </div>
                      {coupon.description && (
                        <div className="text-[11px] text-muted-foreground line-clamp-1">
                          {coupon.description}
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline" className="font-semibold text-xs text-foreground bg-background">
                      {coupon.discountType === "PERCENTAGE" && `${coupon.discountValue}% OFF`}
                      {coupon.discountType === "FIXED" && `BDT ${coupon.discountValue} OFF`}
                      {coupon.discountType === "FREE_SHIPPING" && "FREE DELIVERY"}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="text-xs font-medium">
                      BDT {coupon.minOrderAmount?.toLocaleString() || 0}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="text-xs text-muted-foreground font-mono">
                      {coupon.usedCount} / {coupon.usageLimit || "∞"} used
                    </div>
                  </TableCell>

                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleToggleStatus(coupon)}
                      className="h-6 px-1.5 cursor-pointer"
                    >
                      {coupon.isActive ? (
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-300 gap-1 text-[10px]">
                          <CheckCircle2 className="size-2.5" /> Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground gap-1 text-[10px]">
                          <XCircle className="size-2.5" /> Inactive
                        </Badge>
                      )}
                    </Button>
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(coupon.id, coupon.code)}
                      className="size-7 p-0 cursor-pointer text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create Coupon Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Tag className="size-4 text-primary" />
              Create Fragrance Promo Coupon
            </DialogTitle>
            <DialogDescription className="text-xs">
              Configure promotional codes for the FIFTH SENSE luxury perfume boutique
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Coupon Code <span className="text-destructive">*</span></Label>
              <Input
                placeholder="e.g. FIFTHSENSE10 or NOIRVIP"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="font-mono text-xs uppercase h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Campaign Description</Label>
              <Input
                placeholder="e.g. 10% discount for luxury extrait orders over 3,000 BDT"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-xs h-9"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Discount Type</Label>
                <Select value={discountType} onValueChange={(val) => setDiscountType(val as DiscountType)}>
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                    <SelectItem value="FIXED">Fixed Amount (BDT)</SelectItem>
                    <SelectItem value="FREE_SHIPPING">Free Shipping</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">
                  {discountType === "PERCENTAGE" ? "Discount Rate (%)" : "Discount Value (BDT)"}
                </Label>
                <Input
                  type="number"
                  min={1}
                  value={discountValue}
                  onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                  className="text-xs h-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Min. Order Amount (BDT)</Label>
                <Input
                  type="number"
                  min={0}
                  value={minOrderAmount}
                  onChange={(e) => setMinOrderAmount(parseFloat(e.target.value) || 0)}
                  className="text-xs h-9"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Usage Limit (Total uses)</Label>
                <Input
                  type="number"
                  min={1}
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(parseInt(e.target.value) || 1)}
                  className="text-xs h-9"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddOpen(false)}
              disabled={isPending}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleCreateCoupon}
              disabled={isPending}
              className="text-xs cursor-pointer"
            >
              {isPending ? "Creating..." : "Save Coupon"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
