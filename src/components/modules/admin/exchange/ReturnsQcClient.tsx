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
import { Textarea } from "@/components/ui/textarea";
import { decideExchangeStatus, decideReturnQc } from "@/services/exchange.services";
import { ExchangeStatus, IExchangeRequest, ReturnQcStatus } from "@/types/exchange.types";
import { Search } from "lucide-react";
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
          toast.success("Return status updated");
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
          toast.success("QC grading updated");
        }

        setSelectedExchange(null);
      } catch (err: unknown) {
        const error = err as { message?: string };
        toast.error(error.message || "Failed to update return request");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Returns KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-none border border-border/60 bg-card p-4 space-y-1">
          <div className="text-xs font-normal text-muted-foreground uppercase">
            Pending Review
          </div>
          <div className="text-xl font-normal text-foreground tabular-nums">
            {pendingCount}
          </div>
        </Card>

        <Card className="shadow-none border border-border/60 bg-card p-4 space-y-1">
          <div className="text-xs font-normal text-muted-foreground uppercase">
            Warehouse QC Pending
          </div>
          <div className="text-xl font-normal text-foreground tabular-nums">
            {qcPendingCount}
          </div>
        </Card>

        <Card className="shadow-none border border-border/60 bg-card p-4 space-y-1">
          <div className="text-xs font-normal text-muted-foreground uppercase">
            Resolved
          </div>
          <div className="text-xl font-normal text-foreground tabular-nums">
            {completedCount}
          </div>
        </Card>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            placeholder="Search return #, order #, or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 text-xs h-8 bg-background font-normal"
          />
        </div>

        <Select value={statusFilter} onValueChange={(val) => val && setStatusFilter(val)}>
          <SelectTrigger className="w-36 h-8 text-xs font-normal cursor-pointer">
            <SelectValue placeholder="Status" />
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

      {/* Returns Table */}
      <Card className="shadow-none border border-border/60 overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="text-xs font-normal">Ticket #</TableHead>
              <TableHead className="text-xs font-normal">Customer</TableHead>
              <TableHead className="text-xs font-normal">Fragrance</TableHead>
              <TableHead className="text-xs font-normal">Issue</TableHead>
              <TableHead className="text-xs font-normal">Status</TableHead>
              <TableHead className="text-xs font-normal">QC Grade</TableHead>
              <TableHead className="text-xs font-normal text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExchanges.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-36 text-center text-xs font-normal text-muted-foreground">
                  No return tickets found
                </TableCell>
              </TableRow>
            ) : (
              filteredExchanges.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/20 transition-colors">
                  <TableCell>
                    <div className="font-mono text-xs font-normal text-foreground">
                      {item.exchangeNumber}
                    </div>
                    <div className="text-[11px] font-mono text-muted-foreground">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="text-xs font-normal text-foreground">
                      {item.order?.customerName || "Customer"}
                    </div>
                    <div className="text-[11px] font-mono text-muted-foreground">
                      {item.order?.customerPhone}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="text-xs font-normal text-foreground line-clamp-1">
                      {item.orderItem?.productName || "Fragrance"}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {item.oldVariant?.size || "Standard"}
                    </div>
                  </TableCell>

                  <TableCell className="max-w-xs text-xs font-normal text-muted-foreground line-clamp-1">
                    {item.reason}
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline" className="text-[10px] font-normal">
                      {item.status}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline" className="text-[10px] font-normal">
                      {item.returnQcStatus}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenDecision(item, "STATUS")}
                        className="h-7 text-xs font-normal px-2 cursor-pointer"
                      >
                        Status
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenDecision(item, "QC")}
                        className="h-7 text-xs font-normal px-2 cursor-pointer"
                      >
                        QC
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Decision Dialog */}
      <Dialog open={!!selectedExchange} onOpenChange={(open) => !open && setSelectedExchange(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-normal">
              {decisionType === "STATUS" ? "Update Return Status" : "Warehouse QC Decision"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs font-normal">
            {decisionType === "STATUS" ? (
              <div className="space-y-1">
                <Label className="text-xs font-normal">Status</Label>
                <Select value={newStatus} onValueChange={(val) => val && setNewStatus(val as ExchangeStatus)}>
                  <SelectTrigger className="text-xs h-8 font-normal">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Under Review</SelectItem>
                    <SelectItem value="APPROVED">Approve Replacement</SelectItem>
                    <SelectItem value="REPLACEMENT_DISPATCHED">Dispatched</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="REJECTED">Reject</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-1">
                <Label className="text-xs font-normal">Warehouse QC</Label>
                <Select value={qcStatus} onValueChange={(val) => val && setQcStatus(val as ReturnQcStatus)}>
                  <SelectTrigger className="text-xs h-8 font-normal">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AWAITING_RETURN">Awaiting Return</SelectItem>
                    <SelectItem value="RECEIVED_PENDING_QC">Received (Pending Inspection)</SelectItem>
                    <SelectItem value="QC_PASSED_RESTOCKED">QC Passed (Restocked)</SelectItem>
                    <SelectItem value="QC_FAILED_DAMAGED">QC Failed (Damaged / Leaked)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {newStatus === "REJECTED" && decisionType === "STATUS" && (
              <div className="space-y-1">
                <Label className="text-xs font-normal text-muted-foreground">Rejection Reason</Label>
                <Input
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Consumed or outside policy"
                  className="text-xs h-8 font-normal"
                />
              </div>
            )}

            <div className="space-y-1">
              <Label className="text-xs font-normal">Internal Note</Label>
              <Textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Inspection or packaging notes..."
                className="text-xs font-normal"
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedExchange(null)}
              disabled={isPending}
              className="text-xs font-normal"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSaveDecision}
              disabled={isPending}
              className="text-xs font-normal cursor-pointer"
            >
              {isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
