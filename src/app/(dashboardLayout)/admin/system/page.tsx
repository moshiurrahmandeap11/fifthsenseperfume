import SystemSettingsClient from "@/components/modules/admin/system/SystemSettingsClient";
import {
  getAllBanners,
  getAllShowrooms,
  getPlatformSettings,
} from "@/services/system.services";
import { IBanner, IPlatformSettings, IShowroomLocation } from "@/types/system.types";
import { Settings } from "lucide-react";
import { Metadata } from "next";
import { connection } from "next/server";
import React from "react";

export const metadata: Metadata = {
  title: "Settings & CMS | FIFTH SENSE PERFUMES",
  description: "Configure brand identity, storefront hero sliders, and atelier boutiques",
};

export default async function AdminSystemPage() {
  await connection();
  let settings: IPlatformSettings | null = null;
  let banners: IBanner[] = [];
  let showrooms: IShowroomLocation[] = [];

  try {
    const [settingsRes, bannersRes, showroomsRes] = await Promise.all([
      getPlatformSettings(),
      getAllBanners({ limit: 100 }),
      getAllShowrooms({ limit: 100 }),
    ]);

    if (settingsRes?.data) settings = settingsRes.data;
    if (bannersRes?.data) banners = bannersRes.data;
    if (showroomsRes?.data) showrooms = showroomsRes.data;
  } catch (err) {
    console.error("Failed to load platform settings server-side:", err);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Settings className="size-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Settings &amp; CMS
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Configure luxury perfume boutique identity, hero banners, and physical olfactory lounges
          </p>
        </div>
      </div>

      {/* Main Interactive Client */}
      <SystemSettingsClient
        initialSettings={settings}
        initialBanners={banners}
        initialShowrooms={showrooms}
      />
    </div>
  );
}
