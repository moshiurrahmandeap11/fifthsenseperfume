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
import { AlertTriangle, Loader2 } from "lucide-react";
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
      toast.success("Category deleted successfully");
      onSuccess();
      onClose();
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(
        err?.message ||
          "Cannot delete category. Make sure no subcategories or footwear products are attached."
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
            Delete Category &ldquo;{category.name}&rdquo;?
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              This action cannot be undone. Are you sure you want to permanently
              remove this category from the store?
            </p>
            {(hasChildren || productCount > 0) && (
              <div className="p-2.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-400 space-y-1">
                <span className="font-semibold block">Warning:</span>
                {hasChildren && (
                  <p>
                    • This category contains subcategories. Please reassign or
                    delete them first.
                  </p>
                )}
                {productCount > 0 && (
                  <p>
                    • There are {productCount} footwear products linked to this
                    category.
                  </p>
                )}
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
              "Yes, Delete Category"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
