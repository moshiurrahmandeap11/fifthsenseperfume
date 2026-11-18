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
import { Footprints, Info, Ruler } from "lucide-react";
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
          <div className="flex items-center gap-2 text-primary mb-1">
            <Ruler className="size-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Storefront Customer Preview
            </span>
          </div>
          <DialogTitle className="text-lg font-bold">
            {chart.title}
          </DialogTitle>
          {chart.description && (
            <DialogDescription className="text-xs">
              {chart.description}
            </DialogDescription>
          )}
        </DialogHeader>

        {/* Foot Measurement Guide Banner */}
        <div className="rounded-lg bg-primary/5 border border-primary/20 p-3.5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-foreground">
            <Footprints className="size-4 text-primary" />
            <span>How to Measure Your Foot Length</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            1. Stand on a blank sheet of paper with your heel lightly touching a flat wall.<br />
            2. Mark the longest part of your foot (tip of big toe) on the paper.<br />
            3. Measure the distance from the wall to your mark in centimeters (CM) or inches.
          </p>

          {chart.guideImage && (
            <div className="relative w-full h-40 rounded-md border overflow-hidden mt-2 bg-background">
              <Image
                src={chart.guideImage}
                alt="Foot Measuring Guide"
                fill
                className="object-contain"
              />
            </div>
          )}
        </div>

        {/* Size Conversion Table */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs font-semibold text-foreground">
            <span>Size Conversion Matrix</span>
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Info className="size-3 text-primary" />
              Standard Bangladesh Fit
            </span>
          </div>

          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 text-xs">
                  <TableHead className="font-bold text-primary">EU Size</TableHead>
                  <TableHead>UK Size</TableHead>
                  <TableHead>US Size</TableHead>
                  <TableHead>Foot Length (CM)</TableHead>
                  <TableHead>Foot Length (Inches)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chart.rows.map((row, idx) => (
                  <TableRow
                    key={idx}
                    className={idx % 2 === 0 ? "bg-background" : "bg-muted/15"}
                  >
                    <TableCell className="font-bold text-xs text-foreground">
                      {row.euSize}
                    </TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {row.ukSize || "—"}
                    </TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {row.usSize || "—"}
                    </TableCell>
                    <TableCell className="text-xs text-foreground font-medium">
                      {row.footLengthCm ? `${row.footLengthCm} cm` : "—"}
                    </TableCell>
                    <TableCell className="text-xs text-foreground font-medium">
                      {row.footLengthInch ? `${row.footLengthInch}"` : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Close Preview
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
