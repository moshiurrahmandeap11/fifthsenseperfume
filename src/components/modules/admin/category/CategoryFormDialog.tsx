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
        toast.success("Category updated");
      } else {
        await createCategory(formData);
        toast.success("Category created");
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

  const eligibleParents = parentCategories.filter(
    (c) => !initialData || c.id !== initialData.id
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm font-normal">
            {isEditing ? "Edit Category" : "Add Category"}
          </DialogTitle>
          <DialogDescription className="text-xs font-normal">
            Category details and hierarchy
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 pt-2">
          <div className="space-y-1">
            <Label htmlFor="category-name" className="text-xs font-normal">
              Category Name
            </Label>
            <Input
              id="category-name"
              placeholder="e.g. Woody & Oriental"
              disabled={isLoading}
              className="text-xs h-9 font-normal"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="category-name-bn" className="text-xs font-normal">
              Local Name (Optional)
            </Label>
            <Input
              id="category-name-bn"
              placeholder="Local name"
              disabled={isLoading}
              className="text-xs h-9 font-normal"
              {...register("nameBn")}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="parent-category" className="text-xs font-normal">
              Parent Category
            </Label>
            <Select
              value={selectedParentId || "none"}
              onValueChange={(val) =>
                setValue("parentId", val === "none" ? null : (val as string))
              }
              disabled={isLoading}
            >
              <SelectTrigger id="parent-category" className="w-full text-xs h-9 font-normal">
                <SelectValue placeholder="Select Parent Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none" className="text-xs font-normal">
                  None (Root Category)
                </SelectItem>
                {eligibleParents.map((parent) => (
                  <SelectItem key={parent.id} value={parent.id} className="text-xs font-normal">
                    {parent.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-normal">Category Thumbnail</Label>
            <div className="flex items-center gap-3">
              {imagePreview ? (
                <div className="relative size-12 rounded border overflow-hidden bg-muted">
                  <Image
                    src={imagePreview}
                    alt="Category"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-0.5 right-0.5 size-4 bg-foreground/70 text-background rounded-full flex items-center justify-center cursor-pointer"
                  >
                    <X className="size-2.5" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="category-image-input"
                  className="size-12 rounded border border-dashed flex flex-col items-center justify-center cursor-pointer hover:border-foreground transition-colors text-muted-foreground"
                >
                  <ImagePlus className="size-4" />
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
              <span className="text-[11px] text-muted-foreground font-normal">
                Optional image thumbnail
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="category-description" className="text-xs font-normal">
              Description (Optional)
            </Label>
            <Textarea
              id="category-description"
              placeholder="Short description"
              rows={2}
              disabled={isLoading}
              className="text-xs font-normal resize-none"
              {...register("description")}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <Label htmlFor="category-sort" className="text-xs font-normal">
                Sort Order
              </Label>
              <Input
                id="category-sort"
                type="number"
                min={0}
                placeholder="0"
                disabled={isLoading}
                className="text-xs h-9 font-normal"
                {...register("sortOrder", { valueAsNumber: true })}
              />
            </div>

            <div className="flex flex-col justify-end space-y-1 pb-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="category-active" className="text-xs font-normal cursor-pointer">
                  Active
                </Label>
                <Switch
                  id="category-active"
                  checked={isActive}
                  onCheckedChange={(checked) => setValue("isActive", checked)}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
              className="text-xs font-normal"
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isLoading} className="text-xs font-normal cursor-pointer">
              {isLoading ? (
                <>
                  <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                "Update Category"
              ) : (
                "Save Category"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
