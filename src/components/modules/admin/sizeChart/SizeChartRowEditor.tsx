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
import { Plus, Trash2, Wand2 } from "lucide-react";
import React from "react";

interface SizeChartRowEditorProps {
  rows: ISizeChartRow[];
  onChange: (rows: ISizeChartRow[]) => void;
  disabled?: boolean;
}

const MENS_PRESET: ISizeChartRow[] = [
  { euSize: "39", ukSize: "5.5", usSize: "6.5", footLengthCm: 24.5, footLengthInch: 9.6 },
  { euSize: "40", ukSize: "6.5", usSize: "7.5", footLengthCm: 25.0, footLengthInch: 9.8 },
  { euSize: "41", ukSize: "7.5", usSize: "8.5", footLengthCm: 26.0, footLengthInch: 10.2 },
  { euSize: "42", ukSize: "8.0", usSize: "9.0", footLengthCm: 26.5, footLengthInch: 10.4 },
  { euSize: "43", ukSize: "9.0", usSize: "10.0", footLengthCm: 27.5, footLengthInch: 10.8 },
  { euSize: "44", ukSize: "9.5", usSize: "10.5", footLengthCm: 28.0, footLengthInch: 11.0 },
  { euSize: "45", ukSize: "10.5", usSize: "11.5", footLengthCm: 29.0, footLengthInch: 11.4 },
];

const WOMENS_PRESET: ISizeChartRow[] = [
  { euSize: "36", ukSize: "3.5", usSize: "5.5", footLengthCm: 22.5, footLengthInch: 8.9 },
  { euSize: "37", ukSize: "4.0", usSize: "6.0", footLengthCm: 23.0, footLengthInch: 9.1 },
  { euSize: "38", ukSize: "5.0", usSize: "7.0", footLengthCm: 24.0, footLengthInch: 9.4 },
  { euSize: "39", ukSize: "6.0", usSize: "8.0", footLengthCm: 24.5, footLengthInch: 9.6 },
  { euSize: "40", ukSize: "6.5", usSize: "8.5", footLengthCm: 25.0, footLengthInch: 9.8 },
  { euSize: "41", ukSize: "7.5", usSize: "9.5", footLengthCm: 26.0, footLengthInch: 10.2 },
];

export default function SizeChartRowEditor({
  rows,
  onChange,
  disabled = false,
}: SizeChartRowEditorProps) {
  const handleAddRow = () => {
    const nextEu = rows.length > 0 ? String(Number(rows[rows.length - 1].euSize) + 1 || "") : "40";
    onChange([
      ...rows,
      {
        euSize: nextEu,
        ukSize: "",
        usSize: "",
        footLengthCm: undefined,
        footLengthInch: undefined,
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
    <div className="space-y-3">
      {/* Quick Preset Buttons */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs font-semibold text-foreground">
          Conversion Matrix ({rows.length} {rows.length === 1 ? "size" : "sizes"})
        </span>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={() => onChange(MENS_PRESET)}
            disabled={disabled}
            className="text-[11px] gap-1 cursor-pointer"
          >
            <Wand2 className="size-3 text-primary" />
            <span>Men&apos;s Preset (39-45)</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={() => onChange(WOMENS_PRESET)}
            disabled={disabled}
            className="text-[11px] gap-1 cursor-pointer"
          >
            <Wand2 className="size-3 text-pink-500" />
            <span>Women&apos;s Preset (36-41)</span>
          </Button>
        </div>
      </div>

      {/* Row Table */}
      <div className="rounded-lg border bg-background overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 text-[11px]">
              <TableHead className="w-24 font-bold text-primary">EU Size *</TableHead>
              <TableHead className="w-24">UK Size</TableHead>
              <TableHead className="w-24">US Size</TableHead>
              <TableHead className="w-28">Foot (CM)</TableHead>
              <TableHead className="w-28">Foot (Inch)</TableHead>
              <TableHead className="w-12 text-center"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, idx) => (
              <TableRow key={idx} className="hover:bg-muted/20">
                <TableCell className="p-1.5">
                  <Input
                    value={row.euSize}
                    onChange={(e) => handleFieldChange(idx, "euSize", e.target.value)}
                    placeholder="41"
                    className="h-8 text-xs font-bold"
                    disabled={disabled}
                  />
                </TableCell>
                <TableCell className="p-1.5">
                  <Input
                    value={row.ukSize || ""}
                    onChange={(e) => handleFieldChange(idx, "ukSize", e.target.value)}
                    placeholder="7.5"
                    className="h-8 text-xs font-mono"
                    disabled={disabled}
                  />
                </TableCell>
                <TableCell className="p-1.5">
                  <Input
                    value={row.usSize || ""}
                    onChange={(e) => handleFieldChange(idx, "usSize", e.target.value)}
                    placeholder="8.5"
                    className="h-8 text-xs font-mono"
                    disabled={disabled}
                  />
                </TableCell>
                <TableCell className="p-1.5">
                  <Input
                    type="number"
                    step="0.1"
                    value={row.footLengthCm ?? ""}
                    onChange={(e) => handleFieldChange(idx, "footLengthCm", e.target.value)}
                    placeholder="26.0"
                    className="h-8 text-xs"
                    disabled={disabled}
                  />
                </TableCell>
                <TableCell className="p-1.5">
                  <Input
                    type="number"
                    step="0.1"
                    value={row.footLengthInch ?? ""}
                    onChange={(e) => handleFieldChange(idx, "footLengthInch", e.target.value)}
                    placeholder="10.2"
                    className="h-8 text-xs"
                    disabled={disabled}
                  />
                </TableCell>
                <TableCell className="p-1.5 text-center">
                  <button
                    type="button"
                    onClick={() => handleRemoveRow(idx)}
                    disabled={disabled || rows.length <= 1}
                    className="size-7 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive flex items-center justify-center transition-colors cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
                    aria-label="Remove Row"
                  >
                    <Trash2 className="size-3.5" />
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
        className="w-full text-xs gap-1 border-dashed h-8 cursor-pointer"
      >
        <Plus className="size-3.5" />
        <span>Add Size Row</span>
      </Button>
    </div>
  );
}
