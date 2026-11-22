"use client";

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import React from "react";

export default function DashboardQuickActions() {
  const actions = [
    {
      title: "Add New Fragrance",
      description: "Formula, notes and flacon volumes",
      href: "/admin/products",
    },
    {
      title: "Courier Dispatch & Tracking",
      description: "Steadfast & Pathao parcel creation",
      href: "/admin/courier",
    },
    {
      title: "Review Damages & Returns",
      description: "Atomizer leakage & return QC inspect",
      href: "/admin/exchanges",
    },
    {
      title: "Incomplete Cart Recovery",
      description: "Call center recovery queue",
      href: "/admin/orders",
    },
  ];

  return (
    <Card className="shadow-none border border-border/60 bg-card">
      <CardContent className="p-4 space-y-3">
        <div className="text-xs font-normal text-muted-foreground uppercase tracking-wide">
          Quick Actions
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {actions.map((act) => (
            <Link
              key={act.title}
              href={act.href}
              className="p-3 rounded-md border border-border/40 hover:bg-muted/40 transition-colors text-left space-y-1 block"
            >
              <div className="text-xs font-normal text-foreground">
                {act.title}
              </div>
              <div className="text-[11px] font-normal text-muted-foreground">
                {act.description}
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
