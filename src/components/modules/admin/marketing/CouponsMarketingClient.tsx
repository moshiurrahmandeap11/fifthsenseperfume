"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
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
import { confirmAction } from "@/lib/swal";
import { createCoupon, deleteCoupon, updateCoupon } from "@/services/marketing.services";
import { DiscountType, ICoupon } from "@/types/marketing.types";
import { Plus, Search, Trash2 } from "lucide-react";
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
      toast.error("Please provide a coupon code");
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
        toast.success(`Coupon ${code.toUpperCase()} created`);
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
        toast.success(`Coupon ${coupon.code} updated`);
      } catch (err: unknown) {
        const error = err as { message?: string };
        toast.error(error.message || "Failed to update status");
      }
    });
  };

  const handleDelete = async (id: string, couponCode: string) => {
    const confirmed = await confirmAction({
      title: `Delete coupon "${couponCode}"?`,
      text: "This privilege code will be permanently deactivated.",
      confirmText: "Delete",
    });
    if (!confirmed) return;

    startTransition(async () => {
      try {
        await deleteCoupon(id);
        setCoupons((prev) => prev.filter((c) => c.id !== id));
        toast.success("Coupon deleted");
      } catch (err: unknown) {
        const error = err as { message?: string };
        toast.error(error.message || "Failed to delete coupon");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Marketing KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="shadow-none border border-border/60 bg-card p-4 space-y-1">
          <div className="text-xs font-normal text-muted-foreground uppercase">
            Active Coupons
          </div>
          <div className="text-xl font-normal text-foreground tabular-nums">
            {activeCount}
          </div>
        </Card>

        <Card className="shadow-none border border-border/60 bg-card p-4 space-y-1">
          <div className="text-xs font-normal text-muted-foreground uppercase">
            Total Redemptions
          </div>
          <div className="text-xl font-normal text-foreground tabular-nums">
            {totalUsedCount} times
          </div>
        </Card>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            placeholder="Search coupon code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 text-xs h-8 bg-background font-normal"
          />
        </div>

        <Button
          size="sm"
          onClick={() => setIsAddOpen(true)}
          className="h-8 px-3 text-xs gap-1.5 cursor-pointer font-normal"
        >
          <Plus className="size-3.5" />
          <span>Create Coupon</span>
        </Button>
      </div>

      {/* Coupons Table */}
      <Card className="shadow-none border border-border/60 overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="text-xs font-normal">Code</TableHead>
              <TableHead className="text-xs font-normal">Discount</TableHead>
              <TableHead className="text-xs font-normal text-right">Min. Order</TableHead>
              <TableHead className="text-xs font-normal text-right">Used / Limit</TableHead>
              <TableHead className="text-xs font-normal">Status</TableHead>
              <TableHead className="text-xs font-normal text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCoupons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-36 text-center text-xs font-normal text-muted-foreground">
                  No coupons found
                </TableCell>
              </TableRow>
            ) : (
              filteredCoupons.map((coupon) => (
                <TableRow key={coupon.id} className="hover:bg-muted/20 transition-colors">
                  <TableCell>
                    <div className="font-mono text-xs font-normal text-foreground">
                      {coupon.code}
                    </div>
                    {coupon.description && (
                      <div className="text-[11px] font-normal text-muted-foreground line-clamp-1">
                        {coupon.description}
                      </div>
                    )}
                  </TableCell>

                  <TableCell>
                    <span className="text-xs font-normal text-foreground">
                      {coupon.discountType === "PERCENTAGE" && `${coupon.discountValue}%`}
                      {coupon.discountType === "FIXED" && `BDT ${coupon.discountValue}`}
                      {coupon.discountType === "FREE_SHIPPING" && "Free Shipping"}
                    </span>
                  </TableCell>

                  <TableCell className="text-right text-xs font-normal text-foreground tabular-nums">
                    BDT {coupon.minOrderAmount?.toLocaleString() || 0}
                  </TableCell>

                  <TableCell className="text-right font-mono text-xs font-normal text-muted-foreground">
                    {coupon.usedCount} / {coupon.usageLimit || "∞"}
                  </TableCell>

                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleToggleStatus(coupon)}
                      className="h-6 px-1 cursor-pointer font-normal"
                    >
                      <Badge variant="outline" className="text-[10px] font-normal">
                        {coupon.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </Button>
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(coupon.id, coupon.code)}
                      className="size-7 p-0 cursor-pointer text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Create Coupon Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-normal">
              New Promotional Coupon
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs font-normal">
            <div className="space-y-1">
              <Label className="text-xs font-normal">Coupon Code</Label>
              <Input
                placeholder="e.g. FIFTHSENSE10"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="font-mono text-xs uppercase h-8 font-normal"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-normal">Description</Label>
              <Input
                placeholder="e.g. 10% off extrait orders over 3,000 BDT"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-xs h-8 font-normal"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-normal">Type</Label>
                <Select value={discountType} onValueChange={(val) => val && setDiscountType(val as DiscountType)}>
                  <SelectTrigger className="text-xs h-8 font-normal">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                    <SelectItem value="FIXED">Fixed (BDT)</SelectItem>
                    <SelectItem value="FREE_SHIPPING">Free Shipping</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-normal">Discount Value</Label>
                <Input
                  type="number"
                  min={1}
                  value={discountValue}
                  onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                  className="text-xs h-8 font-normal"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-normal">Min. Order (BDT)</Label>
                <Input
                  type="number"
                  min={0}
                  value={minOrderAmount}
                  onChange={(e) => setMinOrderAmount(parseFloat(e.target.value) || 0)}
                  className="text-xs h-8 font-normal"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-normal">Usage Limit</Label>
                <Input
                  type="number"
                  min={1}
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(parseInt(e.target.value) || 1)}
                  className="text-xs h-8 font-normal"
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
              className="text-xs font-normal"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleCreateCoupon}
              disabled={isPending}
              className="text-xs font-normal cursor-pointer"
            >
              {isPending ? "Creating..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
