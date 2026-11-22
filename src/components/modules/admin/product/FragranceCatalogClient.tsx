"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
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
import { Plus, Search, Trash2 } from "lucide-react";
import Image from "next/image";
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
  const [heartNotes, setHeartNotes] = useState("Turkish Rose, Jasmine");
  const [baseNotes, setBaseNotes] = useState("Amber, Agarwood");
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
        description: `${description}\n\nTop: ${topNotes} | Heart: ${heartNotes} | Base: ${baseNotes}`,
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
        toast.success(`Fragrance '${name}' created`);
        setIsCreateOpen(false);
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

  const handleDeleteFragrance = async (id: string, fragName: string) => {
    if (!confirm(`Delete fragrance '${fragName}'?`)) return;

    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Fragrance deleted");
    } catch {
      toast.error("Failed to delete fragrance");
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            placeholder="Search fragrance or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 text-xs h-8 bg-background font-normal"
          />
        </div>

        <Button
          size="sm"
          onClick={() => setIsCreateOpen(true)}
          className="h-8 px-3 text-xs gap-1.5 cursor-pointer font-normal"
        >
          <Plus className="size-3.5" />
          <span>Add Fragrance</span>
        </Button>
      </div>

      {/* Fragrances Table */}
      <Card className="shadow-none border border-border/60 overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="text-xs font-normal">Fragrance</TableHead>
              <TableHead className="text-xs font-normal">Concentration</TableHead>
              <TableHead className="text-xs font-normal text-right">Base Price</TableHead>
              <TableHead className="text-xs font-normal text-right">Sale Price</TableHead>
              <TableHead className="text-xs font-normal">Status</TableHead>
              <TableHead className="text-xs font-normal text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-36 text-center text-xs font-normal text-muted-foreground">
                  No fragrances found in catalog
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((p) => (
                <TableRow key={p.id} className="hover:bg-muted/20 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded border overflow-hidden shrink-0 relative bg-muted">
                        <Image
                          src={p.thumbnailUrl || "/navbar/fifthsenselogo.png"}
                          alt={p.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-xs font-normal text-foreground">
                          {p.name}
                        </div>
                        <div className="text-[11px] font-mono font-normal text-muted-foreground">
                          {p.styleCode}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] font-normal">
                      {(p.specifications as unknown as { concentration?: string })?.concentration || "Extrait de Parfum"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs font-normal text-foreground text-right tabular-nums">
                    BDT {p.basePrice?.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-xs font-normal text-muted-foreground text-right tabular-nums">
                    {p.discountPrice ? `BDT ${p.discountPrice.toLocaleString()}` : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal text-[10px]">
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteFragrance(p.id, p.name)}
                      className="size-7 p-0 cursor-pointer text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Add Fragrance Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-sm font-normal">
              New Fragrance Formulation
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateFragrance} className="space-y-3 py-2 text-xs font-normal">
            <div className="space-y-1">
              <Label className="text-xs font-normal">Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Amber Nuit Extrait"
                className="h-8 text-xs font-normal"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-normal">Base Price (BDT)</Label>
                <Input
                  type="number"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  className="h-8 text-xs font-normal"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-normal">Sale Price (BDT)</Label>
                <Input
                  type="number"
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(e.target.value)}
                  className="h-8 text-xs font-normal"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-normal">Concentration</Label>
                <Select value={concentration} onValueChange={(val) => val && setConcentration(val)}>
                  <SelectTrigger className="h-8 text-xs font-normal">
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
                <Label className="text-xs font-normal">Olfactory Family</Label>
                <Select value={olfactiveFamily} onValueChange={(val) => val && setOlfactiveFamily(val)}>
                  <SelectTrigger className="h-8 text-xs font-normal">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Woody & Oriental">Woody &amp; Oriental</SelectItem>
                    <SelectItem value="Floral Atelier">Floral Atelier</SelectItem>
                    <SelectItem value="Fresh & Citrus">Fresh &amp; Citrus</SelectItem>
                    <SelectItem value="Gourmand & Spiced">Gourmand &amp; Spiced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-normal">Top Notes</Label>
              <Input
                value={topNotes}
                onChange={(e) => setTopNotes(e.target.value)}
                className="h-8 text-xs font-normal"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-normal">Heart Notes</Label>
              <Input
                value={heartNotes}
                onChange={(e) => setHeartNotes(e.target.value)}
                className="h-8 text-xs font-normal"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-normal">Base Notes</Label>
              <Input
                value={baseNotes}
                onChange={(e) => setBaseNotes(e.target.value)}
                className="h-8 text-xs font-normal"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-normal">Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-xs font-normal"
                rows={2}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsCreateOpen(false)}
                className="text-xs font-normal"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="text-xs font-normal cursor-pointer"
              >
                {isSubmitting ? "Saving..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
