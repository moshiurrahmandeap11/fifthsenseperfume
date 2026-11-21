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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { updateOrderStatus } from "@/services/order.services";
import { OrderStatus } from "@/types/order.types";
import {
  CheckCircle2,
  Clock,
  Eye,
  Package,
  Phone,
  RefreshCw,
  Search,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";

interface OrderItem {
  id: string;
  productName: string;
  variantSize?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: string;
  totalAmount: number;
  status: string;
  paymentMethod?: string;
  paymentStatus?: string;
  createdAt: string;
  items?: OrderItem[];
  customerNote?: string;
}

interface OrderManagementClientProps {
  initialOrders: AdminOrder[];
}

export default function OrderManagementClient({
  initialOrders,
}: OrderManagementClientProps) {
  const [orders, setOrders] = useState<AdminOrder[]>(initialOrders || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("");

  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      const matchesSearch =
        ord.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ord.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ord.customerPhone.includes(searchQuery);

      const matchesTab =
        activeTab === "ALL" ? true : ord.status.toUpperCase() === activeTab;

      return matchesSearch && matchesTab;
    });
  }, [orders, searchQuery, activeTab]);

  const stats = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter((o) => o.status === "PENDING").length,
      confirmed: orders.filter((o) => o.status === "CONFIRMED").length,
      shipped: orders.filter((o) => o.status === "SHIPPED").length,
      delivered: orders.filter((o) => o.status === "DELIVERED").length,
      cancelled: orders.filter((o) => o.status === "CANCELLED").length,
    };
  }, [orders]);

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return;

    try {
      setIsUpdatingStatus(true);
      await updateOrderStatus(selectedOrder.id, { status: newStatus as OrderStatus });
      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder.id ? { ...o, status: newStatus } : o
        )
      );
      toast.success(`Order #${selectedOrder.orderNumber} updated to ${newStatus}`);
      setSelectedOrder(null);
    } catch {
      toast.error("Failed to update order status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30 gap-1 text-[11px]">
            <Clock className="size-3" /> Pending
          </Badge>
        );
      case "CONFIRMED":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30 gap-1 text-[11px]">
            <CheckCircle2 className="size-3" /> Confirmed
          </Badge>
        );
      case "SHIPPED":
        return (
          <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/30 gap-1 text-[11px]">
            <Truck className="size-3" /> Shipped
          </Badge>
        );
      case "DELIVERED":
        return (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 gap-1 text-[11px]">
            <CheckCircle2 className="size-3" /> Delivered
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge variant="outline" className="bg-rose-500/10 text-rose-600 border-rose-500/30 gap-1 text-[11px]">
            <XCircle className="size-3" /> Cancelled
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="text-[11px]">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="shadow-xs p-3.5 space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase">
            All Orders
          </span>
          <div className="text-xl font-bold text-foreground">{stats.total}</div>
        </Card>
        <Card className="shadow-xs p-3.5 space-y-1 bg-amber-500/5 border-amber-500/20">
          <span className="text-[11px] font-semibold text-amber-600 uppercase">
            Pending
          </span>
          <div className="text-xl font-bold text-amber-600">{stats.pending}</div>
        </Card>
        <Card className="shadow-xs p-3.5 space-y-1 bg-blue-500/5 border-blue-500/20">
          <span className="text-[11px] font-semibold text-blue-600 uppercase">
            Confirmed
          </span>
          <div className="text-xl font-bold text-blue-600">{stats.confirmed}</div>
        </Card>
        <Card className="shadow-xs p-3.5 space-y-1 bg-purple-500/5 border-purple-500/20">
          <span className="text-[11px] font-semibold text-purple-600 uppercase">
            Shipped
          </span>
          <div className="text-xl font-bold text-purple-600">{stats.shipped}</div>
        </Card>
        <Card className="shadow-xs p-3.5 space-y-1 bg-emerald-500/5 border-emerald-500/20">
          <span className="text-[11px] font-semibold text-emerald-600 uppercase">
            Delivered
          </span>
          <div className="text-xl font-bold text-emerald-600">{stats.delivered}</div>
        </Card>
        <Card className="shadow-xs p-3.5 space-y-1 bg-rose-500/5 border-rose-500/20">
          <span className="text-[11px] font-semibold text-rose-600 uppercase">
            Cancelled
          </span>
          <div className="text-xl font-bold text-rose-600">{stats.cancelled}</div>
        </Card>
      </div>

      {/* 2. Controls & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <TabsList className="grid grid-cols-3 sm:flex h-9 p-1">
            <TabsTrigger value="ALL" className="text-xs">
              All
            </TabsTrigger>
            <TabsTrigger value="PENDING" className="text-xs">
              Pending
            </TabsTrigger>
            <TabsTrigger value="CONFIRMED" className="text-xs">
              Confirmed
            </TabsTrigger>
            <TabsTrigger value="SHIPPED" className="text-xs">
              Shipped
            </TabsTrigger>
            <TabsTrigger value="DELIVERED" className="text-xs">
              Delivered
            </TabsTrigger>
            <TabsTrigger value="CANCELLED" className="text-xs">
              Cancelled
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-72">
          <Search className="size-4 text-muted-foreground absolute left-3 top-2.5" />
          <Input
            placeholder="Search order #, name, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>
      </div>

      {/* 3. Orders Table */}
      <Card className="shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="text-xs font-semibold">Order #</TableHead>
              <TableHead className="text-xs font-semibold">Customer</TableHead>
              <TableHead className="text-xs font-semibold">Items</TableHead>
              <TableHead className="text-xs font-semibold">Total Amount</TableHead>
              <TableHead className="text-xs font-semibold">Payment</TableHead>
              <TableHead className="text-xs font-semibold">Status</TableHead>
              <TableHead className="text-xs font-semibold">Date</TableHead>
              <TableHead className="text-xs font-semibold text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-40 text-center text-xs text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <ShoppingBag className="size-8 text-muted-foreground/40 mb-1" />
                    <p className="font-semibold text-foreground">No orders found</p>
                    <p className="text-[11px]">
                      {searchQuery
                        ? "Try searching with a different order number or phone."
                        : "Orders placed by customers will appear here in real-time."}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((ord) => (
                <TableRow key={ord.id} className="hover:bg-muted/20">
                  <TableCell className="font-bold text-xs text-foreground">
                    #{ord.orderNumber}
                  </TableCell>
                  <TableCell>
                    <div className="text-xs font-semibold text-foreground">
                      {ord.customerName}
                    </div>
                    <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Phone className="size-3" />
                      {ord.customerPhone}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {ord.items && ord.items.length > 0 ? (
                      <span className="truncate max-w-[180px] inline-block">
                        {ord.items[0].productName} ({ord.items[0].variantSize || "100ml"})
                        {ord.items.length > 1 && ` +${ord.items.length - 1} more`}
                      </span>
                    ) : (
                      "1 Fragrance Item"
                    )}
                  </TableCell>
                  <TableCell className="font-bold text-xs text-foreground">
                    BDT {ord.totalAmount?.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] font-medium">
                      {ord.paymentMethod || "COD"}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(ord.status)}</TableCell>
                  <TableCell className="text-[11px] text-muted-foreground">
                    {new Date(ord.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedOrder(ord);
                        setNewStatus(ord.status);
                      }}
                      className="h-7 px-2.5 text-xs gap-1.5 cursor-pointer"
                    >
                      <Eye className="size-3.5" />
                      <span>Details</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* 4. Order Details & Status Update Dialog */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between text-base">
                <span>Order #{selectedOrder.orderNumber}</span>
                {getStatusBadge(selectedOrder.status)}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {/* Customer Information */}
              <div className="p-3 rounded-xl bg-muted/30 border space-y-1.5 text-xs">
                <span className="font-bold text-foreground">Customer & Delivery:</span>
                <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                  <div>Name: <span className="text-foreground font-medium">{selectedOrder.customerName}</span></div>
                  <div>Phone: <span className="text-foreground font-medium">{selectedOrder.customerPhone}</span></div>
                </div>
                <div className="text-muted-foreground pt-1">
                  Address: <span className="text-foreground font-medium">{selectedOrder.shippingAddress}</span>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-foreground">Fragrance Items:</span>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-background border text-xs"
                      >
                        <div>
                          <div className="font-semibold text-foreground">
                            {item.productName}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            Volume: {item.variantSize || "100ml Extrait"} • Qty: {item.quantity}
                          </div>
                        </div>
                        <div className="font-bold text-foreground">
                          BDT {item.totalPrice?.toLocaleString()}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-2 rounded-lg bg-background border text-xs flex justify-between">
                      <span>Artisanal Perfume Flacon</span>
                      <span className="font-bold">BDT {selectedOrder.totalAmount?.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Update Dropdown */}
              <div className="pt-2 border-t flex items-center justify-between gap-3">
                <span className="text-xs font-medium text-foreground">Update Status:</span>
                <Select value={newStatus} onValueChange={(val) => val && setNewStatus(val)}>
                  <SelectTrigger className="w-48 h-8 text-xs">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="SHIPPED">Shipped</SelectItem>
                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedOrder(null)}
                className="h-8 text-xs"
              >
                Close
              </Button>
              <Button
                size="sm"
                disabled={isUpdatingStatus || newStatus === selectedOrder.status}
                onClick={handleUpdateStatus}
                className="h-8 text-xs"
              >
                {isUpdatingStatus ? "Updating..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
