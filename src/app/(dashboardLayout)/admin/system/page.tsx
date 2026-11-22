import SystemSettingsClient from "@/components/modules/admin/system/SystemSettingsClient";
import { FluidPage } from "@/components/ui/fluid-motion";
import {
  getAllBanners,
  getAllShowrooms,
  getPlatformSettings,
} from "@/services/system.services";
import { IBanner, IPlatformSettings, IShowroomLocation } from "@/types/system.types";
import { Metadata } from "next";
import { connection } from "next/server";
import React from "react";

export const metadata: Metadata = {
  title: "Settings & CMS | FIFTH SENSE",
  description: "Brand settings, banners, and showroom boutiques",
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
    <FluidPage className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/40 pb-4">
        <div>
          <h1 className="text-xl font-normal tracking-tight text-foreground">
            Settings &amp; CMS
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Storefront identity, campaign banners, and boutique locations
          </p>
        </div>
      </div>

      <SystemSettingsClient
        initialSettings={settings}
        initialBanners={banners}
        initialShowrooms={showrooms}
      />
    </FluidPage>
  );
}
