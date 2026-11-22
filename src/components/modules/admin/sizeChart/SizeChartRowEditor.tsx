"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ISizeChartRow } from "@/types/sizeChart.types";
import { Plus, Trash2 } from "lucide-react";
import React from "react";

interface SizeChartRowEditorProps {
  rows: ISizeChartRow[];
  onChange: (rows: ISizeChartRow[]) => void;
  disabled?: boolean;
}

const EXTRAIT_PRESET: ISizeChartRow[] = [
  { euSize: "100ml", ukSize: "Extrait 35%", usSize: "16+ Hours", footLengthCm: 1500, footLengthInch: 180 },
  { euSize: "50ml", ukSize: "Extrait 35%", usSize: "16+ Hours", footLengthCm: 750, footLengthInch: 90 },
  { euSize: "30ml", ukSize: "Extrait 35%", usSize: "16+ Hours", footLengthCm: 450, footLengthInch: 50 },
  { euSize: "10ml", ukSize: "Travel Extrait", usSize: "16+ Hours", footLengthCm: 150, footLengthInch: 18 },
];

const DISCOVERY_PRESET: ISizeChartRow[] = [
  { euSize: "30ml", ukSize: "Discovery", usSize: "14+ Hours", footLengthCm: 450, footLengthInch: 50 },
  { euSize: "10ml", ukSize: "Travel Pocket", usSize: "14+ Hours", footLengthCm: 150, footLengthInch: 18 },
  { euSize: "2ml", ukSize: "Sample Vial", usSize: "12+ Hours", footLengthCm: 35, footLengthInch: 5 },
];

export default function SizeChartRowEditor({
  rows,
  onChange,
  disabled = false,
}: SizeChartRowEditorProps) {
  const handleAddRow = () => {
    onChange([
      ...rows,
      {
        euSize: "50ml",
        ukSize: "Extrait",
        usSize: "14+ Hours",
        footLengthCm: 750,
        footLengthInch: 90,
      },
    ]);
  };

  const handleRemoveRow = (index: number) => {
    if (rows.length <= 1) return;
    onChange(rows.filter((_, i) => i !== index));
  };

  const handleFieldChange = (
    index: number,
    field: keyof ISizeChartRow,
    value: string
  ) => {
    const updated = [...rows];
    if (field === "footLengthCm" || field === "footLengthInch") {
      const num = value === "" ? undefined : parseFloat(value);
      updated[index] = { ...updated[index], [field]: isNaN(num as number) ? undefined : num };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    onChange(updated);
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs font-normal text-foreground">
          Volume Matrix ({rows.length} {rows.length === 1 ? "option" : "options"})
        </span>

        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={() => onChange(EXTRAIT_PRESET)}
            disabled={disabled}
            className="text-[11px] font-normal cursor-pointer"
          >
            Extrait Suite Preset
          </Button>

          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={() => onChange(DISCOVERY_PRESET)}
            disabled={disabled}
            className="text-[11px] font-normal cursor-pointer"
          >
            Discovery Set Preset
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-border/50 bg-background overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 text-[11px]">
              <TableHead className="w-24 font-normal">Volume</TableHead>
              <TableHead className="w-28 font-normal">Concentration</TableHead>
              <TableHead className="w-28 font-normal">Longevity</TableHead>
              <TableHead className="w-24 font-normal">Sprays (~)</TableHead>
              <TableHead className="w-24 font-normal">Days (~)</TableHead>
              <TableHead className="w-10 text-center font-normal"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, idx) => (
              <TableRow key={idx} className="hover:bg-muted/20">
                <TableCell className="p-1.5">
                  <Input
                    value={row.euSize}
                    onChange={(e) => handleFieldChange(idx, "euSize", e.target.value)}
                    placeholder="100ml"
                    className="h-7 text-xs font-normal"
                    disabled={disabled}
                  />
                </TableCell>
                <TableCell className="p-1.5">
                  <Input
                    value={row.ukSize || ""}
                    onChange={(e) => handleFieldChange(idx, "ukSize", e.target.value)}
                    placeholder="Extrait 35%"
                    className="h-7 text-xs font-normal"
                    disabled={disabled}
                  />
                </TableCell>
                <TableCell className="p-1.5">
                  <Input
                    value={row.usSize || ""}
                    onChange={(e) => handleFieldChange(idx, "usSize", e.target.value)}
                    placeholder="16+ Hours"
                    className="h-7 text-xs font-normal"
                    disabled={disabled}
                  />
                </TableCell>
                <TableCell className="p-1.5">
                  <Input
                    type="number"
                    value={row.footLengthCm ?? ""}
                    onChange={(e) => handleFieldChange(idx, "footLengthCm", e.target.value)}
                    placeholder="1500"
                    className="h-7 text-xs font-normal"
                    disabled={disabled}
                  />
                </TableCell>
                <TableCell className="p-1.5">
                  <Input
                    type="number"
                    value={row.footLengthInch ?? ""}
                    onChange={(e) => handleFieldChange(idx, "footLengthInch", e.target.value)}
                    placeholder="180"
                    className="h-7 text-xs font-normal"
                    disabled={disabled}
                  />
                </TableCell>
                <TableCell className="p-1.5 text-center">
                  <button
                    type="button"
                    onClick={() => handleRemoveRow(idx)}
                    disabled={disabled || rows.length <= 1}
                    className="size-6 rounded hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
                    aria-label="Remove Row"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAddRow}
        disabled={disabled}
        className="w-full text-xs font-normal gap-1 border-dashed h-7 cursor-pointer"
      >
        <Plus className="size-3" />
        <span>Add Volume Row</span>
      </Button>
    </div>
  );
}
