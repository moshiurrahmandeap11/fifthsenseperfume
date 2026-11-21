"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { createProduct, deleteProduct } from "@/services/product.services";
import { ICreateProductPayload, IProduct } from "@/types/product.types";
import {
  Droplets,
  Eye,
  Layers,
  Plus,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";

interface FragranceCatalogClientProps {
  initialProducts: IProduct[];
}

export default function FragranceCatalogClient({
  initialProducts,
}: FragranceCatalogClientProps) {
  const [products, setProducts] = useState<IProduct[]>(initialProducts || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFamily, setSelectedFamily] = useState("ALL");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [description, setDescription] = useState("");
  const [concentration, setConcentration] = useState("Extrait de Parfum");
  const [olfactiveFamily, setOlfactiveFamily] = useState("Woody & Oriental");
  const [topNotes, setTopNotes] = useState("Bergamot, Pink Pepper");
  const [heartNotes, setHeartNotes] = useState("Turkish Rose, Jasmine, Cedar");
  const [baseNotes, setBaseNotes] = useState("Madagascar Vanilla, Amber, Agarwood");
  const [basePrice, setBasePrice] = useState("4500");
  const [discountPrice, setDiscountPrice] = useState("3800");
  const [thumbnailUrl, setThumbnailUrl] = useState("https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&auto=format&fit=crop");

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [products, searchQuery]);

  const handleCreateFragrance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !basePrice) {
      toast.error("Please fill in fragrance name and base price");
      return;
    }

    try {
      setIsSubmitting(true);
      const generatedSlug =
        slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const styleCode = `FS-${Date.now().toString().slice(-6)}`;

      const payload = {
        name,
        slug: generatedSlug,
        styleCode,
        shortDescription: shortDesc,
        description: `${description}\n\nOlfactive Pyramid:\n• Top Notes: ${topNotes}\n• Heart Notes: ${heartNotes}\n• Base Notes: ${baseNotes}`,
        basePrice: parseFloat(basePrice),
        discountPrice: discountPrice ? parseFloat(discountPrice) : undefined,
        costPrice: parseFloat(basePrice) * 0.4,
        thumbnailUrl: thumbnailUrl || "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&auto=format&fit=crop",
        status: "PUBLISHED",
        specifications: {
          concentration,
          olfactiveFamily,
          topNotes,
          heartNotes,
          baseNotes,
          volumesAvailable: ["30ml", "50ml", "100ml"],
        },
        colors: [
          {
            colorName: "Signature Flacon",
            images: [thumbnailUrl],
            isDefault: true,
            variants: [
              {
                size: "100ml",
                sku: `${styleCode}-100ML`,
                stockQuantity: 25,
                lowStockThreshold: 5,
              },
              {
                size: "50ml",
                sku: `${styleCode}-50ML`,
                stockQuantity: 40,
                lowStockThreshold: 8,
              },
            ],
          },
        ],
      };

      const res = await createProduct(payload as unknown as ICreateProductPayload);
      if (res?.data) {
        setProducts((prev) => [res.data, ...prev]);
        toast.success(`Fragrance '${name}' created successfully!`);
        setIsCreateOpen(false);
        // Reset form
        setName("");
        setSlug("");
        setShortDesc("");
        setDescription("");
      }
    } catch {
      toast.error("Failed to create fragrance");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, fragName: string) => {
    if (!confirm(`Are you sure you want to remove '${fragName}' from catalog?`)) return;

    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Fragrance archived from catalog");
    } catch {
      toast.error("Failed to delete fragrance");
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="size-4 text-muted-foreground absolute left-3 top-2.5" />
          <Input
            placeholder="Search fragrances, extrait, note..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        <Button
          size="sm"
          onClick={() => setIsCreateOpen(true)}
          className="h-9 px-3.5 text-xs gap-1.5 cursor-pointer bg-primary text-primary-foreground"
        >
          <Plus className="size-4" />
          <span>Add New Fragrance</span>
        </Button>
      </div>

      {/* 2. Fragrances Table */}
      <Card className="shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="text-xs font-semibold">Fragrance</TableHead>
              <TableHead className="text-xs font-semibold">Concentration</TableHead>
              <TableHead className="text-xs font-semibold">Base Price</TableHead>
              <TableHead className="text-xs font-semibold">Sale Price</TableHead>
              <TableHead className="text-xs font-semibold">Status</TableHead>
              <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-44 text-center text-xs text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <Droplets className="size-8 text-muted-foreground/40 mb-1" />
                    <p className="font-semibold text-foreground">No fragrances in catalog</p>
                    <p className="text-[11px] max-w-sm">
                      Click &quot;Add New Fragrance&quot; above to create your first artisanal perfume formulation.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((p) => (
                <TableRow key={p.id} className="hover:bg-muted/20">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="size-11 rounded-lg bg-muted border overflow-hidden shrink-0 relative">
                        <Image
                          src={p.thumbnailUrl || "/navbar/fifthsenselogo.png"}
                          alt={p.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-xs text-foreground">
                          {p.name}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          SKU: {p.styleCode}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30">
                      {(p.specifications as any)?.concentration || "Extrait de Parfum"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs font-semibold text-foreground">
                    BDT {p.basePrice?.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-xs font-semibold text-emerald-600">
                    {p.discountPrice ? `BDT ${p.discountPrice.toLocaleString()}` : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${
                        p.status === "PUBLISHED"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(p.id, p.name)}
                        className="size-7 p-0 text-muted-foreground hover:text-rose-600 cursor-pointer"
                        title="Delete Fragrance"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* 3. Create Fragrance Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              <span>Add New Luxury Fragrance</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Formulate a new perfume profile with olfactive notes, flacon volumes, and pricing
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateFragrance} className="space-y-4 py-2 text-xs">
            {/* Name & Slug */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="fragName" className="text-xs">Fragrance Title</Label>
                <Input
                  id="fragName"
                  placeholder="e.g. Royal Oud Extrait"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-8 text-xs"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="fragSlug" className="text-xs">URL Slug</Label>
                <Input
                  id="fragSlug"
                  placeholder="e.g. royal-oud-extrait"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            {/* Concentration & Olfactory Family */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Concentration</Label>
                <Select value={concentration} onValueChange={(val) => val && setConcentration(val)}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Extrait de Parfum">Extrait de Parfum (30%+)</SelectItem>
                    <SelectItem value="Eau de Parfum">Eau de Parfum (18-20%)</SelectItem>
                    <SelectItem value="Eau de Toilette">Eau de Toilette (10-12%)</SelectItem>
                    <SelectItem value="Attar / Oil">Pure Attar Perfume Oil</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Olfactory Family</Label>
                <Select value={olfactiveFamily} onValueChange={(val) => val && setOlfactiveFamily(val)}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Woody & Oriental">Woody &amp; Oriental</SelectItem>
                    <SelectItem value="Floral Atelier">Floral Atelier</SelectItem>
                    <SelectItem value="Fresh & Citrus">Fresh &amp; Citrus</SelectItem>
                    <SelectItem value="Gourmand & Amber">Gourmand &amp; Amber</SelectItem>
                    <SelectItem value="Smoky Leather">Smoky Leather &amp; Spices</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Fragrance Notes */}
            <div className="p-3 rounded-xl bg-muted/30 border space-y-2">
              <span className="font-bold text-foreground">Olfactive Pyramid Notes:</span>
              <div className="space-y-2">
                <div>
                  <Label className="text-[11px] text-muted-foreground">Top Notes (Opening):</Label>
                  <Input
                    value={topNotes}
                    onChange={(e) => setTopNotes(e.target.value)}
                    placeholder="e.g. Italian Bergamot, Pink Pepper, Saffron"
                    className="h-8 text-xs bg-background"
                  />
                </div>
                <div>
                  <Label className="text-[11px] text-muted-foreground">Heart Notes (Character):</Label>
                  <Input
                    value={heartNotes}
                    onChange={(e) => setHeartNotes(e.target.value)}
                    placeholder="e.g. Taif Rose, Orris Root, Jasmine Absolute"
                    className="h-8 text-xs bg-background"
                  />
                </div>
                <div>
                  <Label className="text-[11px] text-muted-foreground">Base Notes (Drydown):</Label>
                  <Input
                    value={baseNotes}
                    onChange={(e) => setBaseNotes(e.target.value)}
                    placeholder="e.g. Aged Agarwood, Ambergris, Bourbon Vanilla"
                    className="h-8 text-xs bg-background"
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Base Price (BDT)</Label>
                <Input
                  type="number"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  className="h-8 text-xs"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Sale Discount Price (Optional)</Label>
                <Input
                  type="number"
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            {/* Thumbnail URL */}
            <div className="space-y-1">
              <Label className="text-xs">Flacon Thumbnail Image URL</Label>
              <Input
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="https://..."
                className="h-8 text-xs"
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <Label className="text-xs">Artisanal Story / Description</Label>
              <Textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="The inspiration, olfactory mood, and artisanal formulation of this perfume..."
                className="text-xs"
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsCreateOpen(false)}
                className="h-8 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="h-8 text-xs"
              >
                {isSubmitting ? "Creating..." : "Save Fragrance"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
