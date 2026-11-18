"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { createCategory, updateCategory } from "@/services/category.services";
import { ICategory } from "@/types/category.types";
import {
  CategoryFormData,
  categoryFormSchema,
} from "@/zod/category.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Loader2, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface CategoryFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: ICategory | null;
  parentCategories?: ICategory[];
  defaultParentId?: string | null;
}

export default function CategoryFormDialog({
  isOpen,
  onClose,
  onSuccess,
  initialData,
  parentCategories = [],
  defaultParentId = null,
}: CategoryFormDialogProps) {
  const isEditing = !!initialData;
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image || null
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      nameBn: "",
      parentId: defaultParentId,
      description: "",
      sortOrder: 0,
      isActive: true,
    },
  });

  const isActive = watch("isActive");
  const selectedParentId = watch("parentId");

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        nameBn: initialData.nameBn || "",
        parentId: initialData.parentId || null,
        description: initialData.description || "",
        sortOrder: initialData.sortOrder || 0,
        isActive: initialData.isActive,
      });
      setImagePreview(initialData.image || null);
    } else {
      reset({
        name: "",
        nameBn: "",
        parentId: defaultParentId,
        description: "",
        sortOrder: 0,
        isActive: true,
      });
      setImagePreview(null);
    }
    setImageFile(null);
  }, [initialData, defaultParentId, reset, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const onSubmit = async (data: CategoryFormData) => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("name", data.name.trim());
      if (data.nameBn?.trim()) formData.append("nameBn", data.nameBn.trim());
      if (data.description?.trim()) formData.append("description", data.description.trim());
      formData.append("sortOrder", String(data.sortOrder || 0));
      formData.append("isActive", String(data.isActive));

      if (data.parentId && data.parentId !== "none") {
        formData.append("parentId", data.parentId);
      }

      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (isEditing && initialData) {
        await updateCategory(initialData.id, formData);
        toast.success("Category updated successfully");
      } else {
        await createCategory(formData);
        toast.success("Category created successfully");
      }

      onSuccess();
      onClose();
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err?.message || "Failed to save category");
    } finally {
      setIsLoading(false);
    }
  };

  // Prevent selecting itself or its children as parent when editing
  const eligibleParents = parentCategories.filter(
    (c) => !initialData || c.id !== initialData.id
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Category" : "Add New Category"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update category details and hierarchy settings."
              : "Create a root or subcategory for footwear catalog organization."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Category Name */}
          <div className="space-y-1.5">
            <Label htmlFor="category-name">
              Category Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="category-name"
              placeholder="e.g. Formal Leather Shoes"
              disabled={isLoading}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Bengali Name (Optional for multilingual BD market) */}
          <div className="space-y-1.5">
            <Label htmlFor="category-name-bn">Name in Local Language (Optional)</Label>
            <Input
              id="category-name-bn"
              placeholder="e.g. Local translated title"
              disabled={isLoading}
              {...register("nameBn")}
            />
          </div>

          {/* Parent Category Selector */}
          <div className="space-y-1.5">
            <Label htmlFor="parent-category">Parent Category</Label>
            <Select
              value={selectedParentId || "none"}
              onValueChange={(val) =>
                setValue("parentId", val === "none" ? null : (val as string))
              }
              disabled={isLoading}
            >
              <SelectTrigger id="parent-category" className="w-full text-xs cursor-pointer">
                <SelectValue placeholder="Select Parent Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  None (Top-Level Root Category)
                </SelectItem>
                {eligibleParents.map((parent) => (
                  <SelectItem key={parent.id} value={parent.id}>
                    {parent.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category Image Upload & Preview */}
          <div className="space-y-1.5">
            <Label>Category Thumbnail / Banner</Label>
            <div className="flex items-center gap-4">
              {imagePreview ? (
                <div className="relative size-16 rounded-lg border overflow-hidden bg-muted">
                  <Image
                    src={imagePreview}
                    alt="Category preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-0.5 right-0.5 size-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center cursor-pointer shadow-xs"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="category-image-input"
                  className="size-16 rounded-lg border border-dashed flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-primary transition-colors text-muted-foreground hover:text-foreground"
                >
                  <ImagePlus className="size-5" />
                  <span className="text-[9px] font-medium">Upload</span>
                  <input
                    id="category-image-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                    disabled={isLoading}
                  />
                </label>
              )}
              <div className="text-[11px] text-muted-foreground">
                Square or horizontal thumbnail for store navigation (Max 2MB).
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="category-description">Description</Label>
            <Textarea
              id="category-description"
              placeholder="Brief description for SEO and category landing page..."
              rows={2}
              disabled={isLoading}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Sort Order & Active Switch */}
          <div className="grid grid-cols-2 gap-4 pt-1">
            <div className="space-y-1.5">
              <Label htmlFor="category-sort">Sort Priority</Label>
              <Input
                id="category-sort"
                type="number"
                min={0}
                placeholder="0"
                disabled={isLoading}
                {...register("sortOrder", { valueAsNumber: true })}
              />
            </div>

            <div className="flex flex-col justify-end space-y-1.5 pb-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="category-active" className="cursor-pointer">
                  Active Status
                </Label>
                <Switch
                  id="category-active"
                  checked={isActive}
                  onCheckedChange={(checked) => setValue("isActive", checked)}
                  disabled={isLoading}
                />
              </div>
              <span className="text-[10px] text-muted-foreground">
                Visible to customers on storefront
              </span>
            </div>
          </div>

          <DialogFooter className="pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="cursor-pointer">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                "Update Category"
              ) : (
                "Create Category"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
