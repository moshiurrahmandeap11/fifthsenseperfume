"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { quickStockUpdate } from "@/services/inventory.services";
import { ISizeMatrixProduct, ISizeMatrixVariant } from "@/types/inventory.types";
import { Search } from "lucide-react";
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

        toast.success(`Updated stock for ${editingVariant.productName}`);
        setEditingVariant(null);
      } catch (err: unknown) {
        const error = err as { message?: string };
        toast.error(error.message || "Failed to update stock");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-none border border-border/60 bg-card p-4 space-y-1">
          <div className="text-xs font-normal text-muted-foreground uppercase">
            Total Flacon SKUs
          </div>
          <div className="text-xl font-normal text-foreground tabular-nums">
            {totalVariantsCount}
          </div>
        </Card>

        <Card className="shadow-none border border-border/60 bg-card p-4 space-y-1">
          <div className="text-xs font-normal text-muted-foreground uppercase">
            Total Vault Stock
          </div>
          <div className="text-xl font-normal text-foreground tabular-nums">
            {totalBottleUnits} units
          </div>
        </Card>

        <Card className="shadow-none border border-border/60 bg-card p-4 space-y-1">
          <div className="text-xs font-normal text-muted-foreground uppercase">
            Low Stock Alerts
          </div>
          <div className="text-xl font-normal text-foreground tabular-nums">
            {lowStockCount}
          </div>
        </Card>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            placeholder="Search fragrance, SKU, or volume..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 text-xs h-8 bg-background font-normal"
          />
        </div>

        <div className="flex items-center gap-1 text-xs">
          <Button
            size="sm"
            variant={filterMode === "ALL" ? "secondary" : "ghost"}
            onClick={() => setFilterMode("ALL")}
            className="h-7 text-xs px-2.5 font-normal cursor-pointer"
          >
            All ({totalVariantsCount})
          </Button>
          <Button
            size="sm"
            variant={filterMode === "LOW_STOCK" ? "secondary" : "ghost"}
            onClick={() => setFilterMode("LOW_STOCK")}
            className="h-7 text-xs px-2.5 font-normal cursor-pointer"
          >
            Low Stock ({lowStockCount})
          </Button>
          <Button
            size="sm"
            variant={filterMode === "HEALTHY" ? "secondary" : "ghost"}
            onClick={() => setFilterMode("HEALTHY")}
            className="h-7 text-xs px-2.5 font-normal cursor-pointer"
          >
            In Stock ({totalVariantsCount - lowStockCount})
          </Button>
        </div>
      </div>

      {/* Inventory Table */}
      <Card className="shadow-none border border-border/60 overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="text-xs font-normal">Fragrance</TableHead>
              <TableHead className="text-xs font-normal">Volume</TableHead>
              <TableHead className="text-xs font-normal">SKU</TableHead>
              <TableHead className="text-xs font-normal text-right">Vault Stock</TableHead>
              <TableHead className="text-xs font-normal text-right">Showroom Stock</TableHead>
              <TableHead className="text-xs font-normal">Health</TableHead>
              <TableHead className="text-xs font-normal text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-36 text-center text-xs font-normal text-muted-foreground">
                  No inventory items found
                </TableCell>
              </TableRow>
            ) : (
              filteredList.map((item) => {
                const isLow = item.variant.stockQuantity <= (item.variant.lowStockThreshold || 5);
                const isOutOfStock = item.variant.stockQuantity === 0;

                return (
                  <TableRow key={item.variant.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell>
                      <div className="text-xs font-normal text-foreground">
                        {item.productName}
                      </div>
                      <div className="text-[11px] font-normal text-muted-foreground font-mono">
                        {item.styleCode}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline" className="font-mono text-[10px] font-normal">
                        {item.variant.size.includes("ml") ? item.variant.size : `${item.variant.size}ml`}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <span className="font-mono text-xs font-normal text-muted-foreground">
                        {item.variant.sku}
                      </span>
                    </TableCell>

                    <TableCell className="text-right text-xs font-normal text-foreground tabular-nums">
                      {item.variant.stockQuantity}
                    </TableCell>

                    <TableCell className="text-right text-xs font-normal text-muted-foreground tabular-nums">
                      {item.variant.showroomStock || 0}
                    </TableCell>

                    <TableCell>
                      {isOutOfStock ? (
                        <Badge variant="outline" className="text-[10px] font-normal">
                          Depleted
                        </Badge>
                      ) : isLow ? (
                        <Badge variant="outline" className="text-[10px] font-normal">
                          Low ({item.variant.stockQuantity})
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] font-normal">
                          Normal
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenEdit(item)}
                        className="h-7 px-2 text-xs font-normal cursor-pointer"
                      >
                        Adjust
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Quick Stock Adjustment Dialog */}
      <Dialog open={!!editingVariant} onOpenChange={(open) => !open && setEditingVariant(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-normal">
              Adjust Stock — {editingVariant?.productName} ({editingVariant?.variant.size})
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs font-normal">
            <div className="space-y-1">
              <Label className="text-xs font-normal">Vault Stock (Bottles)</Label>
              <Input
                type="number"
                min={0}
                value={newStock}
                onChange={(e) => setNewStock(parseInt(e.target.value) || 0)}
                className="h-8 text-xs font-normal"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-normal">Showroom Display Stock</Label>
              <Input
                type="number"
                min={0}
                value={newShowroomStock}
                onChange={(e) => setNewShowroomStock(parseInt(e.target.value) || 0)}
                className="h-8 text-xs font-normal"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditingVariant(null)}
              disabled={isPending}
              className="text-xs font-normal"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSaveStock}
              disabled={isPending}
              className="text-xs font-normal cursor-pointer"
            >
              {isPending ? "Updating..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
