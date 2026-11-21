import AccountsPaymentsClient from "@/components/modules/admin/payment/AccountsPaymentsClient";
import { FluidPage } from "@/components/ui/fluid-motion";
import { getAllTransactions, getCourierReconciliation } from "@/services/payment.services";
import { ICourierReconciliationSummary, IPaymentTransaction } from "@/types/payment.types";
import { Metadata } from "next";
import { connection } from "next/server";
import React from "react";

export const metadata: Metadata = {
  title: "Accounts & Payments | FIFTH SENSE PERFUMES",
  description: "Settled revenue, courier COD reconciliations and expenses",
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
    <FluidPage className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b">
        <h1 className="text-base font-normal tracking-wide uppercase text-foreground">
          Accounts &amp; Payments
        </h1>
        <span className="text-xs font-mono text-muted-foreground">
          BDT {totalRevenue.toLocaleString()} settled
        </span>
      </div>

      {/* Main Interactive Client */}
      <AccountsPaymentsClient
        initialTransactions={transactions}
        totalRevenue={totalRevenue}
        reconciliationSummary={reconciliationSummary}
      />
    </FluidPage>
  );
}
