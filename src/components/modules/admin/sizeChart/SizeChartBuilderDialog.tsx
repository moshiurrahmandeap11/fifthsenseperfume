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
import { Textarea } from "@/components/ui/textarea";
import {
  createSizeChart,
  updateSizeChart,
} from "@/services/sizeChart.services";
import { ISizeChart, ISizeChartRow } from "@/types/sizeChart.types";
import {
  SizeChartFormData,
  sizeChartFormSchema,
} from "@/zod/sizeChart.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, ImagePlus, Loader2, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import SizeChartRowEditor from "./SizeChartRowEditor";
import SizeChartVisualPreview from "./SizeChartVisualPreview";

interface SizeChartBuilderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: ISizeChart | null;
}

const DEFAULT_ROWS: ISizeChartRow[] = [
  { euSize: "39", ukSize: "5.5", usSize: "6.5", footLengthCm: 24.5, footLengthInch: 9.6 },
  { euSize: "40", ukSize: "6.5", usSize: "7.5", footLengthCm: 25.0, footLengthInch: 9.8 },
  { euSize: "41", ukSize: "7.5", usSize: "8.5", footLengthCm: 26.0, footLengthInch: 10.2 },
  { euSize: "42", ukSize: "8.0", usSize: "9.0", footLengthCm: 26.5, footLengthInch: 10.4 },
  { euSize: "43", ukSize: "9.0", usSize: "10.0", footLengthCm: 27.5, footLengthInch: 10.8 },
  { euSize: "44", ukSize: "9.5", usSize: "10.5", footLengthCm: 28.0, footLengthInch: 11.0 },
];

export default function SizeChartBuilderDialog({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: SizeChartBuilderDialogProps) {
  const isEditing = !!initialData;
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.guideImage || null
  );
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SizeChartFormData>({
    resolver: zodResolver(sizeChartFormSchema),
    defaultValues: {
      title: "",
      description: "",
      rows: DEFAULT_ROWS,
    },
  });

  const rows = watch("rows") || [];
  const currentTitle = watch("title");
  const currentDescription = watch("description");

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        description: initialData.description || "",
        rows:
          initialData.rows && initialData.rows.length > 0
            ? initialData.rows
            : DEFAULT_ROWS,
      });
      setImagePreview(initialData.guideImage || null);
    } else {
      reset({
        title: "",
        description: "",
        rows: DEFAULT_ROWS,
      });
      setImagePreview(null);
    }
    setImageFile(null);
  }, [initialData, reset, isOpen]);

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

  const onSubmit = async (data: SizeChartFormData) => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("title", data.title);
      if (data.description) formData.append("description", data.description);
      formData.append("rows", JSON.stringify(data.rows));

      if (imageFile) {
        formData.append("guideImage", imageFile);
      }

      if (isEditing && initialData) {
        await updateSizeChart(initialData.id, formData);
        toast.success("Size chart updated successfully");
      } else {
        await createSizeChart(formData);
        toast.success("Size chart created successfully");
      }

      onSuccess();
      onClose();
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err?.message || "Failed to save size chart");
    } finally {
      setIsLoading(false);
    }
  };

  // Construct preview chart object
  const previewChart: ISizeChart = {
    id: initialData?.id || "preview-id",
    title: currentTitle || "Footwear Size Chart Preview",
    description: currentDescription || null,
    guideImage: imagePreview,
    rows: rows,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-2xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Size Chart Matrix" : "Create Size Chart Matrix"}
            </DialogTitle>
            <DialogDescription>
              Build custom conversion table across EU, UK, US and Foot Length (CM/Inches).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
            {/* Title */}
            <div className="space-y-1.5">
              <Label htmlFor="chart-title">
                Chart Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="chart-title"
                placeholder="e.g. Men's Formal & Oxford Shoes Size Guide"
                disabled={isLoading}
                {...register("title")}
              />
              {errors.title && (
                <p className="text-xs text-destructive">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="chart-desc">Fitting Advice / Description</Label>
              <Textarea
                id="chart-desc"
                placeholder="e.g. Standard Bangladesh fit. If between sizes, choose one size up for wide feet."
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

            {/* Guide Image Upload */}
            <div className="space-y-1.5">
              <Label>Foot Measurement Guide Diagram (Optional)</Label>
              <div className="flex items-center gap-4">
                {imagePreview ? (
                  <div className="relative size-16 rounded-lg border overflow-hidden bg-muted">
                    <Image
                      src={imagePreview}
                      alt="Guide preview"
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
                    htmlFor="guide-image-input"
                    className="size-16 rounded-lg border border-dashed flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-primary transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <ImagePlus className="size-5" />
                    <span className="text-[9px] font-medium">Upload</span>
                    <input
                      id="guide-image-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                      disabled={isLoading}
                    />
                  </label>
                )}
                <div className="text-[11px] text-muted-foreground">
                  Diagram showing foot-length measuring technique for customers.
                </div>
              </div>
            </div>

            {/* Dynamic Row Editor */}
            <div className="pt-2">
              <SizeChartRowEditor
                rows={rows}
                onChange={(updatedRows) => setValue("rows", updatedRows)}
                disabled={isLoading}
              />
              {errors.rows && (
                <p className="text-xs text-destructive mt-1">
                  {errors.rows.message}
                </p>
              )}
            </div>

            <DialogFooter className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsPreviewOpen(true)}
                className="gap-1.5 text-xs cursor-pointer"
              >
                <Eye className="size-3.5 text-primary" />
                <span>Customer Live Preview</span>
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isLoading}
                  className="cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Saving...
                    </>
                  ) : isEditing ? (
                    "Update Size Chart"
                  ) : (
                    "Create Size Chart"
                  )}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Customer Preview Modal */}
      <SizeChartVisualPreview
        chart={previewChart}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </>
  );
}
