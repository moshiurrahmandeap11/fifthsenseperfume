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
import { Textarea } from "@/components/ui/textarea";
import { decideExchangeStatus, decideReturnQc } from "@/services/exchange.services";
import { ExchangeStatus, IExchangeRequest, ReturnQcStatus } from "@/types/exchange.types";
import {
  AlertTriangle,
  ArrowLeftRight,
  CheckCircle2,
  Clock,
  Droplets,
  Eye,
  FileCheck2,
  Search,
  ShieldAlert,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import React, { useMemo, useState, useTransition } from "react";
import toast from "react-hot-toast";

interface ReturnsQcClientProps {
  initialExchanges: IExchangeRequest[];
}

export default function ReturnsQcClient({ initialExchanges }: ReturnsQcClientProps) {
  const [exchanges, setExchanges] = useState<IExchangeRequest[]>(initialExchanges);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedExchange, setSelectedExchange] = useState<IExchangeRequest | null>(null);
  const [isPending, startTransition] = useTransition();

  // Decision Dialog Form States
  const [decisionType, setDecisionType] = useState<"STATUS" | "QC">("STATUS");
  const [newStatus, setNewStatus] = useState<ExchangeStatus>("APPROVED");
  const [qcStatus, setQcStatus] = useState<ReturnQcStatus>("QC_PASSED_RESTOCKED");
  const [adminNote, setAdminNote] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  const filteredExchanges = useMemo(() => {
    return exchanges.filter((ex) => {
      const matchesSearch =
        ex.exchangeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.order?.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.order?.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.order?.customerPhone.includes(searchTerm) ||
        ex.orderItem?.productName.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      if (statusFilter !== "ALL" && ex.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [exchanges, searchTerm, statusFilter]);

  const pendingCount = exchanges.filter((e) => e.status === "PENDING").length;
  const qcPendingCount = exchanges.filter((e) => e.returnQcStatus === "RECEIVED_PENDING_QC").length;
  const completedCount = exchanges.filter((e) => e.status === "COMPLETED").length;

  const handleOpenDecision = (item: IExchangeRequest, type: "STATUS" | "QC") => {
    setSelectedExchange(item);
    setDecisionType(type);
    setAdminNote(item.adminNote || "");
    setNewStatus(item.status);
    setQcStatus(item.returnQcStatus);
    setRejectionReason("");
  };

  const handleSaveDecision = () => {
    if (!selectedExchange) return;

    startTransition(async () => {
      try {
        if (decisionType === "STATUS") {
          await decideExchangeStatus(selectedExchange.id, {
            status: newStatus,
            adminNote,
            rejectionReason: newStatus === "REJECTED" ? rejectionReason : undefined,
          });

          setExchanges((prev) =>
            prev.map((e) =>
              e.id === selectedExchange.id
                ? { ...e, status: newStatus, adminNote }
                : e
            )
          );
          toast.success(`Exchange ${selectedExchange.exchangeNumber} status updated to ${newStatus}`);
        } else {
          await decideReturnQc(selectedExchange.id, {
            decision: qcStatus,
            note: adminNote,
          });

          setExchanges((prev) =>
            prev.map((e) =>
              e.id === selectedExchange.id
                ? { ...e, returnQcStatus: qcStatus, adminNote }
                : e
            )
          );
          toast.success(`QC grading updated to ${qcStatus}`);
        }

        setSelectedExchange(null);
      } catch (err: unknown) {
        const error = err as { message?: string };
        toast.error(error.message || "Failed to update return request");
      }
    });
  };

  const renderStatusBadge = (status: ExchangeStatus) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-300 gap-1 text-[11px]">
            <Clock className="size-3" /> Under Review
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-300 gap-1 text-[11px]">
            <CheckCircle2 className="size-3" /> Approved
          </Badge>
        );
      case "REPLACEMENT_DISPATCHED":
        return (
          <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-300 gap-1 text-[11px]">
            <Droplets className="size-3" /> Dispatched
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-300 gap-1 text-[11px]">
            <CheckCircle2 className="size-3" /> Completed
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge variant="destructive" className="gap-1 text-[11px]">
            <XCircle className="size-3" /> Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const renderQcBadge = (qc: ReturnQcStatus) => {
    switch (qc) {
      case "AWAITING_RETURN":
        return <span className="text-[11px] text-muted-foreground">In Customer Hands</span>;
      case "RECEIVED_PENDING_QC":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-300 text-[10px]">
            Vault Inspection Needed
          </Badge>
        );
      case "QC_PASSED_RESTOCKED":
        return (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-300 text-[10px]">
            Restocked / Pristine
          </Badge>
        );
      case "QC_FAILED_DAMAGED":
        return (
          <Badge variant="destructive" className="text-[10px]">
            Damaged / Discarded
          </Badge>
        );
      default:
        return <span className="text-[11px]">{qc}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Returns KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-xs border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Pending Exchange Requests
            </CardTitle>
            <Clock className="size-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {pendingCount}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Awaiting atelier approval
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Warehouse Returns QC
            </CardTitle>
            <ShieldAlert className="size-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {qcPendingCount}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Returned flacons awaiting inspection
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Resolved &amp; Swapped
            </CardTitle>
            <FileCheck2 className="size-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {completedCount}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Successfully satisfied customers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search return #, order #, customer or fragrance..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 text-xs h-9 bg-background"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={(val) => val && setStatusFilter(val)}>
            <SelectTrigger className="w-36 h-9 text-xs cursor-pointer">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="PENDING">Under Review</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REPLACEMENT_DISPATCHED">Dispatched</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Returns Table */}
      <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="text-xs font-semibold">Return ID &amp; Date</TableHead>
              <TableHead className="text-xs font-semibold">Customer &amp; Order</TableHead>
              <TableHead className="text-xs font-semibold">Fragrance Flacon</TableHead>
              <TableHead className="text-xs font-semibold">Reason / Issue</TableHead>
              <TableHead className="text-xs font-semibold">Status</TableHead>
              <TableHead className="text-xs font-semibold">Vault QC</TableHead>
              <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExchanges.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-44 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground space-y-2">
                    <ArrowLeftRight className="size-8 stroke-[1.5]" />
                    <p className="text-xs font-medium">No returns or damage QC tickets</p>
                    <p className="text-[11px] text-muted-foreground/80">
                      When customers report damaged atomizers or request scent exchanges, they appear here
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredExchanges.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/20">
                  <TableCell>
                    <div className="space-y-0.5">
                      <span className="font-mono font-semibold text-xs text-foreground">
                        {item.exchangeNumber}
                      </span>
                      <div className="text-[11px] text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-0.5">
                      <div className="font-medium text-xs text-foreground">
                        {item.order?.customerName || "Customer"}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {item.order?.customerPhone} • #{item.order?.orderNumber}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-0.5">
                      <div className="font-medium text-xs text-foreground line-clamp-1">
                        {item.orderItem?.productName || "Fragrance Flacon"}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {item.oldVariant?.size || "Standard Volume"}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="max-w-xs text-xs text-muted-foreground line-clamp-2">
                      {item.reason}
                    </div>
                  </TableCell>

                  <TableCell>{renderStatusBadge(item.status)}</TableCell>

                  <TableCell>{renderQcBadge(item.returnQcStatus)}</TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenDecision(item, "STATUS")}
                        className="h-7 text-xs px-2 cursor-pointer"
                      >
                        Status
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenDecision(item, "QC")}
                        className="h-7 text-xs px-2 cursor-pointer text-blue-600 hover:text-blue-700"
                      >
                        QC Grade
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Decision Dialog */}
      <Dialog open={!!selectedExchange} onOpenChange={(open) => !open && setSelectedExchange(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              {decisionType === "STATUS" ? (
                <>
                  <CheckCircle2 className="size-4 text-primary" />
                  Review Return Status
                </>
              ) : (
                <>
                  <ShieldAlert className="size-4 text-blue-600" />
                  Warehouse QC Inspection
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Ticket: {selectedExchange?.exchangeNumber} • Fragrance: {selectedExchange?.orderItem?.productName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {decisionType === "STATUS" ? (
              <div className="space-y-1.5">
                <Label className="text-xs">Update Status</Label>
                <Select value={newStatus} onValueChange={(val) => val && setNewStatus(val as ExchangeStatus)}>
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Under Review</SelectItem>
                    <SelectItem value="APPROVED">Approve Replacement Flacon</SelectItem>
                    <SelectItem value="REPLACEMENT_DISPATCHED">Replacement Dispatched</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="REJECTED">Reject Return</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-1.5">
                <Label className="text-xs">Warehouse QC Condition</Label>
                <Select value={qcStatus} onValueChange={(val) => val && setQcStatus(val as ReturnQcStatus)}>
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AWAITING_RETURN">Awaiting Return</SelectItem>
                    <SelectItem value="RECEIVED_PENDING_QC">Received (Pending Inspection)</SelectItem>
                    <SelectItem value="QC_PASSED_RESTOCKED">QC Passed (Unopened, Restocked)</SelectItem>
                    <SelectItem value="QC_FAILED_DAMAGED">QC Failed (Atomizer Leaked / Damaged)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {newStatus === "REJECTED" && decisionType === "STATUS" && (
              <div className="space-y-1.5">
                <Label className="text-xs text-destructive">Rejection Reason</Label>
                <Input
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Flacon was more than 50% consumed"
                  className="text-xs h-9"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs">Admin / Atelier Inspection Note</Label>
              <Textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Internal notes regarding bottle condition or courier damage..."
                className="text-xs"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedExchange(null)}
              disabled={isPending}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSaveDecision}
              disabled={isPending}
              className="text-xs cursor-pointer"
            >
              {isPending ? "Saving..." : "Confirm Decision"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
