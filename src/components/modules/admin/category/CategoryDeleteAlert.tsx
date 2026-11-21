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
import { deleteCategory } from "@/services/category.services";
import { ICategory } from "@/types/category.types";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface CategoryDeleteAlertProps {
  category: ICategory | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CategoryDeleteAlert({
  category,
  isOpen,
  onClose,
  onSuccess,
}: CategoryDeleteAlertProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!category) return null;

  const hasChildren = (category.children && category.children.length > 0) || false;
  const productCount = category._count?.products || 0;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteCategory(category.id);
      toast.success("Category deleted");
      onSuccess();
      onClose();
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(
        err?.message ||
          "Cannot delete category with linked subcategories or products."
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
            Delete Category &ldquo;{category.name}&rdquo;?
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2 text-xs font-normal">
            <p>
              This action cannot be undone. Are you sure you want to permanently
              remove this category?
            </p>
            {(hasChildren || productCount > 0) && (
              <div className="p-2.5 rounded-md border border-border/60 text-xs text-muted-foreground space-y-1 font-normal">
                {hasChildren && (
                  <p>
                    • This category contains subcategories. Reassign or delete them first.
                  </p>
                )}
                {productCount > 0 && (
                  <p>
                    • There are {productCount} fragrance products linked to this category.
                  </p>
                )}
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
              "Delete Category"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
