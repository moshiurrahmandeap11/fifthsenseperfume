"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import httpClient, { extractErrorMessage } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";

export interface IUploadedMediaItem {
  url: string;
  publicId: string;
  originalName: string;
  mimeType: string;
  size: number;
}

export interface IMultipleUploadResponse {
  urls: string[];
  files: IUploadedMediaItem[];
}

/**
 * Upload a single image file to Cloudinary via /api/v1/media/upload
 */
export const uploadSingleMedia = async (
  formData: FormData
): Promise<ApiResponse<IUploadedMediaItem>> => {
  try {
    const res = await httpClient.post<IUploadedMediaItem>(
      "/media/upload",
      formData
    );
    return res;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error, "Failed to upload image"));
  }
};

/**
 * Upload multiple image files (up to 10) to Cloudinary via /api/v1/media/upload-multiple
 */
export const uploadMultipleMedia = async (
  formData: FormData
): Promise<ApiResponse<IMultipleUploadResponse>> => {
  try {
    const res = await httpClient.post<IMultipleUploadResponse>(
      "/media/upload-multiple",
      formData
    );
    return res;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error, "Failed to upload images"));
  }
};

/**
 * Delete an uploaded media file from Cloudinary by URL
 */
export const deleteMediaByUrl = async (
  url: string
): Promise<ApiResponse<{ deleted: boolean; url: string }>> => {
  try {
    const res = await httpClient.post<{ deleted: boolean; url: string }>(
      "/media/delete",
      { url }
    );
    return res;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error, "Failed to delete image"));
  }
};
