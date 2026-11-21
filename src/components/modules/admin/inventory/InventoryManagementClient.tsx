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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { quickStockUpdate } from "@/services/inventory.services";
import { ISizeMatrixProduct, ISizeMatrixVariant } from "@/types/inventory.types";
import {
  AlertCircle,
  AlertTriangle,
  Boxes,
  CheckCircle2,
  Droplets,
  Edit3,
  Layers,
  Search,
} from "lucide-react";
import React, { useMemo, useState, useTransition } from "react";
import toast from "react-hot-toast";

interface InventoryManagementClientProps {
  initialProducts: ISizeMatrixProduct[];
}

interface FlattenedVariant {
  productId: string;
  productName: string;
  styleCode: string;
  categoryName: string;
  colorName: string;
  variant: ISizeMatrixVariant;
}

export default function InventoryManagementClient({
  initialProducts,
}: InventoryManagementClientProps) {
  const [products, setProducts] = useState<ISizeMatrixProduct[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState<"ALL" | "LOW_STOCK" | "HEALTHY">("ALL");
  const [isPending, startTransition] = useTransition();

  // Quick Edit State
  const [editingVariant, setEditingVariant] = useState<FlattenedVariant | null>(null);
  const [newStock, setNewStock] = useState<number>(0);
  const [newShowroomStock, setNewShowroomStock] = useState<number>(0);

  // Flatten all variants from the matrix
  const flattenedVariants: FlattenedVariant[] = useMemo(() => {
    const list: FlattenedVariant[] = [];
    products.forEach((prod) => {
      prod.colors?.forEach((col) => {
        col.variants?.forEach((v) => {
          list.push({
            productId: prod.id,
            productName: prod.name,
            styleCode: prod.styleCode,
            categoryName: prod.category?.name || "Artisanal Collection",
            colorName: col.colorName,
            variant: v,
          });
        });
      });
    });
    return list;
  }, [products]);

  // Filtered variants
  const filteredList = useMemo(() => {
    return flattenedVariants.filter((item) => {
      const matchesSearch =
        item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.variant.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.variant.size.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.styleCode.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      const isLowStock = item.variant.stockQuantity <= (item.variant.lowStockThreshold || 5);

      if (filterMode === "LOW_STOCK") return isLowStock;
      if (filterMode === "HEALTHY") return !isLowStock;
      return true;
    });
  }, [flattenedVariants, searchTerm, filterMode]);

  // Summary Metrics
  const totalVariantsCount = flattenedVariants.length;
  const totalBottleUnits = flattenedVariants.reduce((sum, item) => sum + item.variant.stockQuantity, 0);
  const lowStockCount = flattenedVariants.filter(
    (item) => item.variant.stockQuantity <= (item.variant.lowStockThreshold || 5)
  ).length;

  const handleOpenEdit = (item: FlattenedVariant) => {
    setEditingVariant(item);
    setNewStock(item.variant.stockQuantity);
    setNewShowroomStock(item.variant.showroomStock || 0);
  };

  const handleSaveStock = () => {
    if (!editingVariant) return;

    startTransition(async () => {
      try {
        await quickStockUpdate({
          variantId: editingVariant.variant.id,
          newStockQuantity: newStock,
          showroomStock: newShowroomStock,
        });

        // Update local state
        setProducts((prev) =>
          prev.map((prod) => {
            if (prod.id !== editingVariant.productId) return prod;
            return {
              ...prod,
              colors: prod.colors.map((col) => ({
                ...col,
                variants: col.variants.map((v) =>
                  v.id === editingVariant.variant.id
                    ? { ...v, stockQuantity: newStock, showroomStock: newShowroomStock }
                    : v
                ),
              })),
            };
          })
        );

        toast.success(`Updated stock for ${editingVariant.productName} (${editingVariant.variant.size})`);
        setEditingVariant(null);
      } catch (err: unknown) {
        const error = err as { message?: string };
        toast.error(error.message || "Failed to update stock");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Inventory KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-xs border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Flacon SKUs
            </CardTitle>
            <Boxes className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {totalVariantsCount}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Active volume variants across atelier
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Bottles in Stock
            </CardTitle>
            <Droplets className="size-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {totalBottleUnits} units
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Finished perfumery inventory in vault
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Low Flacon Stock Alerts
            </CardTitle>
            <AlertTriangle className="size-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-amber-600">
              {lowStockCount}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              {lowStockCount > 0 ? "Requires formulation restock" : "All batch levels optimal"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Control Bar: Search & Status Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search fragrance, SKU, or volume (e.g. 50ml, 100ml)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 text-xs h-9 bg-background"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-lg border border-border/40 text-xs">
          <Button
            size="sm"
            variant={filterMode === "ALL" ? "default" : "ghost"}
            onClick={() => setFilterMode("ALL")}
            className="h-7 text-xs px-2.5 cursor-pointer"
          >
            All Flacons ({totalVariantsCount})
          </Button>
          <Button
            size="sm"
            variant={filterMode === "LOW_STOCK" ? "default" : "ghost"}
            onClick={() => setFilterMode("LOW_STOCK")}
            className="h-7 text-xs px-2.5 cursor-pointer text-amber-600 hover:text-amber-700"
          >
            Low Stock ({lowStockCount})
          </Button>
          <Button
            size="sm"
            variant={filterMode === "HEALTHY" ? "default" : "ghost"}
            onClick={() => setFilterMode("HEALTHY")}
            className="h-7 text-xs px-2.5 cursor-pointer text-emerald-600 hover:text-emerald-700"
          >
            In Stock ({totalVariantsCount - lowStockCount})
          </Button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="text-xs font-semibold">Fragrance & Formulation</TableHead>
              <TableHead className="text-xs font-semibold">Volume / Size</TableHead>
              <TableHead className="text-xs font-semibold">SKU Code</TableHead>
              <TableHead className="text-xs font-semibold">Vault Stock</TableHead>
              <TableHead className="text-xs font-semibold">Atelier / Showroom</TableHead>
              <TableHead className="text-xs font-semibold">Stock Health</TableHead>
              <TableHead className="text-xs font-semibold text-right">Quick Adjust</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-44 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground space-y-2">
                    <Boxes className="size-8 stroke-[1.5]" />
                    <p className="text-xs font-medium">No fragrance inventory items found</p>
                    <p className="text-[11px] text-muted-foreground/80">
                      Add fragrances to the catalog to generate batch inventory records
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredList.map((item) => {
                const isLow = item.variant.stockQuantity <= (item.variant.lowStockThreshold || 5);
                const isOutOfStock = item.variant.stockQuantity === 0;

                return (
                  <TableRow key={item.variant.id} className="hover:bg-muted/20">
                    <TableCell>
                      <div className="space-y-0.5">
                        <div className="font-medium text-xs text-foreground">
                          {item.productName}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          <span className="font-mono">{item.styleCode}</span>
                          <span>•</span>
                          <span>{item.categoryName}</span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline" className="font-mono text-[11px] bg-background">
                        {item.variant.size.includes("ml") ? item.variant.size : `${item.variant.size}ml`}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <span className="font-mono text-xs text-muted-foreground">
                        {item.variant.sku}
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="font-bold text-xs">
                        {item.variant.stockQuantity} <span className="text-[10px] text-muted-foreground font-normal">bottles</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="text-xs text-muted-foreground">
                        {item.variant.showroomStock || 0} <span className="text-[10px]">units</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      {isOutOfStock ? (
                        <Badge variant="destructive" className="text-[10px] gap-1">
                          <AlertCircle className="size-3" /> Depleted
                        </Badge>
                      ) : isLow ? (
                        <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-300 bg-amber-500/10 gap-1">
                          <AlertTriangle className="size-3" /> Low ({item.variant.stockQuantity} left)
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-300 bg-emerald-500/10 gap-1">
                          <CheckCircle2 className="size-3" /> Optimal
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenEdit(item)}
                        className="h-7 px-2 text-xs gap-1 cursor-pointer"
                      >
                        <Edit3 className="size-3.5 text-muted-foreground" />
                        <span>Adjust</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Quick Stock Adjustment Dialog */}
      <Dialog open={!!editingVariant} onOpenChange={(open) => !open && setEditingVariant(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Boxes className="size-4 text-primary" />
              Adjust Flacon Stock
            </DialogTitle>
            <DialogDescription className="text-xs">
              {editingVariant?.productName} — Flacon Volume: {editingVariant?.variant.size}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="vaultStock" className="text-xs">
                Main Vault / Warehouse Stock (Bottles)
              </Label>
              <Input
                id="vaultStock"
                type="number"
                min={0}
                value={newStock}
                onChange={(e) => setNewStock(parseInt(e.target.value) || 0)}
                className="text-xs h-9"
              />
              <p className="text-[11px] text-muted-foreground">
                Online inventory immediately available for dispatch
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="showroomStock" className="text-xs">
                Atelier Showroom Display Stock
              </Label>
              <Input
                id="showroomStock"
                type="number"
                min={0}
                value={newShowroomStock}
                onChange={(e) => setNewShowroomStock(parseInt(e.target.value) || 0)}
                className="text-xs h-9"
              />
              <p className="text-[11px] text-muted-foreground">
                Reserved for olfactory tester tables and in-store sampling
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditingVariant(null)}
              disabled={isPending}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSaveStock}
              disabled={isPending}
              className="text-xs cursor-pointer"
            >
              {isPending ? "Updating..." : "Save Stock Count"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
