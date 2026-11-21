"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ISizeChart } from "@/types/sizeChart.types";
import Image from "next/image";
import React from "react";

interface SizeChartVisualPreviewProps {
  chart: ISizeChart | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function SizeChartVisualPreview({
  chart,
  isOpen,
  onClose,
}: SizeChartVisualPreviewProps) {
  if (!chart) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm font-normal">
            {chart.title}
          </DialogTitle>
          {chart.description && (
            <DialogDescription className="text-xs font-normal">
              {chart.description}
            </DialogDescription>
          )}
        </DialogHeader>

        {/* Notes */}
        <div className="rounded-lg border border-border/40 p-3 space-y-1.5 bg-muted/20 text-xs font-normal">
          <div className="text-foreground">Application &amp; Longevity Guide</div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Apply on pulse points (wrists, neck, collarbone) for optimum projection. Extrait de Parfum delivers 14-18 hours longevity with artisanal perfume oil concentration.
          </p>

          {chart.guideImage && (
            <div className="relative w-full h-36 rounded border overflow-hidden mt-2 bg-background">
              <Image
                src={chart.guideImage}
                alt="Guide"
                fill
                className="object-contain"
              />
            </div>
          )}
        </div>

        {/* Volume Table */}
        <div className="space-y-1.5 pt-1">
          <div className="text-xs font-normal text-muted-foreground">Volume &amp; Longevity Matrix</div>

          <div className="rounded-lg border border-border/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 text-xs font-normal">
                  <TableHead className="font-normal">Volume</TableHead>
                  <TableHead className="font-normal">Concentration</TableHead>
                  <TableHead className="font-normal">Longevity</TableHead>
                  <TableHead className="font-normal">Est. Sprays</TableHead>
                  <TableHead className="font-normal">Est. Days</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chart.rows.map((row, idx) => (
                  <TableRow
                    key={idx}
                    className="hover:bg-muted/20 font-normal text-xs"
                  >
                    <TableCell className="font-normal text-foreground">
                      {row.euSize}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {row.ukSize || "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {row.usSize || "—"}
                    </TableCell>
                    <TableCell className="text-foreground tabular-nums">
                      {row.footLengthCm ? `~${row.footLengthCm}` : "—"}
                    </TableCell>
                    <TableCell className="text-foreground tabular-nums">
                      {row.footLengthInch ? `~${row.footLengthInch} days` : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs font-normal">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
