"use client";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ArrowLeftRight,
  PhoneCall,
  Printer,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import React from "react";

export default function DashboardQuickActions() {
  const actions = [
    {
      title: "Add New Fragrance",
      description: "Notes, bottle sizes & concentration",
      href: "/admin/products/new",
      icon: Sparkles,
      color: "text-primary bg-primary/10 hover:bg-primary/20",
    },
    {
      title: "Courier Dispatch & Labels",
      description: "1-click Steadfast & Pathao parcel creation",
      href: "/admin/courier",
      icon: Printer,
      color: "text-blue-600 bg-blue-500/10 hover:bg-blue-500/20",
    },
    {
      title: "Review Fragrance Returns & QC",
      description: "Approve damages, leakage swap & QC checks",
      href: "/admin/exchanges",
      icon: ArrowLeftRight,
      color: "text-emerald-600 bg-emerald-500/10 hover:bg-emerald-500/20",
    },
    {
      title: "Abandoned Cart Recovery",
      description: "Call center recovery for incomplete checkout",
      href: "/admin/orders?type=incomplete",
      icon: PhoneCall,
      color: "text-purple-600 bg-purple-500/10 hover:bg-purple-500/20",
    },
  ];

  return (
    <Card className="shadow-xs bg-muted/20 border-dashed">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="size-4 text-primary" />
          <h4 className="text-xs font-bold text-foreground">
            Quick Operational Actions
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {actions.map((act) => (
            <Link
              key={act.title}
              href={act.href}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-auto p-3 justify-start items-start text-left bg-background hover:border-primary/50 transition-colors flex items-start gap-3 w-full"
              )}
            >
              <div
                className={`size-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${act.color}`}
              >
                <act.icon className="size-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-xs text-foreground truncate">
                  {act.title}
                </div>
                <div className="text-[10px] text-muted-foreground truncate mt-0.5">
                  {act.description}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
