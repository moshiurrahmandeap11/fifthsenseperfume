"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { createProduct, updateProduct } from "@/services/product.services";
import { useQueryClient } from "@tanstack/react-query";
import { ICategory } from "@/types/category.types";
import {
  ICreateProductPayload,
  IProduct,
  IUpdateProductPayload,
  ProductGender,
  ProductStatus,
} from "@/types/product.types";
import { ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { GalleryDropzone, ThumbnailDropzone } from "./ImageUploadZone";

interface VariantRow {
  id?: string;
  size: string;
  sku: string;
  stockQuantity: string;
  priceOverride: string;
}

interface FragranceFormClientProps {
  categories: ICategory[];
  initialProduct?: IProduct;
}

export default function FragranceFormClient({
  categories,
  initialProduct,
}: FragranceFormClientProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEdit = Boolean(initialProduct);

  const specs = (initialProduct?.specifications || {}) as Record<
    string,
    string | undefined
  >;
  const primaryColor = initialProduct?.colors?.[0];

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Core Identity
  const [name, setName] = useState(initialProduct?.name || "");
  const [slug, setSlug] = useState(initialProduct?.slug || "");
  const [isSlugEdited, setIsSlugEdited] = useState(Boolean(initialProduct));

  const toSlug = (val: string) =>
    val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  const [styleCode, setStyleCode] = useState(
    initialProduct?.styleCode || `FS-${Date.now().toString().slice(-6)}`
  );
  const [shortDescription, setShortDescription] = useState(
    initialProduct?.shortDescription || ""
  );
  const [description, setDescription] = useState(
    initialProduct?.description || ""
  );

  // Olfactory Attributes
  const [concentration, setConcentration] = useState(
    specs.concentration || "Extrait de Parfum"
  );
  const [olfactiveFamily, setOlfactiveFamily] = useState(
    specs.olfactiveFamily || "Woody & Oriental"
  );
  const [topNotes, setTopNotes] = useState(
    specs.topNotes || "Bergamot, Pink Pepper"
  );
  const [heartNotes, setHeartNotes] = useState(
    specs.heartNotes || "Turkish Rose, Jasmine"
  );
  const [baseNotes, setBaseNotes] = useState(
    specs.baseNotes || "Amber, Agarwood"
  );

  // Media
  const [thumbnailUrl, setThumbnailUrl] = useState(
    initialProduct?.thumbnailUrl || ""
  );
  const [galleryImages, setGalleryImages] = useState<string[]>(
    primaryColor?.images || []
  );

  // Pricing
  const [costPrice, setCostPrice] = useState(
    initialProduct?.costPrice !== undefined
      ? String(initialProduct.costPrice)
      : "1800"
  );
  const [basePrice, setBasePrice] = useState(
    initialProduct?.basePrice !== undefined
      ? String(initialProduct.basePrice)
      : "4500"
  );
  const [discountPrice, setDiscountPrice] = useState(
    initialProduct?.discountPrice !== null &&
      initialProduct?.discountPrice !== undefined
      ? String(initialProduct.discountPrice)
      : ""
  );

  // Categorization & Visibility
  const [categoryId, setCategoryId] = useState(
    initialProduct?.categoryId || categories[0]?.id || ""
  );
  const [gender, setGender] = useState<ProductGender>(
    initialProduct?.gender || "UNISEX"
  );
  const [status, setStatus] = useState<ProductStatus>(
    initialProduct?.status || "PUBLISHED"
  );
  const [isFeatured, setIsFeatured] = useState(
    initialProduct?.isFeatured ?? false
  );
  const [isNewArrival, setIsNewArrival] = useState(
    initialProduct?.isNewArrival ?? true
  );
  const [isBestSeller, setIsBestSeller] = useState(
    initialProduct?.isBestSeller ?? false
  );

  const strengthLabels: Record<string, string> = {
    "Extrait de Parfum": "Extra Strong (Extrait / 30%+ Oil)",
    "Eau de Parfum": "Long Lasting (EDP / 18-20% Oil)",
    "Eau de Toilette": "Light & Fresh (EDT / 10-12% Oil)",
    "Attar / Oil": "Pure Attar / Oil (Alcohol-Free)",
  };

  const familyLabels: Record<string, string> = {
    "Woody & Oriental": "Woody & Spicy (Oud, Amber)",
    "Floral Atelier": "Floral (Rose, Jasmine)",
    "Fresh & Citrus": "Fresh & Citrus (Lemon, Aqua)",
    "Gourmand & Spiced": "Sweet & Vanilla",
  };

  const statusLabels: Record<ProductStatus, string> = {
    PUBLISHED: "Published",
    DRAFT: "Draft",
    ARCHIVED: "Archived",
  };

  const genderLabels: Record<ProductGender, string> = {
    UNISEX: "Unisex (Everyone)",
    MEN: "Men",
    WOMEN: "Women",
    KIDS: "Kids",
  };

  const selectedCategoryName = categories.find((c) => c.id === categoryId)?.name;
  const [variants, setVariants] = useState<VariantRow[]>(() => {
    if (primaryColor?.variants && primaryColor.variants.length > 0) {
      return primaryColor.variants.map((v) => ({
        id: v.id,
        size: v.size,
        sku: v.sku,
        stockQuantity: String(v.stockQuantity),
        priceOverride:
          v.priceOverride !== null && v.priceOverride !== undefined
            ? String(v.priceOverride)
            : "",
      }));
    }
    return [
      {
        size: "50ml",
        sku: "",
        stockQuantity: "40",
        priceOverride: "",
      },
      {
        size: "100ml",
        sku: "",
        stockQuantity: "25",
        priceOverride: "",
      },
    ];
  });

  const handleAddVariant = () => {
    setVariants((prev) => [
      ...prev,
      { size: "", sku: "", stockQuantity: "10", priceOverride: "" },
    ]);
  };

  const handleRemoveVariant = (index: number) => {
    if (variants.length <= 1) {
      toast.error("At least one volume variant is required");
      return;
    }
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVariantChange = (
    index: number,
    field: keyof VariantRow,
    val: string
  ) => {
    setVariants((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: val } : row))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || name.trim().length < 3) {
      toast.error("Fragrance name must be at least 3 characters");
      return;
    }

    if (!description.trim() || description.trim().length < 10) {
      toast.error("Description must be at least 10 characters");
      return;
    }

    if (!categoryId) {
      toast.error("Please select a fragrance collection / category");
      return;
    }

    if (!thumbnailUrl && galleryImages.length === 0) {
      toast.error("Please upload a thumbnail or at least one gallery image");
      return;
    }

    const validVariants = variants.filter((v) => v.size.trim().length > 0);
    if (validVariants.length === 0) {
      toast.error("Please provide at least one volume size (e.g. 50ml)");
      return;
    }

    const resolvedThumbnail = thumbnailUrl || galleryImages[0];
    const resolvedGallery =
      galleryImages.length > 0 ? galleryImages : [resolvedThumbnail];

    const parsedBasePrice = parseFloat(basePrice) || 0;
    const parsedCostPrice = parseFloat(costPrice) || 0;
    const parsedDiscountPrice = discountPrice.trim()
      ? parseFloat(discountPrice)
      : undefined;

    const generatedSlug =
      slug.trim() ||
      name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const colorPayload = {
      ...(primaryColor?.id ? { id: primaryColor.id } : {}),
      colorName: primaryColor?.colorName || "Signature Flacon",
      images: resolvedGallery,
      isDefault: true,
      variants: validVariants.map((v) => ({
        ...(v.id ? { id: v.id } : {}),
        size: v.size.trim(),
        ...(v.sku.trim() ? { sku: v.sku.trim() } : {}),
        stockQuantity: Math.max(0, parseInt(v.stockQuantity, 10) || 0),
        lowStockThreshold: 5,
        ...(v.priceOverride.trim()
          ? { priceOverride: parseFloat(v.priceOverride) }
          : {}),
      })),
    };

    try {
      setIsSubmitting(true);

      const basePayload = {
        name: name.trim(),
        slug: generatedSlug,
        styleCode: styleCode.trim(),
        shortDescription: shortDescription.trim() || undefined,
        description: description.trim(),
        costPrice: parsedCostPrice,
        basePrice: parsedBasePrice,
        ...(parsedDiscountPrice !== undefined
          ? { discountPrice: parsedDiscountPrice }
          : {}),
        thumbnailUrl: resolvedThumbnail,
        categoryId,
        gender,
        status,
        isFeatured,
        isNewArrival,
        isBestSeller,
        specifications: {
          concentration,
          olfactiveFamily,
          topNotes,
          heartNotes,
          baseNotes,
          volumesAvailable: validVariants.map((v) => v.size.trim()),
        },
        colors: [colorPayload],
      };

      if (isEdit && initialProduct) {
        await updateProduct(
          initialProduct.id,
          basePayload as unknown as IUpdateProductPayload
        );
        toast.success(`Fragrance '${name}' updated`);
      } else {
        await createProduct(basePayload as unknown as ICreateProductPayload);
        toast.success(`Fragrance '${name}' created`);
      }

      await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save fragrance"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border/60">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="inline-flex items-center justify-center size-8 rounded-md border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
            aria-label="Back to catalog"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <h1 className="text-base font-normal tracking-wide uppercase text-foreground">
              {isEdit ? "Edit Perfume" : "Add New Perfume"}
            </h1>
            <p className="text-xs font-normal text-muted-foreground">
              {isEdit
                ? `Editing product ${initialProduct?.styleCode}`
                : "Add a new perfume with images, bottle sizes, and stock"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/admin/products">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs font-normal cursor-pointer"
            >
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting}
            className="h-8 px-4 text-xs font-normal cursor-pointer gap-1.5"
          >
            {isSubmitting && <Loader2 className="size-3.5 animate-spin" />}
            <span>
              {isSubmitting
                ? "Saving..."
                : isEdit
                ? "Save Changes"
                : "Save Perfume"}
            </span>
          </Button>
        </div>
      </div>

      {/* Main Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Information */}
          <Card className="p-5 shadow-none border border-border/60 space-y-4">
            <h2 className="text-xs font-normal uppercase tracking-wider text-muted-foreground">
              General Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-normal">Fragrance Name</Label>
                <Input
                  value={name}
                  onChange={(e) => {
                    const nextName = e.target.value;
                    setName(nextName);
                    if (!isSlugEdited) {
                      setSlug(toSlug(nextName));
                    }
                  }}
                  placeholder="e.g. Amber Nuit Extrait"
                  className="h-9 text-xs font-normal"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-normal">Style / Batch Code</Label>
                <Input
                  value={styleCode}
                  onChange={(e) => setStyleCode(e.target.value)}
                  placeholder="e.g. FS-101"
                  className="h-9 text-xs font-mono font-normal"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-normal">URL Slug</Label>
                <Input
                  value={slug}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSlug(val);
                    setIsSlugEdited(val.trim().length > 0);
                  }}
                  placeholder="auto-generated from name"
                  className="h-9 text-xs font-mono font-normal"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-normal">Short Subtitle</Label>
                <Input
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="e.g. Warm ambergris & spiced rose"
                  className="h-9 text-xs font-normal"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-normal">
                Product Description
              </Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write about the scent, how long it lasts, and who it is best for..."
                className="text-xs font-normal min-h-[110px]"
                required
              />
            </div>
          </Card>

          {/* Media & Imagery */}
          <Card className="p-5 shadow-none border border-border/60 space-y-5">
            <div className="space-y-1">
              <h2 className="text-xs font-normal uppercase tracking-wider text-muted-foreground">
                Product Images
              </h2>
              <p className="text-xs font-normal text-muted-foreground">
                Upload a main thumbnail for product cards and multiple gallery photos for the product page.
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-normal">
                Thumbnail Image (Primary)
              </Label>
              <ThumbnailDropzone
                value={thumbnailUrl}
                onChange={setThumbnailUrl}
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-border/40">
              <Label className="text-xs font-normal">
                Gallery Images (Multiple)
              </Label>
              <GalleryDropzone
                value={galleryImages}
                onChange={setGalleryImages}
                maxImages={10}
              />
            </div>
          </Card>

          {/* Perfume Details & Notes */}
          <Card className="p-5 shadow-none border border-border/60 space-y-4">
            <h2 className="text-xs font-normal uppercase tracking-wider text-muted-foreground">
              Perfume Type &amp; Scent Notes
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-normal">Perfume Strength</Label>
                <Select
                  value={concentration}
                  onValueChange={(val) => val && setConcentration(val)}
                >
                  <SelectTrigger className="w-full h-9 text-xs font-normal">
                    <SelectValue>
                      {strengthLabels[concentration] || concentration}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Extrait de Parfum">
                      Extra Strong (Extrait / 30%+ Oil)
                    </SelectItem>
                    <SelectItem value="Eau de Parfum">
                      Long Lasting (EDP / 18-20% Oil)
                    </SelectItem>
                    <SelectItem value="Eau de Toilette">
                      Light &amp; Fresh (EDT / 10-12% Oil)
                    </SelectItem>
                    <SelectItem value="Attar / Oil">
                      Pure Attar / Oil (Alcohol-Free)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-normal">Scent Category</Label>
                <Select
                  value={olfactiveFamily}
                  onValueChange={(val) => val && setOlfactiveFamily(val)}
                >
                  <SelectTrigger className="w-full h-9 text-xs font-normal">
                    <SelectValue>
                      {familyLabels[olfactiveFamily] || olfactiveFamily}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Woody & Oriental">
                      Woody &amp; Spicy (Oud, Amber)
                    </SelectItem>
                    <SelectItem value="Floral Atelier">
                      Floral (Rose, Jasmine)
                    </SelectItem>
                    <SelectItem value="Fresh & Citrus">
                      Fresh &amp; Citrus (Lemon, Aqua)
                    </SelectItem>
                    <SelectItem value="Gourmand & Spiced">
                      Sweet &amp; Vanilla
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-normal">First Scent (Top Notes)</Label>
                <Input
                  value={topNotes}
                  onChange={(e) => setTopNotes(e.target.value)}
                  className="h-9 text-xs font-normal"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-normal">Main Scent (Middle Notes)</Label>
                <Input
                  value={heartNotes}
                  onChange={(e) => setHeartNotes(e.target.value)}
                  className="h-9 text-xs font-normal"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-normal">Lasting Scent (Base Notes)</Label>
                <Input
                  value={baseNotes}
                  onChange={(e) => setBaseNotes(e.target.value)}
                  className="h-9 text-xs font-normal"
                />
              </div>
            </div>
          </Card>

          {/* Volumes & Stock Variants */}
          <Card className="p-5 shadow-none border border-border/60 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-normal uppercase tracking-wider text-muted-foreground">
                Bottle Sizes &amp; Stock
              </h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddVariant}
                className="h-7 px-2.5 text-xs font-normal gap-1 cursor-pointer"
              >
                <Plus className="size-3.5" />
                <span>Add Size</span>
              </Button>
            </div>

            <div className="space-y-3">
              {variants.map((variant, idx) => (
                <div
                  key={variant.id || `variant-${idx}`}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end p-3 rounded-md border border-border/50 bg-muted/10"
                >
                  <div className="sm:col-span-3 space-y-1">
                    <Label className="text-[11px] font-normal text-muted-foreground">
                      Bottle Size
                    </Label>
                    <Input
                      value={variant.size}
                      onChange={(e) =>
                        handleVariantChange(idx, "size", e.target.value)
                      }
                      placeholder="e.g. 50ml"
                      className="h-8 text-xs font-normal"
                      required
                    />
                  </div>

                  <div className="sm:col-span-3 space-y-1">
                    <Label className="text-[11px] font-normal text-muted-foreground">
                      SKU (Optional)
                    </Label>
                    <Input
                      value={variant.sku}
                      onChange={(e) =>
                        handleVariantChange(idx, "sku", e.target.value)
                      }
                      placeholder="Auto-generated"
                      className="h-8 text-xs font-mono font-normal"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <Label className="text-[11px] font-normal text-muted-foreground">
                      Stock
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      value={variant.stockQuantity}
                      onChange={(e) =>
                        handleVariantChange(idx, "stockQuantity", e.target.value)
                      }
                      className="h-8 text-xs font-normal tabular-nums"
                      required
                    />
                  </div>

                  <div className="sm:col-span-3 space-y-1">
                    <Label className="text-[11px] font-normal text-muted-foreground">
                      Price Override (BDT)
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      value={variant.priceOverride}
                      onChange={(e) =>
                        handleVariantChange(idx, "priceOverride", e.target.value)
                      }
                      placeholder="Default base price"
                      className="h-8 text-xs font-normal tabular-nums"
                    />
                  </div>

                  <div className="sm:col-span-1 flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveVariant(idx)}
                      className="size-8 p-0 text-muted-foreground hover:text-destructive cursor-pointer"
                      aria-label="Remove variant"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-6">
          {/* Status & Organization */}
          <Card className="p-5 shadow-none border border-border/60 space-y-4">
            <h2 className="text-xs font-normal uppercase tracking-wider text-muted-foreground">
              Organization &amp; Status
            </h2>

            <div className="space-y-1.5">
              <Label className="text-xs font-normal">Status</Label>
              <Select
                value={status}
                onValueChange={(val) => val && setStatus(val as ProductStatus)}
              >
                <SelectTrigger className="w-full h-9 text-xs font-normal">
                  <SelectValue>
                    {statusLabels[status] || status}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-normal">
                Category
              </Label>
              {categories.length === 0 ? (
                <div className="p-2.5 rounded border border-border/60 text-xs font-normal text-muted-foreground">
                  No categories found.{" "}
                  <Link
                    href="/admin/categories"
                    className="underline text-foreground"
                  >
                    Create one first
                  </Link>
                  .
                </div>
              ) : (
                <Select
                  value={categoryId}
                  onValueChange={(val) => val && setCategoryId(val)}
                >
                  <SelectTrigger className="w-full h-9 text-xs font-normal">
                    <SelectValue placeholder="Select category">
                      {selectedCategoryName || "Select category"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-normal">Gender / For</Label>
              <Select
                value={gender}
                onValueChange={(val) => val && setGender(val as ProductGender)}
              >
                <SelectTrigger className="w-full h-9 text-xs font-normal">
                  <SelectValue>
                    {genderLabels[gender] || gender}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UNISEX">Unisex (Everyone)</SelectItem>
                  <SelectItem value="MEN">Men</SelectItem>
                  <SelectItem value="WOMEN">Women</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Pricing */}
          <Card className="p-5 shadow-none border border-border/60 space-y-4">
            <h2 className="text-xs font-normal uppercase tracking-wider text-muted-foreground">
              Pricing (BDT)
            </h2>

            <div className="space-y-1.5">
              <Label className="text-xs font-normal">Base Price</Label>
              <Input
                type="number"
                min="0"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                className="h-9 text-xs font-normal tabular-nums"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-normal">
                Sale / Discount Price (Optional)
              </Label>
              <Input
                type="number"
                min="0"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                placeholder="Leave blank if no discount"
                className="h-9 text-xs font-normal tabular-nums"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-normal">
                Production / Cost Price
              </Label>
              <Input
                type="number"
                min="0"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                className="h-9 text-xs font-normal tabular-nums"
                required
              />
            </div>
          </Card>

          {/* Merchandising Flags */}
          <Card className="p-5 shadow-none border border-border/60 space-y-4">
            <h2 className="text-xs font-normal uppercase tracking-wider text-muted-foreground">
              Merchandising
            </h2>

            <div className="flex items-center justify-between">
              <Label className="text-xs font-normal">Featured Fragrance</Label>
              <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-xs font-normal">New Arrival</Label>
              <Switch
                checked={isNewArrival}
                onCheckedChange={setIsNewArrival}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-xs font-normal">Best Seller</Label>
              <Switch
                checked={isBestSeller}
                onCheckedChange={setIsBestSeller}
              />
            </div>
          </Card>
        </div>
      </div>
    </form>
  );
}
