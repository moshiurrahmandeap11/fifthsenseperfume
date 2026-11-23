"use client";

import { deleteMediaByUrl, uploadMultipleMedia, uploadSingleMedia } from "@/services/media.services";
import { ArrowLeft, ArrowRight, ImagePlus, Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";

interface ThumbnailDropzoneProps {
  value: string;
  onChange: (url: string) => void;
}

export function ThumbnailDropzone({ value, onChange }: ThumbnailDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files (JPG, PNG, WebP, SVG) are allowed");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await uploadSingleMedia(formData);
      if (res?.data?.url) {
        onChange(res.data.url);
        toast.success("Thumbnail uploaded");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to upload thumbnail");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      void handleFile(file);
    }
  };

  const handleRemove = async () => {
    const oldUrl = value;
    onChange("");
    if (oldUrl && oldUrl.includes("res.cloudinary.com")) {
      try {
        await deleteMediaByUrl(oldUrl);
      } catch {
        // Non-blocking cloud cleanup
      }
    }
  };

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            void handleFile(file);
          }
          e.target.value = "";
        }}
      />

      {value ? (
        <div className="relative group aspect-square w-full max-w-[240px] rounded-lg border border-border/60 overflow-hidden bg-muted/20">
          <Image
            src={value}
            alt="Fragrance thumbnail"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={isUploading}
              className="px-2.5 py-1.5 rounded bg-background/95 text-foreground text-xs font-normal hover:bg-background transition-colors cursor-pointer"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={isUploading}
              className="p-1.5 rounded bg-background/95 text-destructive hover:bg-background transition-colors cursor-pointer"
              aria-label="Remove thumbnail"
            >
              <X className="size-3.5" />
            </button>
          </div>
          {isUploading && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <Loader2 className="size-5 animate-spin text-foreground" />
            </div>
          )}
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={() => !isUploading && inputRef.current?.click()}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && !isUploading) {
              inputRef.current?.click();
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center aspect-square w-full max-w-[240px] rounded-lg border border-dashed transition-colors cursor-pointer p-4 text-center ${
            isDragging
              ? "border-foreground bg-muted/40"
              : "border-border hover:border-foreground/50 hover:bg-muted/20"
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Loader2 className="size-5 animate-spin" />
              <span className="text-xs font-normal">Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Upload className="size-5" />
              <div className="space-y-0.5">
                <p className="text-xs font-normal text-foreground">
                  Drop thumbnail or click
                </p>
                <p className="text-[11px] font-normal text-muted-foreground">
                  JPG, PNG, WebP (1:1 recommended)
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface GalleryDropzoneProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
}

export function GalleryDropzone({
  value,
  onChange,
  maxImages = 10,
}: GalleryDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList).filter((f) =>
      f.type.startsWith("image/")
    );

    if (files.length === 0) {
      toast.error("Please select valid image files");
      return;
    }

    const remainingSlots = maxImages - value.length;
    if (remainingSlots <= 0) {
      toast.error(`Maximum ${maxImages} gallery images allowed`);
      return;
    }

    const filesToUpload = files.slice(0, remainingSlots);
    if (files.length > remainingSlots) {
      toast(`Uploading first ${remainingSlots} image(s) only`);
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      filesToUpload.forEach((file) => {
        formData.append("files", file);
      });

      const res = await uploadMultipleMedia(formData);
      if (res?.data?.urls && res.data.urls.length > 0) {
        onChange([...value, ...res.data.urls]);
        toast.success(`${res.data.urls.length} image(s) added to gallery`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to upload images");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length > 0) {
      void handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemove = async (idx: number) => {
    const targetUrl = value[idx];
    const next = value.filter((_, i) => i !== idx);
    onChange(next);
    if (targetUrl && targetUrl.includes("res.cloudinary.com")) {
      try {
        await deleteMediaByUrl(targetUrl);
      } catch {
        // Non-blocking cloud cleanup
      }
    }
  };

  const handleMove = (idx: number, direction: -1 | 1) => {
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= value.length) return;
    const next = [...value];
    const temp = next[idx];
    next[idx] = next[targetIdx];
    next[targetIdx] = temp;
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            void handleFiles(e.target.files);
          }
          e.target.value = "";
        }}
      />

      <div
        role="button"
        tabIndex={0}
        onClick={() => !isUploading && inputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !isUploading) {
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center rounded-lg border border-dashed py-8 px-4 text-center transition-colors cursor-pointer ${
          isDragging
            ? "border-foreground bg-muted/40"
            : "border-border hover:border-foreground/50 hover:bg-muted/20"
        }`}
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" />
            <span className="text-xs font-normal">
              Uploading gallery images...
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <ImagePlus className="size-5" />
            <div className="space-y-0.5">
              <p className="text-xs font-normal text-foreground">
                Drag and drop multiple images here, or click to browse
              </p>
              <p className="text-[11px] font-normal text-muted-foreground">
                Up to {maxImages} images ({value.length}/{maxImages} uploaded)
              </p>
            </div>
          </div>
        )}
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {value.map((url, idx) => (
            <div
              key={`${url}-${idx}`}
              className="relative group aspect-square rounded-lg border border-border/60 overflow-hidden bg-muted/20"
            >
              <Image
                src={url}
                alt={`Gallery image ${idx + 1}`}
                fill
                className="object-cover"
              />
              <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-background/85 text-[10px] font-mono font-normal text-foreground">
                {String(idx + 1).padStart(2, "0")}
              </div>
              <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                {idx > 0 && (
                  <button
                    type="button"
                    onClick={() => handleMove(idx, -1)}
                    className="p-1 rounded bg-background/95 text-foreground hover:bg-background cursor-pointer"
                    aria-label="Move left"
                  >
                    <ArrowLeft className="size-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="p-1 rounded bg-background/95 text-destructive hover:bg-background cursor-pointer"
                  aria-label="Remove image"
                >
                  <X className="size-3.5" />
                </button>
                {idx < value.length - 1 && (
                  <button
                    type="button"
                    onClick={() => handleMove(idx, 1)}
                    className="p-1 rounded bg-background/95 text-foreground hover:bg-background cursor-pointer"
                    aria-label="Move right"
                  >
                    <ArrowRight className="size-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
