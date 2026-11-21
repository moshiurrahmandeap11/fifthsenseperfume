"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ISizeChart } from "@/types/sizeChart.types";
import { Edit2, Eye, Plus, Search, Trash2 } from "lucide-react";
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
    <div className="space-y-4 w-full">
      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search volume guides..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs font-normal"
          />
        </div>

        <Button
          onClick={handleCreate}
          size="sm"
          className="gap-1.5 h-9 text-xs font-normal cursor-pointer"
        >
          <Plus className="size-3.5" />
          <span>Create Volume Guide</span>
        </Button>
      </div>

      {/* Grid of Volume Guides */}
      {filteredCharts.length === 0 ? (
        <div className="rounded-lg border border-border/50 bg-card p-12 text-center">
          <p className="text-xs text-muted-foreground font-normal">
            No volume guides configured
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCharts.map((chart) => {
            const rowCount = chart.rows?.length || 0;
            const productCount = chart._count?.products || 0;

            return (
              <Card
                key={chart.id}
                className="shadow-none border-border/50 bg-card flex flex-col justify-between"
              >
                <CardHeader className="pb-3 border-b border-border/40">
                  <div className="space-y-0.5">
                    <CardTitle className="text-xs font-normal text-foreground line-clamp-1">
                      {chart.title}
                    </CardTitle>
                    <p className="text-[11px] text-muted-foreground line-clamp-1 font-normal">
                      {chart.description || "Flacon volume guide"}
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="pt-4 pb-2 space-y-2.5 flex-1 font-normal">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Volumes:</span>
                    <span className="text-foreground tabular-nums">
                      {rowCount} {rowCount === 1 ? "Option" : "Options"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Linked Products:</span>
                    <Badge variant="outline" className="text-[10px] font-normal text-muted-foreground">
                      {productCount}
                    </Badge>
                  </div>

                  <div className="pt-1 flex flex-wrap gap-1">
                    {chart.rows?.map((row, rIdx) => (
                      <span
                        key={rIdx}
                        className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-muted/40 text-foreground border border-border/40"
                      >
                        {row.euSize}
                      </span>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="pt-3 border-t border-border/40 flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => handlePreview(chart)}
                    className="text-xs font-normal gap-1 cursor-pointer"
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
                      aria-label="Edit"
                    >
                      <Edit2 className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => setDeletingChart(chart)}
                      className="cursor-pointer text-muted-foreground hover:text-foreground"
                      aria-label="Delete"
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

      {/* Builder Modal */}
      <SizeChartBuilderDialog
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
        onSuccess={onRefresh}
        initialData={editingChart}
      />

      {/* Preview Modal */}
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
