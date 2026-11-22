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
import { Loader2 } from "lucide-react";
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
      toast.success("Volume guide deleted");
      onSuccess();
      onClose();
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(
        err?.message ||
          "Cannot delete guide while fragrance products are linked."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-sm font-normal">
            Delete Guide &ldquo;{chart.title}&rdquo;?
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2 text-xs font-normal">
            <p>
              Are you sure you want to delete this volume guide template?
            </p>
            {productCount > 0 && (
              <div className="p-2.5 rounded border border-border/50 text-xs text-muted-foreground font-normal">
                • {productCount} fragrance products are linked to this guide.
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting} onClick={onClose} className="text-xs font-normal">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isDeleting}
            className={cn(buttonVariants({ variant: "destructive" }), "text-xs font-normal cursor-pointer")}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Guide"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
