"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { deleteSizeChart } from "@/services/sizeChart.services";
import { ISizeChart } from "@/types/sizeChart.types";
import { AlertTriangle, Loader2 } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface SizeChartDeleteAlertProps {
  chart: ISizeChart | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SizeChartDeleteAlert({
  chart,
  isOpen,
  onClose,
  onSuccess,
}: SizeChartDeleteAlertProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!chart) return null;

  const productCount = chart._count?.products || 0;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteSizeChart(chart.id);
      toast.success("Size chart deleted successfully");
      onSuccess();
      onClose();
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(
        err?.message ||
          "Cannot delete size chart. Please ensure no footwear products are using this chart."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="size-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-2">
            <AlertTriangle className="size-5" />
          </div>
          <AlertDialogTitle>
            Delete Size Chart &ldquo;{chart.title}&rdquo;?
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Are you sure you want to permanently remove this size chart template?
            </p>
            {productCount > 0 && (
              <div className="p-2.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-400 space-y-1">
                <span className="font-semibold block">Warning:</span>
                <p>
                  • There are {productCount} footwear products linked to this size chart.
                  Customers will not have a size guide on those product pages until reassigned.
                </p>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting} onClick={onClose}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isDeleting}
            className={cn(buttonVariants({ variant: "destructive" }), "cursor-pointer")}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Yes, Delete Size Chart"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
