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

const DEFAULT_FRAGRANCE_ROWS: ISizeChartRow[] = [
  { euSize: "100ml", ukSize: "Extrait 35%", usSize: "16+ Hours", footLengthCm: 1500, footLengthInch: 180 },
  { euSize: "50ml", ukSize: "Extrait 35%", usSize: "16+ Hours", footLengthCm: 750, footLengthInch: 90 },
  { euSize: "30ml", ukSize: "Extrait 35%", usSize: "16+ Hours", footLengthCm: 450, footLengthInch: 50 },
  { euSize: "10ml", ukSize: "Travel Flacon", usSize: "16+ Hours", footLengthCm: 150, footLengthInch: 18 },
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
      rows: DEFAULT_FRAGRANCE_ROWS,
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
            : DEFAULT_FRAGRANCE_ROWS,
      });
      setImagePreview(initialData.guideImage || null);
    } else {
      reset({
        title: "",
        description: "",
        rows: DEFAULT_FRAGRANCE_ROWS,
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
        toast.success("Volume guide updated");
      } else {
        await createSizeChart(formData);
        toast.success("Volume guide created");
      }

      onSuccess();
      onClose();
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err?.message || "Failed to save guide");
    } finally {
      setIsLoading(false);
    }
  };

  const previewChart: ISizeChart = {
    id: initialData?.id || "preview-id",
    title: currentTitle || "Flacon Volume Guide",
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
            <DialogTitle className="text-sm font-normal">
              {isEditing ? "Edit Volume Guide" : "Create Volume Guide"}
            </DialogTitle>
            <DialogDescription className="text-xs font-normal">
              Flacon size, concentration, and spray yields
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 pt-2">
            <div className="space-y-1">
              <Label htmlFor="chart-title" className="text-xs font-normal">
                Guide Title
              </Label>
              <Input
                id="chart-title"
                placeholder="e.g. Extrait de Parfum Volumetric & Longevity Guide"
                disabled={isLoading}
                className="text-xs h-9 font-normal"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-xs text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="chart-desc" className="text-xs font-normal">Sillage &amp; Longevity Notes</Label>
              <Textarea
                id="chart-desc"
                placeholder="Concentration notes, application tips, and sillage details"
                rows={2}
                disabled={isLoading}
                className="text-xs font-normal resize-none"
                {...register("description")}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-normal">Visual Guide Diagram (Optional)</Label>
              <div className="flex items-center gap-3">
                {imagePreview ? (
                  <div className="relative size-12 rounded border overflow-hidden bg-muted">
                    <Image
                      src={imagePreview}
                      alt="Guide"
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
                    htmlFor="guide-image-input"
                    className="size-12 rounded border border-dashed flex flex-col items-center justify-center cursor-pointer hover:border-foreground transition-colors text-muted-foreground"
                  >
                    <ImagePlus className="size-4" />
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
                <span className="text-[11px] text-muted-foreground font-normal">
                  Flacon proportion or spray diagram
                </span>
              </div>
            </div>

            {/* Dynamic Row Editor */}
            <div className="pt-1">
              <SizeChartRowEditor
                rows={rows}
                onChange={(updatedRows) => setValue("rows", updatedRows)}
                disabled={isLoading}
              />
              {errors.rows && (
                <p className="text-xs text-destructive mt-1 font-normal">
                  {errors.rows.message}
                </p>
              )}
            </div>

            <DialogFooter className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-border/40">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsPreviewOpen(true)}
                className="gap-1.5 text-xs font-normal cursor-pointer"
              >
                <Eye className="size-3 text-muted-foreground" />
                <span>Customer Preview</span>
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  disabled={isLoading}
                  className="text-xs font-normal"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isLoading}
                  className="text-xs font-normal cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : isEditing ? (
                    "Update Guide"
                  ) : (
                    "Save Guide"
                  )}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      <SizeChartVisualPreview
        chart={previewChart}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </>
  );
}
