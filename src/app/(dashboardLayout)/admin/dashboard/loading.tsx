import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function AdminDashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Title Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1.5">
          <Skeleton className="h-7 w-52" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>

      {/* Operational Alerts Banner Skeleton */}
      <Skeleton className="h-24 w-full rounded-xl" />

      {/* 4 Overview KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="shadow-xs">
            <CardContent className="p-5 space-y-3">
              <div className="flex justify-between items-center">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="size-8 rounded-lg" />
              </div>
              <Skeleton className="h-8 w-36" />
              <Skeleton className="h-3 w-44" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid Skeleton (2 Column) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-xs">
          <CardHeader className="pb-3 border-b">
            <Skeleton className="h-5 w-48" />
          </CardHeader>
          <CardContent className="pt-6 h-60">
            <Skeleton className="h-full w-full rounded-md" />
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader className="pb-3 border-b">
            <Skeleton className="h-5 w-48" />
          </CardHeader>
          <CardContent className="pt-6 h-60">
            <Skeleton className="h-full w-full rounded-md" />
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Table Skeleton */}
      <Card className="shadow-xs">
        <CardHeader className="pb-3 border-b">
          <Skeleton className="h-5 w-44" />
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-md" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
