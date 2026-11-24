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
import { createExpense } from "@/services/payment.services";
import {
  ExpenseCategory,
  ICourierReconciliationSummary,
  IPaymentTransaction,
} from "@/types/payment.types";
import { Plus, Search } from "lucide-react";
import React, { useMemo, useState, useTransition } from "react";
import toast from "react-hot-toast";

interface AccountsPaymentsClientProps {
  initialTransactions: IPaymentTransaction[];
  totalRevenue: number;
  reconciliationSummary?: ICourierReconciliationSummary | null;
}

export default function AccountsPaymentsClient({
  initialTransactions,
  totalRevenue,
  reconciliationSummary,
}: AccountsPaymentsClientProps) {
  const [transactions] = useState<IPaymentTransaction[]>(initialTransactions);
  const [searchTerm, setSearchTerm] = useState("");
  const [methodFilter, setMethodFilter] = useState<string>("ALL");
  const [isPending, startTransition] = useTransition();

  // Log Expense State
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);
  const [expenseCategory, setExpenseCategory] = useState<ExpenseCategory>("META_ADS");
  const [expenseAmount, setExpenseAmount] = useState<number>(0);
  const [expenseDescription, setExpenseDescription] = useState("");

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        tx.transactionId?.toLowerCase().includes(q) ||
        tx.order?.orderNumber.toLowerCase().includes(q) ||
        tx.order?.customerName.toLowerCase().includes(q) ||
        tx.order?.customerPhone.includes(q);

      if (!matchesSearch) return false;

      if (methodFilter !== "ALL" && tx.method !== methodFilter) {
        return false;
      }

      return true;
    });
  }, [transactions, searchTerm, methodFilter]);

  const handleCreateExpense = () => {
    if (expenseAmount <= 0) {
      toast.error("Please enter an expense amount");
      return;
    }

    startTransition(async () => {
      try {
        await createExpense({
          category: expenseCategory,
          title: expenseDescription || `${expenseCategory} Expense`,
          amount: Number(expenseAmount),
          note: expenseDescription || undefined,
          date: new Date().toISOString().split("T")[0],
        });

        toast.success(`Expense logged`);
        setIsExpenseOpen(false);
        setExpenseAmount(0);
        setExpenseDescription("");
      } catch (err: unknown) {
        const error = err as { message?: string };
        toast.error(error.message || "Failed to log expense");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Financial Accounts KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="shadow-none border border-border/60 bg-card p-4 space-y-1">
          <div className="text-xs font-normal text-muted-foreground uppercase">
            Settled Revenue
          </div>
          <div className="text-xl font-normal text-foreground tabular-nums">
            BDT {totalRevenue.toLocaleString()}
          </div>
        </Card>

        <Card className="shadow-none border border-border/60 bg-card p-4 space-y-1">
          <div className="text-xs font-normal text-muted-foreground uppercase">
            Pending Courier COD
          </div>
          <div className="text-xl font-normal text-foreground tabular-nums">
            BDT {reconciliationSummary?.totalPendingCod?.toLocaleString() || 0}
          </div>
        </Card>

        <Card className="shadow-none border border-border/60 bg-card p-4 space-y-1">
          <div className="text-xs font-normal text-muted-foreground uppercase">
            Disbursed Payouts
          </div>
          <div className="text-xl font-normal text-foreground tabular-nums">
            BDT {reconciliationSummary?.totalNetPayoutDisbursed?.toLocaleString() || 0}
          </div>
        </Card>

        <Card className="shadow-none border border-border/60 bg-card p-4 space-y-1">
          <div className="text-xs font-normal text-muted-foreground uppercase">
            Delivery Fees Deducted
          </div>
          <div className="text-xl font-normal text-foreground tabular-nums">
            BDT {reconciliationSummary?.totalDeliveryChargesDeducted?.toLocaleString() || 0}
          </div>
        </Card>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            placeholder="Search transaction ID, order # or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 text-xs h-8 bg-background font-normal"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={methodFilter} onValueChange={(val) => val && setMethodFilter(val)}>
            <SelectTrigger className="w-36 h-8 text-xs font-normal cursor-pointer">
              <SelectValue placeholder="Payment Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Methods</SelectItem>
              <SelectItem value="COD">Cash on Delivery</SelectItem>
              <SelectItem value="STRIPE">Card (Stripe)</SelectItem>
            </SelectContent>
          </Select>

          <Button
            size="sm"
            onClick={() => setIsExpenseOpen(true)}
            className="h-8 px-3 text-xs gap-1.5 cursor-pointer font-normal"
          >
            <Plus className="size-3.5" />
            <span>Log Expense</span>
          </Button>
        </div>
      </div>

      {/* Transactions Table */}
      <Card className="shadow-none border border-border/60 overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="text-xs font-normal">Transaction ID</TableHead>
              <TableHead className="text-xs font-normal">Order #</TableHead>
              <TableHead className="text-xs font-normal">Method</TableHead>
              <TableHead className="text-xs font-normal">Customer</TableHead>
              <TableHead className="text-xs font-normal text-right">Amount</TableHead>
              <TableHead className="text-xs font-normal">Status</TableHead>
              <TableHead className="text-xs font-normal text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-36 text-center text-xs font-normal text-muted-foreground">
                  No payment transactions found
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((tx) => (
                <TableRow key={tx.id} className="hover:bg-muted/20 transition-colors">
                  <TableCell className="font-mono text-xs font-normal text-foreground">
                    {tx.transactionId || `TX-${tx.id.substring(0, 8)}`}
                  </TableCell>

                  <TableCell className="font-mono text-xs font-normal text-foreground">
                    #{tx.order?.orderNumber || "—"}
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline" className="font-mono text-[10px] font-normal">
                      {tx.method}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-xs font-normal">
                    <div>{tx.order?.customerName || "Customer"}</div>
                    <div className="text-[11px] font-mono text-muted-foreground">
                      {tx.order?.customerPhone}
                    </div>
                  </TableCell>

                  <TableCell className="text-right text-xs font-normal text-foreground tabular-nums">
                    BDT {tx.amount?.toLocaleString()}
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline" className="text-[10px] font-normal">
                      {tx.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right font-mono text-[11px] text-muted-foreground">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Log Expense Dialog */}
      <Dialog open={isExpenseOpen} onOpenChange={setIsExpenseOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-normal">
              Log Atelier / Operational Expense
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs font-normal">
            <div className="space-y-1">
              <Label className="text-xs font-normal">Category</Label>
              <Select value={expenseCategory} onValueChange={(val) => setExpenseCategory(val as ExpenseCategory)}>
                <SelectTrigger className="text-xs h-8 font-normal">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="META_ADS">Meta &amp; Instagram Ads</SelectItem>
                  <SelectItem value="TIKTOK_ADS">TikTok Ads</SelectItem>
                  <SelectItem value="GOOGLE_ADS">Google Search Ads</SelectItem>
                  <SelectItem value="PACKAGING">Bottle &amp; Box Packaging</SelectItem>
                  <SelectItem value="COURIER_LOSS">Damaged Parcel / Loss</SelectItem>
                  <SelectItem value="FACTORY_PAYMENT">Formulation &amp; Oils</SelectItem>
                  <SelectItem value="SALARY">Staff Salaries</SelectItem>
                  <SelectItem value="OTHER">Operations</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-normal">Amount (BDT)</Label>
              <Input
                type="number"
                min={1}
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(parseFloat(e.target.value) || 0)}
                className="text-xs h-8 font-normal"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-normal">Description / Note</Label>
              <Input
                value={expenseDescription}
                onChange={(e) => setExpenseDescription(e.target.value)}
                placeholder="e.g. Flacons import or ad campaign"
                className="text-xs h-8 font-normal"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpenseOpen(false)}
              disabled={isPending}
              className="text-xs font-normal"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleCreateExpense}
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
