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
import { AnimatePresence, motion } from "motion/react";
import { getAllOrders, updateOrderStatus } from "@/services/order.services";
import { OrderStatus } from "@/types/order.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, Search } from "lucide-react";
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
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");

  const { data: orders = [] } = useQuery<AdminOrder[]>({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const res = await getAllOrders({ limit: 100 });
      return (res?.data || []) as unknown as AdminOrder[];
    },
    initialData: initialOrders || [],
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      updateOrderStatus(id, { status }),
    onSuccess: (_data, variables) => {
      queryClient.setQueryData<AdminOrder[]>(["admin-orders"], (old = []) =>
        old.map((o) =>
          o.id === variables.id ? { ...o, status: variables.status } : o
        )
      );
      void queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
  });

  const isUpdatingStatus = statusMutation.isPending;

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
      await statusMutation.mutateAsync({
        id: selectedOrder.id,
        status: newStatus as OrderStatus,
      });
      toast.success(`Order #${selectedOrder.orderNumber} updated to ${newStatus}`);
      setSelectedOrder(null);
    } catch {
      toast.error("Failed to update order status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="shadow-none border border-border/60 p-3 space-y-1">
          <span className="text-[11px] font-normal text-muted-foreground uppercase">
            All
          </span>
          <div className="text-xl font-normal text-foreground tabular-nums">{stats.total}</div>
        </Card>
        <Card className="shadow-none border border-border/60 p-3 space-y-1">
          <span className="text-[11px] font-normal text-muted-foreground uppercase">
            Pending
          </span>
          <div className="text-xl font-normal text-foreground tabular-nums">{stats.pending}</div>
        </Card>
        <Card className="shadow-none border border-border/60 p-3 space-y-1">
          <span className="text-[11px] font-normal text-muted-foreground uppercase">
            Confirmed
          </span>
          <div className="text-xl font-normal text-foreground tabular-nums">{stats.confirmed}</div>
        </Card>
        <Card className="shadow-none border border-border/60 p-3 space-y-1">
          <span className="text-[11px] font-normal text-muted-foreground uppercase">
            Shipped
          </span>
          <div className="text-xl font-normal text-foreground tabular-nums">{stats.shipped}</div>
        </Card>
        <Card className="shadow-none border border-border/60 p-3 space-y-1">
          <span className="text-[11px] font-normal text-muted-foreground uppercase">
            Delivered
          </span>
          <div className="text-xl font-normal text-foreground tabular-nums">{stats.delivered}</div>
        </Card>
        <Card className="shadow-none border border-border/60 p-3 space-y-1">
          <span className="text-[11px] font-normal text-muted-foreground uppercase">
            Cancelled
          </span>
          <div className="text-xl font-normal text-foreground tabular-nums">{stats.cancelled}</div>
        </Card>
      </div>

      {/* Controls & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Tabs value={activeTab} onValueChange={(val) => val && setActiveTab(val)} className="w-full sm:w-auto">
          <TabsList className="grid grid-cols-3 sm:flex h-8 p-0.5">
            <TabsTrigger value="ALL" className="text-xs font-normal">
              All
            </TabsTrigger>
            <TabsTrigger value="PENDING" className="text-xs font-normal">
              Pending
            </TabsTrigger>
            <TabsTrigger value="CONFIRMED" className="text-xs font-normal">
              Confirmed
            </TabsTrigger>
            <TabsTrigger value="SHIPPED" className="text-xs font-normal">
              Shipped
            </TabsTrigger>
            <TabsTrigger value="DELIVERED" className="text-xs font-normal">
              Delivered
            </TabsTrigger>
            <TabsTrigger value="CANCELLED" className="text-xs font-normal">
              Cancelled
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            placeholder="Search order #, customer, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 text-xs h-8 bg-background font-normal"
          />
        </div>
      </div>

      {/* Fluid Tab Content Table */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.16, ease: "easeOut" }}
          className="rounded-lg border border-border/60 bg-card overflow-hidden"
        >
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="text-xs font-normal">Order #</TableHead>
                <TableHead className="text-xs font-normal">Date</TableHead>
                <TableHead className="text-xs font-normal">Customer</TableHead>
                <TableHead className="text-xs font-normal">Items</TableHead>
                <TableHead className="text-xs font-normal">Status</TableHead>
                <TableHead className="text-xs font-normal text-right">Amount</TableHead>
                <TableHead className="text-xs font-normal text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-36 text-center text-xs font-normal text-muted-foreground">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((ord) => (
                  <TableRow key={ord.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell className="font-mono text-xs font-normal text-foreground">
                      #{ord.orderNumber}
                    </TableCell>

                    <TableCell className="text-xs font-normal text-muted-foreground font-mono">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </TableCell>

                    <TableCell>
                      <div className="text-xs font-normal text-foreground">{ord.customerName}</div>
                      <div className="text-[11px] font-normal text-muted-foreground font-mono">
                        {ord.customerPhone}
                      </div>
                    </TableCell>

                    <TableCell className="text-xs font-normal text-muted-foreground">
                      {ord.items && ord.items.length > 0 ? (
                        <span>
                          {ord.items[0].productName}{" "}
                          {ord.items.length > 1 && `+${ord.items.length - 1} more`}
                        </span>
                      ) : (
                        <span>Flacon items</span>
                      )}
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline" className="font-normal text-[10px]">
                        {ord.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right text-xs font-normal text-foreground tabular-nums">
                      BDT {ord.totalAmount?.toLocaleString()}
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedOrder(ord);
                          setNewStatus(ord.status);
                        }}
                        className="h-7 px-2 text-xs font-normal cursor-pointer"
                      >
                        <Eye className="size-3.5 mr-1" />
                        <span>View</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </motion.div>
      </AnimatePresence>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-normal">
              Order #{selectedOrder?.orderNumber}
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4 py-2 text-xs font-normal">
              <div className="space-y-1 border-b pb-3">
                <div className="text-foreground">{selectedOrder.customerName}</div>
                <div className="text-muted-foreground">{selectedOrder.customerPhone}</div>
                <div className="text-muted-foreground">{selectedOrder.shippingAddress}</div>
              </div>

              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div className="space-y-2 border-b pb-3">
                  <div className="text-muted-foreground">Items</div>
                  {selectedOrder.items.map((it) => (
                    <div key={it.id} className="flex justify-between">
                      <span>{it.productName} ({it.variantSize || "Standard"}) × {it.quantity}</span>
                      <span className="tabular-nums">BDT {it.totalPrice?.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-between border-b pb-3">
                <span>Total Payable</span>
                <span className="tabular-nums">BDT {selectedOrder.totalAmount?.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-muted-foreground">Change Status:</span>
                <Select value={newStatus} onValueChange={(val) => val && setNewStatus(val)}>
                  <SelectTrigger className="w-40 h-8 text-xs font-normal">
                    <SelectValue />
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
          )}

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedOrder(null)}
              className="text-xs font-normal"
            >
              Close
            </Button>
            <Button
              size="sm"
              onClick={handleUpdateStatus}
              disabled={isUpdatingStatus}
              className="text-xs font-normal cursor-pointer"
            >
              {isUpdatingStatus ? "Updating..." : "Save Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
