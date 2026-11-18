"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ISizeChart } from "@/types/sizeChart.types";
import {
  Edit2,
  Eye,
  Footprints,
  Plus,
  Ruler,
  Search,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import SizeChartBuilderDialog from "./SizeChartBuilderDialog";
import SizeChartDeleteAlert from "./SizeChartDeleteAlert";
import SizeChartVisualPreview from "./SizeChartVisualPreview";

interface SizeChartCardGridProps {
  charts: ISizeChart[];
  onRefresh: () => void;
}

export default function SizeChartCardGrid({
  charts = [],
  onRefresh,
}: SizeChartCardGridProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChart, setSelectedChart] = useState<ISizeChart | null>(null);
  const [editingChart, setEditingChart] = useState<ISizeChart | null>(null);
  const [deletingChart, setDeletingChart] = useState<ISizeChart | null>(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const filteredCharts = useMemo(() => {
    if (!searchTerm.trim()) return charts;
    const query = searchTerm.toLowerCase();
    return charts.filter(
      (c) =>
        c.title.toLowerCase().includes(query) ||
        (c.description && c.description.toLowerCase().includes(query))
    );
  }, [charts, searchTerm]);

  const handleCreate = () => {
    setEditingChart(null);
    setIsBuilderOpen(true);
  };

  const handleEdit = (chart: ISizeChart) => {
    setEditingChart(chart);
    setIsBuilderOpen(true);
  };

  const handlePreview = (chart: ISizeChart) => {
    setSelectedChart(chart);
    setIsPreviewOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search size charts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        <Button
          onClick={handleCreate}
          size="sm"
          className="gap-1.5 h-9 text-xs cursor-pointer"
        >
          <Plus className="size-4" />
          <span>Create Size Chart</span>
        </Button>
      </div>

      {/* Grid of Size Charts */}
      {filteredCharts.length === 0 ? (
        <div className="rounded-xl border bg-card p-12 text-center shadow-xs">
          <Ruler className="size-10 text-muted-foreground/40 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-foreground">
            No size charts configured
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1 mb-4">
            {searchTerm
              ? "No size chart matches your search query."
              : "Create size conversion charts (EU, UK, US, CM, Inches) so customers can select the perfect shoe size."}
          </p>
          {!searchTerm && (
            <Button
              onClick={handleCreate}
              size="sm"
              className="gap-1 text-xs cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>Create First Size Chart</span>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCharts.map((chart) => {
            const rowCount = chart.rows?.length || 0;
            const productCount = chart._count?.products || 0;
            const minSize = chart.rows?.[0]?.euSize;
            const maxSize = chart.rows?.[rowCount - 1]?.euSize;

            return (
              <Card
                key={chart.id}
                className="shadow-xs hover:shadow-sm transition-shadow flex flex-col justify-between"
              >
                <CardHeader className="pb-3 border-b">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <CardTitle className="text-sm font-bold text-foreground line-clamp-1">
                        {chart.title}
                      </CardTitle>
                      <p className="text-[11px] text-muted-foreground line-clamp-1">
                        {chart.description || "Standard footwear sizing template"}
                      </p>
                    </div>

                    <div className="size-7 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Ruler className="size-3.5" />
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-4 pb-2 space-y-3 flex-1">
                  {/* Size Range & Metrics */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Configured Sizes:</span>
                    <span className="font-bold text-foreground">
                      {rowCount} Sizes {minSize && maxSize && `(EU ${minSize} - ${maxSize})`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Linked Products:</span>
                    <Badge variant="secondary" className="text-[10px] h-4.5">
                      {productCount} {productCount === 1 ? "Product" : "Products"}
                    </Badge>
                  </div>

                  {/* Sizes Preview Badges */}
                  <div className="pt-1 flex flex-wrap gap-1">
                    {chart.rows?.slice(0, 6).map((row, rIdx) => (
                      <span
                        key={rIdx}
                        className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-muted text-foreground border"
                      >
                        EU {row.euSize}
                      </span>
                    ))}
                    {rowCount > 6 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-muted/60 text-muted-foreground">
                        +{rowCount - 6} more
                      </span>
                    )}
                  </div>

                  {/* Guide Image thumbnail indicator */}
                  {chart.guideImage && (
                    <div className="pt-1 flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
                      <Footprints className="size-3.5" />
                      <span>Includes foot measurement diagram</span>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="pt-3 border-t flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => handlePreview(chart)}
                    className="text-xs gap-1 cursor-pointer"
                  >
                    <Eye className="size-3 text-muted-foreground" />
                    <span>Preview</span>
                  </Button>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => handleEdit(chart)}
                      className="cursor-pointer text-muted-foreground hover:text-foreground"
                      aria-label="Edit Size Chart"
                    >
                      <Edit2 className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => setDeletingChart(chart)}
                      className="cursor-pointer text-muted-foreground hover:text-destructive"
                      aria-label="Delete Size Chart"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Builder Modal (Create/Edit) */}
      <SizeChartBuilderDialog
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
        onSuccess={onRefresh}
        initialData={editingChart}
      />

      {/* Visual Preview Modal */}
      <SizeChartVisualPreview
        chart={selectedChart}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />

      {/* Delete Confirmation Alert */}
      <SizeChartDeleteAlert
        chart={deletingChart}
        isOpen={!!deletingChart}
        onClose={() => setDeletingChart(null)}
        onSuccess={onRefresh}
      />
    </div>
  );
}
