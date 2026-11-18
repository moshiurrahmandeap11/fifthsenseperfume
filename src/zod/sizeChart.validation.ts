import { z } from "zod";

export const sizeChartRowSchema = z.object({
  euSize: z.string().min(1, "EU size is required"),
  ukSize: z.string().optional(),
  usSize: z.string().optional(),
  footLengthCm: z
    .number()
    .positive("Foot length in CM must be a positive number")
    .optional(),
  footLengthInch: z
    .number()
    .positive("Foot length in Inches must be a positive number")
    .optional(),
});

export const sizeChartFormSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title cannot exceed 100 characters"),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
  rows: z.array(sizeChartRowSchema).min(1, "At least one size row is required"),
});

export type SizeChartFormData = z.infer<typeof sizeChartFormSchema>;
export type SizeChartRowFormData = z.infer<typeof sizeChartRowSchema>;
