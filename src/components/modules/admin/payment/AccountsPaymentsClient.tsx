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
import { createExpense } from "@/services/payment.services";
import {
  ExpenseCategory,
  ICourierReconciliationSummary,
  IPaymentTransaction,
} from "@/types/payment.types";
import {
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  Plus,
  Receipt,
  Search,
  Wallet,
} from "lucide-react";
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
      toast.error("Please enter a valid expense amount");
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

        toast.success(`Expense of BDT ${expenseAmount} logged successfully`);
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
        <Card className="shadow-xs border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Settled Revenue
            </CardTitle>
            <Banknote className="size-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              BDT {totalRevenue.toLocaleString()}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Collected payments across all channels
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Pending Courier COD
            </CardTitle>
            <Clock className="size-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-amber-600">
              BDT {reconciliationSummary?.totalPendingCod?.toLocaleString() || 0}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Held by courier partners for disbursement
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Disbursed Payouts
            </CardTitle>
            <Wallet className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              BDT {reconciliationSummary?.totalNetPayoutDisbursed?.toLocaleString() || 0}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Net courier disbursements deposited
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Delivery Fees Incurred
            </CardTitle>
            <Receipt className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              BDT {reconciliationSummary?.totalDeliveryChargesDeducted?.toLocaleString() || 0}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Courier logistics overhead deducted
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search transaction ID, order # or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 text-xs h-9 bg-background"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={methodFilter} onValueChange={(val) => val && setMethodFilter(val)}>
            <SelectTrigger className="w-36 h-9 text-xs cursor-pointer">
              <SelectValue placeholder="Filter method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Methods</SelectItem>
              <SelectItem value="CASH_ON_DELIVERY">Cash on Delivery</SelectItem>
              <SelectItem value="BKASH">bKash</SelectItem>
              <SelectItem value="NAGAD">Nagad</SelectItem>
              <SelectItem value="SSLCOMMERZ">Cards / Online</SelectItem>
            </SelectContent>
          </Select>

          <Button
            size="sm"
            onClick={() => setIsExpenseOpen(true)}
            className="h-9 text-xs cursor-pointer gap-1.5"
          >
            <Plus className="size-3.5" />
            <span>Log Atelier Expense</span>
          </Button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="text-xs font-semibold">Transaction ID / Order</TableHead>
              <TableHead className="text-xs font-semibold">Payment Channel</TableHead>
              <TableHead className="text-xs font-semibold">Transaction Type</TableHead>
              <TableHead className="text-xs font-semibold">Customer</TableHead>
              <TableHead className="text-xs font-semibold">Amount</TableHead>
              <TableHead className="text-xs font-semibold">Status</TableHead>
              <TableHead className="text-xs font-semibold text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-44 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground space-y-2">
                    <CreditCard className="size-8 stroke-[1.5]" />
                    <p className="text-xs font-medium">No payment transactions recorded yet</p>
                    <p className="text-[11px] text-muted-foreground/80">
                      Completed fragrance orders and online payments will reflect in this ledger
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((tx) => (
                <TableRow key={tx.id} className="hover:bg-muted/20">
                  <TableCell>
                    <div className="space-y-0.5">
                      <span className="font-mono font-semibold text-xs text-foreground">
                        {tx.transactionId || `TX-${tx.id.substring(0, 8)}`}
                      </span>
                      <div className="text-[11px] text-muted-foreground">
                        Order #{tx.order?.orderNumber || "Direct"}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline" className="font-mono text-[11px] bg-background">
                      {tx.method}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <span className="text-xs text-muted-foreground">
                      {tx.transactionType.replace(/_/g, " ")}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-0.5">
                      <div className="font-medium text-xs text-foreground">
                        {tx.order?.customerName || "Customer"}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {tx.order?.customerPhone}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="font-bold text-xs text-foreground">
                      BDT {tx.amount?.toLocaleString()}
                    </div>
                  </TableCell>

                  <TableCell>
                    {tx.status === "PAID" ? (
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-300 gap-1 text-[10px]">
                        <CheckCircle2 className="size-2.5" /> Settled
                      </Badge>
                    ) : (tx.status as string) === "PENDING" || (tx.status as string) === "UNPAID" ? (
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-300 gap-1 text-[10px]">
                        <Clock className="size-2.5" /> Pending
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="text-[10px]">
                        {tx.status}
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-right text-[11px] text-muted-foreground">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Log Expense Dialog */}
      <Dialog open={isExpenseOpen} onOpenChange={setIsExpenseOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <DollarSign className="size-4 text-primary" />
              Log Atelier / Operational Expense
            </DialogTitle>
            <DialogDescription className="text-xs">
              Record advertising, luxury flacon packaging, formulation or courier expenses
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Expense Category</Label>
              <Select value={expenseCategory} onValueChange={(val) => setExpenseCategory(val as ExpenseCategory)}>
                <SelectTrigger className="text-xs h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="META_ADS">Meta &amp; Instagram Ads</SelectItem>
                  <SelectItem value="TIKTOK_ADS">TikTok Ads</SelectItem>
                  <SelectItem value="GOOGLE_ADS">Google Search Ads</SelectItem>
                  <SelectItem value="PACKAGING">Luxury Bottle &amp; Box Packaging</SelectItem>
                  <SelectItem value="COURIER_LOSS">Damaged Parcel / Courier Loss</SelectItem>
                  <SelectItem value="FACTORY_PAYMENT">Formulation &amp; Oil Supply</SelectItem>
                  <SelectItem value="SALARY">Atelier Staff Salaries</SelectItem>
                  <SelectItem value="OTHER">General Operations</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Expense Amount (BDT) <span className="text-destructive">*</span></Label>
              <Input
                type="number"
                min={1}
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(parseFloat(e.target.value) || 0)}
                placeholder="e.g. 5000"
                className="text-xs h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Description / Voucher Note</Label>
              <Input
                value={expenseDescription}
                onChange={(e) => setExpenseDescription(e.target.value)}
                placeholder="e.g. 100ml crystal flacons import customs clearance"
                className="text-xs h-9"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpenseOpen(false)}
              disabled={isPending}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleCreateExpense}
              disabled={isPending}
              className="text-xs cursor-pointer"
            >
              {isPending ? "Logging..." : "Save Expense"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
