"use client";

import { Switch } from "@/components/ui/switch";
import { updateCategory } from "@/services/category.services";
import { ICategory } from "@/types/category.types";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface CategoryStatusToggleProps {
  category: ICategory;
  onToggle: () => void;
}

export default function CategoryStatusToggle({
  category,
  onToggle,
}: CategoryStatusToggleProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [checked, setChecked] = useState(category.isActive);

  const handleToggle = async (newVal: boolean) => {
    try {
      setIsUpdating(true);
      setChecked(newVal);
      await updateCategory(category.id, { isActive: newVal });
      toast.success(
        `Category is now ${newVal ? "Active" : "Inactive"}`
      );
      onToggle();
    } catch (error: unknown) {
      setChecked(!newVal);
      const err = error as { message?: string };
      toast.error(err?.message || "Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={checked}
        onCheckedChange={handleToggle}
        disabled={isUpdating}
        className="cursor-pointer"
        aria-label={`Toggle active status for ${category.name}`}
      />
      <span className="text-[11px] font-medium text-muted-foreground w-12">
        {checked ? "Active" : "Hidden"}
      </span>
    </div>
  );
}
