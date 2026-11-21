import AccountsPaymentsClient from "@/components/modules/admin/payment/AccountsPaymentsClient";
import { getAllTransactions, getCourierReconciliation } from "@/services/payment.services";
import { ICourierReconciliationSummary, IPaymentTransaction } from "@/types/payment.types";
import { CreditCard } from "lucide-react";
import { Metadata } from "next";
import { connection } from "next/server";
import React from "react";

export const metadata: Metadata = {
  title: "Accounts & Payments | FIFTH SENSE PERFUMES",
  description: "Monitor settled revenue, courier COD reconciliations, and atelier operational expenses",
};

export default async function AdminPaymentsPage() {
  await connection();
  let transactions: IPaymentTransaction[] = [];
  let totalRevenue = 0;
  let reconciliationSummary: ICourierReconciliationSummary | null = null;

  try {
    const [txRes, reconRes] = await Promise.all([
      getAllTransactions({ limit: 100 }),
      getCourierReconciliation(),
    ]);

    if (txRes?.data) {
      transactions = txRes.data.transactions || [];
      totalRevenue = txRes.data.totalPaidRevenue || 0;
    }

    if (reconRes?.data) {
      reconciliationSummary = reconRes.data.summary || null;
    }
  } catch (err) {
    console.error("Failed to load accounts and payments server-side:", err);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <CreditCard className="size-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Accounts &amp; Payments
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Financial ledger, courier COD settlements, payment gateway records and atelier expenses
          </p>
        </div>
      </div>

      {/* Main Interactive Client */}
      <AccountsPaymentsClient
        initialTransactions={transactions}
        totalRevenue={totalRevenue}
        reconciliationSummary={reconciliationSummary}
      />
    </div>
  );
}
