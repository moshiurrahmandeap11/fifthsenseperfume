"use client";

import { Badge } from "@/components/ui/badge";
import { confirmAction } from "@/lib/swal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AnimatePresence, motion } from "@/components/ui/fluid-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  createBanner,
  createShowroom,
  deleteBanner,
  updatePlatformSettings,
} from "@/services/system.services";
import {
  BannerPosition,
  IBanner,
  IPlatformSettings,
  IShowroomLocation,
} from "@/types/system.types";
import { ImageIcon, Plus, Save, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { ThumbnailDropzone } from "@/components/modules/admin/product/ImageUploadZone";
import { Textarea } from "@/components/ui/textarea";

interface SystemSettingsClientProps {
  initialSettings?: IPlatformSettings | null;
  initialBanners: IBanner[];
  initialShowrooms: IShowroomLocation[];
}

export default function SystemSettingsClient({
  initialSettings,
  initialBanners,
  initialShowrooms,
}: SystemSettingsClientProps) {
  const router = useRouter();
  const [settings, setSettings] = useState<Partial<IPlatformSettings>>(
    initialSettings || {
      brandName: "FIFTH SENSE",
      brandSlug: "fifth-sense",
      tagline: "Luxury Niche Perfumes & Haute Parfumerie",
      logoUrl:
        "https://res.cloudinary.com/rhjebh23/image/upload/v1795431915/ecombd/site-assets/fifthsenselogo.webp",
      primaryColor: "#09090b",
      secondaryColor: "#c5a059",
      accentColor: "#18181b",
      footerDescription:
        "Artisanal fragrances crafted with pure Grasse absolutes, aged Cambodian oud, and rare Mysore sandalwood.",
      supportPhone: "+880 1700-000000",
      whatsappNumber: "+880 1700-000000",
      announcementText:
        "Complimentary discovery sample included with each flacon.",
    }
  );
  const [banners, setBanners] = useState<IBanner[]>(initialBanners);
  const [showrooms, setShowrooms] = useState<IShowroomLocation[]>(initialShowrooms);
  const [activeTab, setActiveTab] = useState("BRAND");
  const [isPending, startTransition] = useTransition();

  const [isAddBannerOpen, setIsAddBannerOpen] = useState(false);
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerSubtitle, setBannerSubtitle] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [bannerPosition, setBannerPosition] = useState<BannerPosition>("HERO_SLIDER");
  const [bannerCtaLink, setBannerCtaLink] = useState("/products");

  const [isAddShowroomOpen, setIsAddShowroomOpen] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [district, setDistrict] = useState("Dhaka");
  const [thana, setThana] = useState("Gulshan");
  const [fullAddress, setFullAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [openingHours, setOpeningHours] = useState("10:00 AM - 9:00 PM");

  const handleSaveSettings = () => {
    startTransition(async () => {
      try {
        await updatePlatformSettings({
          brandName: settings.brandName,
          brandSlug: settings.brandSlug || undefined,
          tagline: settings.tagline || undefined,
          logoUrl: settings.logoUrl || undefined,
          faviconUrl: settings.faviconUrl || undefined,
          primaryColor: settings.primaryColor || "#09090b",
          secondaryColor: settings.secondaryColor || "#c5a059",
          accentColor: settings.accentColor || "#18181b",
          footerDescription: settings.footerDescription || undefined,
          supportPhone: settings.supportPhone || undefined,
          whatsappNumber: settings.whatsappNumber || undefined,
          announcementText: settings.announcementText || undefined,
          insideDhakaShipping: Number(settings.insideDhakaShipping ?? 60),
          dhakaSubAreaShipping: Number(settings.dhakaSubAreaShipping ?? 100),
          outsideDhakaShipping: Number(settings.outsideDhakaShipping ?? 120),
          freeShippingThreshold:
            settings.freeShippingThreshold !== null &&
            settings.freeShippingThreshold !== undefined
              ? Number(settings.freeShippingThreshold)
              : null,
          enabledPaymentMethods:
            settings.enabledPaymentMethods &&
            settings.enabledPaymentMethods.length > 0
              ? settings.enabledPaymentMethods
              : ["COD", "BKASH", "NAGAD", "SSLCOMMERZ"],
          loyaltyPointsPer100Bdt: Number(settings.loyaltyPointsPer100Bdt ?? 1),
          loyaltyPointValueBdt: Number(settings.loyaltyPointValueBdt ?? 1),
        });

        router.refresh();
        toast.success("Brand & settings saved");
      } catch (err: unknown) {
        const error = err as { message?: string };
        toast.error(error.message || "Failed to update platform settings");
      }
    });
  };

  const handleCreateBanner = () => {
    if (!bannerTitle || !bannerImage) {
      toast.error("Please provide title and image URL");
      return;
    }

    startTransition(async () => {
      try {
        const res = await createBanner({
          title: bannerTitle,
          subtitle: bannerSubtitle || undefined,
          imageUrl: bannerImage,
          position: bannerPosition,
          ctaLink: bannerCtaLink || undefined,
          isActive: true,
        });

        if (res?.data) {
          setBanners((prev) => [res.data, ...prev]);
        }
        toast.success("Banner created");
        setIsAddBannerOpen(false);
        setBannerTitle("");
        setBannerSubtitle("");
        setBannerImage("");
      } catch (err: unknown) {
        const error = err as { message?: string };
        toast.error(error.message || "Failed to create banner");
      }
    });
  };

  const handleDeleteBanner = async (id: string) => {
    const confirmed = await confirmAction({
      title: "Delete banner?",
      text: "This storefront banner will be removed permanently.",
      confirmText: "Delete",
    });
    if (!confirmed) return;

    startTransition(async () => {
      try {
        await deleteBanner(id);
        setBanners((prev) => prev.filter((b) => b.id !== id));
        toast.success("Banner deleted");
      } catch (err: unknown) {
        const error = err as { message?: string };
        toast.error(error.message || "Failed to delete banner");
      }
    });
  };

  const handleCreateShowroom = () => {
    if (!roomName || !fullAddress || !phone) {
      toast.error("Please fill in showroom name, address and phone");
      return;
    }

    startTransition(async () => {
      try {
        const res = await createShowroom({
          name: roomName,
          district,
          thana,
          fullAddress,
          phoneNumber: phone,
          openingHours,
          isActive: true,
        });

        if (res?.data) {
          setShowrooms((prev) => [res.data, ...prev]);
        }
        toast.success("Showroom added");
        setIsAddShowroomOpen(false);
        setRoomName("");
        setFullAddress("");
        setPhone("");
      } catch (err: unknown) {
        const error = err as { message?: string };
        toast.error(error.message || "Failed to register showroom");
      }
    });
  };

  return (
    <div className="space-y-6 w-full">
      {/* Fluid Animated Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="h-9 mb-4">
          <TabsTrigger value="BRAND" className="text-xs font-normal cursor-pointer">
            Brand &amp; Support
          </TabsTrigger>
          <TabsTrigger value="BANNERS" className="text-xs font-normal cursor-pointer">
            Hero Banners ({banners.length})
          </TabsTrigger>
          <TabsTrigger value="SHOWROOMS" className="text-xs font-normal cursor-pointer">
            Showrooms ({showrooms.length})
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          {activeTab === "BRAND" && (
            <motion.div
              key="brand-tab"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <Card className="shadow-none border-border/50 bg-card">
                <CardHeader className="pb-3 border-b border-border/40">
                  <CardTitle className="text-xs font-normal uppercase tracking-wider text-muted-foreground">
                    Storefront Identity, Logo &amp; Brand Colors
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-5 space-y-6">
                  {/* Brand Logo & Favicon */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-5 border-b border-border/40">
                    <div className="space-y-2">
                      <Label className="text-xs font-normal">
                        Website Logo (Header, Footer &amp; Admin)
                      </Label>
                      <ThumbnailDropzone
                        value={settings.logoUrl || ""}
                        onChange={(url) =>
                          setSettings({ ...settings, logoUrl: url })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-normal">
                        Browser Favicon (Optional)
                      </Label>
                      <ThumbnailDropzone
                        value={settings.faviconUrl || ""}
                        onChange={(url) =>
                          setSettings({ ...settings, faviconUrl: url })
                        }
                      />
                    </div>
                  </div>

                  {/* Brand Name, Slug & Tagline */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs font-normal">Brand Name</Label>
                      <Input
                        value={settings.brandName || ""}
                        onChange={(e) => {
                          const nextName = e.target.value;
                          const nextSlug = nextName
                            .toLowerCase()
                            .trim()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/^-|-$/g, "");
                          setSettings({
                            ...settings,
                            brandName: nextName,
                            brandSlug: nextSlug,
                          });
                        }}
                        className="text-xs h-9 font-normal"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs font-normal">Brand Slug</Label>
                      <Input
                        value={settings.brandSlug || ""}
                        onChange={(e) =>
                          setSettings({ ...settings, brandSlug: e.target.value })
                        }
                        placeholder="fifth-sense"
                        className="text-xs h-9 font-mono font-normal"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs font-normal">
                        Brand Tagline / Subtitle
                      </Label>
                      <Input
                        value={settings.tagline || ""}
                        onChange={(e) =>
                          setSettings({ ...settings, tagline: e.target.value })
                        }
                        placeholder="Luxury Niche Perfumes & Haute Parfumerie"
                        className="text-xs h-9 font-normal"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs font-normal">
                        Header Announcement Ticker
                      </Label>
                      <Input
                        value={settings.announcementText || ""}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            announcementText: e.target.value,
                          })
                        }
                        placeholder="Complimentary sample with each flacon"
                        className="text-xs h-9 font-normal"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-normal">
                      Footer Brand Description
                    </Label>
                    <Textarea
                      value={settings.footerDescription || ""}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          footerDescription: e.target.value,
                        })
                      }
                      rows={2}
                      className="text-xs font-normal"
                    />
                  </div>

                  {/* Multi-Color Brand Theme */}
                  <div className="space-y-3 pt-4 border-t border-border/40">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <Label className="text-xs font-normal uppercase tracking-wider text-muted-foreground">
                          Brand Color Palette
                        </Label>
                        <p className="text-[11px] font-normal text-muted-foreground">
                          Customize primary, secondary, and accent colors across buttons and highlights.
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {[
                          {
                            label: "Midnight & Gold",
                            primary: "#09090b",
                            secondary: "#c5a059",
                            accent: "#18181b",
                          },
                          {
                            label: "Monochrome",
                            primary: "#111111",
                            secondary: "#71717a",
                            accent: "#27272a",
                          },
                          {
                            label: "Emerald & Ivory",
                            primary: "#064e3b",
                            secondary: "#d4af37",
                            accent: "#065f46",
                          },
                          {
                            label: "Noir & Rose",
                            primary: "#1f1218",
                            secondary: "#b76e79",
                            accent: "#3b1d2a",
                          },
                        ].map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() =>
                              setSettings({
                                ...settings,
                                primaryColor: preset.primary,
                                secondaryColor: preset.secondary,
                                accentColor: preset.accent,
                              })
                            }
                            className="inline-flex items-center gap-1.5 px-2 py-1 rounded border border-border/60 text-[11px] font-normal hover:bg-muted/40 transition-colors cursor-pointer"
                          >
                            <span
                              className="size-2.5 rounded-full border border-border/40"
                              style={{ backgroundColor: preset.primary }}
                            />
                            <span
                              className="size-2.5 rounded-full border border-border/40"
                              style={{ backgroundColor: preset.secondary }}
                            />
                            <span>{preset.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-normal">
                          Primary Color
                        </Label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={settings.primaryColor || "#09090b"}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                primaryColor: e.target.value,
                              })
                            }
                            className="h-9 w-12 rounded border border-border/60 bg-transparent p-0.5 cursor-pointer"
                          />
                          <Input
                            value={settings.primaryColor || "#09090b"}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                primaryColor: e.target.value,
                              })
                            }
                            className="h-9 text-xs font-mono font-normal"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-normal">
                          Secondary / Gold Color
                        </Label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={settings.secondaryColor || "#c5a059"}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                secondaryColor: e.target.value,
                              })
                            }
                            className="h-9 w-12 rounded border border-border/60 bg-transparent p-0.5 cursor-pointer"
                          />
                          <Input
                            value={settings.secondaryColor || "#c5a059"}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                secondaryColor: e.target.value,
                              })
                            }
                            className="h-9 text-xs font-mono font-normal"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-normal">
                          Accent Color
                        </Label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={settings.accentColor || "#18181b"}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                accentColor: e.target.value,
                              })
                            }
                            className="h-9 w-12 rounded border border-border/60 bg-transparent p-0.5 cursor-pointer"
                          />
                          <Input
                            value={settings.accentColor || "#18181b"}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                accentColor: e.target.value,
                              })
                            }
                            className="h-9 text-xs font-mono font-normal"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border/40">
                    <div className="space-y-1">
                      <Label className="text-xs font-normal">Hotline Phone</Label>
                      <Input
                        value={settings.supportPhone || ""}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            supportPhone: e.target.value,
                          })
                        }
                        className="text-xs h-9 font-normal"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs font-normal">
                        WhatsApp Number
                      </Label>
                      <Input
                        value={settings.whatsappNumber || ""}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            whatsappNumber: e.target.value,
                          })
                        }
                        className="text-xs h-9 font-normal"
                      />
                    </div>
                  </div>

                  {/* Delivery & Shipping Charges */}
                  <div className="space-y-3 pt-4 border-t border-border/40">
                    <div>
                      <Label className="text-xs font-normal uppercase tracking-wider text-muted-foreground">
                        Delivery &amp; Shipping Charges (৳)
                      </Label>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Configure zone-based delivery fees and free shipping threshold shown at checkout.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <Label className="text-xs font-normal">
                          Inside Dhaka (৳)
                        </Label>
                        <Input
                          type="number"
                          min={0}
                          value={settings.insideDhakaShipping ?? 60}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              insideDhakaShipping: Number(e.target.value) || 0,
                            })
                          }
                          className="text-xs h-9 font-normal"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs font-normal">
                          Dhaka Sub-Area (৳)
                        </Label>
                        <Input
                          type="number"
                          min={0}
                          value={settings.dhakaSubAreaShipping ?? 100}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              dhakaSubAreaShipping: Number(e.target.value) || 0,
                            })
                          }
                          className="text-xs h-9 font-normal"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs font-normal">
                          Outside Dhaka (৳)
                        </Label>
                        <Input
                          type="number"
                          min={0}
                          value={settings.outsideDhakaShipping ?? 120}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              outsideDhakaShipping: Number(e.target.value) || 0,
                            })
                          }
                          className="text-xs h-9 font-normal"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs font-normal">
                          Free Shipping Min (৳)
                        </Label>
                        <Input
                          type="number"
                          min={0}
                          placeholder="e.g. 5000"
                          value={settings.freeShippingThreshold ?? ""}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              freeShippingThreshold:
                                e.target.value === ""
                                  ? null
                                  : Number(e.target.value),
                            })
                          }
                          className="text-xs h-9 font-normal"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Storefront Payment Methods */}
                  <div className="space-y-3 pt-4 border-t border-border/40">
                    <div>
                      <Label className="text-xs font-normal uppercase tracking-wider text-muted-foreground">
                        Checkout Payment Methods
                      </Label>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Select which payment options customers can use at checkout.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {[
                        { id: "COD", label: "Cash on Delivery" },
                        { id: "BKASH", label: "bKash" },
                        { id: "NAGAD", label: "Nagad" },
                        { id: "ROCKET", label: "Rocket" },
                        { id: "SSLCOMMERZ", label: "SSLCommerz / Card" },
                        { id: "AAMARPAY", label: "aamarPay" },
                      ].map((method) => {
                        const current =
                          settings.enabledPaymentMethods &&
                          settings.enabledPaymentMethods.length > 0
                            ? settings.enabledPaymentMethods
                            : ["COD", "BKASH", "NAGAD", "SSLCOMMERZ"];
                        const isEnabled = current.includes(method.id);

                        return (
                          <button
                            key={method.id}
                            type="button"
                            onClick={() => {
                              if (isEnabled && current.length <= 1) {
                                toast.error(
                                  "At least one payment method must remain enabled"
                                );
                                return;
                              }
                              const next = isEnabled
                                ? current.filter((m) => m !== method.id)
                                : [...current, method.id];
                              setSettings({
                                ...settings,
                                enabledPaymentMethods: next,
                              });
                            }}
                            className={`flex items-center justify-between px-3 py-2.5 rounded border text-left text-xs transition-colors cursor-pointer ${
                              isEnabled
                                ? "border-foreground bg-foreground/5 text-foreground"
                                : "border-border/60 text-muted-foreground hover:border-border"
                            }`}
                          >
                            <span className="font-normal">{method.label}</span>
                            <span
                              className={`size-2.5 rounded-full border ${
                                isEnabled
                                  ? "bg-emerald-500 border-emerald-500"
                                  : "bg-transparent border-muted-foreground/40"
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Button
                      size="sm"
                      onClick={handleSaveSettings}
                      disabled={isPending}
                      className="text-xs font-normal cursor-pointer gap-1.5"
                    >
                      <Save className="size-3.5" />
                      <span>{isPending ? "Saving..." : "Save Settings"}</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === "BANNERS" && (
            <motion.div
              key="banners-tab"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="space-y-4"
            >
              <div className="flex justify-end">
                <Button
                  size="sm"
                  onClick={() => setIsAddBannerOpen(true)}
                  className="h-8 text-xs font-normal cursor-pointer gap-1.5"
                >
                  <Plus className="size-3.5" />
                  <span>Add Banner</span>
                </Button>
              </div>

              <div className="rounded-lg border border-border/50 bg-card overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="text-xs font-normal">Banner</TableHead>
                      <TableHead className="text-xs font-normal">Title</TableHead>
                      <TableHead className="text-xs font-normal">Placement</TableHead>
                      <TableHead className="text-xs font-normal">Link</TableHead>
                      <TableHead className="text-xs font-normal text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {banners.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-32 text-center text-xs text-muted-foreground font-normal">
                          No banners configured yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      banners.map((b) => (
                        <TableRow key={b.id} className="hover:bg-muted/20">
                          <TableCell>
                            <div className="relative size-10 rounded border overflow-hidden bg-muted">
                              {b.imageUrl ? (
                                <Image
                                  src={b.imageUrl}
                                  alt={b.title}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <ImageIcon className="size-4 m-auto text-muted-foreground" />
                              )}
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="space-y-0.5">
                              <div className="font-normal text-xs text-foreground">{b.title}</div>
                              {b.subtitle && (
                                <div className="text-[11px] text-muted-foreground line-clamp-1">
                                  {b.subtitle}
                                </div>
                              )}
                            </div>
                          </TableCell>

                          <TableCell>
                            <Badge variant="outline" className="text-[10px] font-normal text-muted-foreground">
                              {b.position.replace(/_/g, " ")}
                            </Badge>
                          </TableCell>

                          <TableCell>
                            <span className="font-mono text-xs text-muted-foreground">{b.ctaLink || "/products"}</span>
                          </TableCell>

                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteBanner(b.id)}
                              className="size-7 p-0 cursor-pointer text-muted-foreground hover:text-foreground"
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </motion.div>
          )}

          {activeTab === "SHOWROOMS" && (
            <motion.div
              key="showrooms-tab"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="space-y-4"
            >
              <div className="flex justify-end">
                <Button
                  size="sm"
                  onClick={() => setIsAddShowroomOpen(true)}
                  className="h-8 text-xs font-normal cursor-pointer gap-1.5"
                >
                  <Plus className="size-3.5" />
                  <span>Add Showroom</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {showrooms.length === 0 ? (
                  <div className="col-span-2 p-8 text-center text-xs text-muted-foreground border rounded-lg bg-card font-normal">
                    No physical boutiques listed yet
                  </div>
                ) : (
                  showrooms.map((room) => (
                    <Card key={room.id} className="shadow-none border-border/50 bg-card">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div className="space-y-0.5">
                            <CardTitle className="text-xs font-normal text-foreground">
                              {room.name}
                            </CardTitle>
                            <div className="text-[11px] text-muted-foreground font-normal">
                              {room.thana}, {room.district}
                            </div>
                          </div>
                          <Badge variant="outline" className="text-[10px] font-normal text-muted-foreground">
                            Open
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-1.5 text-xs font-normal">
                        <p className="text-muted-foreground">{room.fullAddress}</p>
                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-border/30 text-muted-foreground">
                          <span>Phone: {room.phoneNumber}</span>
                          <span>Hours: {room.openingHours}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Tabs>

      {/* Add Banner Dialog */}
      <Dialog open={isAddBannerOpen} onOpenChange={setIsAddBannerOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-normal">
              Add Banner Slide
            </DialogTitle>
            <DialogDescription className="text-xs font-normal">
              Upload a campaign banner
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label className="text-xs font-normal">Banner Title</Label>
              <Input
                placeholder="Title"
                value={bannerTitle}
                onChange={(e) => setBannerTitle(e.target.value)}
                className="text-xs h-9 font-normal"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-normal">Subtitle (Optional)</Label>
              <Input
                placeholder="Subtitle"
                value={bannerSubtitle}
                onChange={(e) => setBannerSubtitle(e.target.value)}
                className="text-xs h-9 font-normal"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-normal">Image URL</Label>
              <Input
                placeholder="https://..."
                value={bannerImage}
                onChange={(e) => setBannerImage(e.target.value)}
                className="text-xs h-9 font-normal"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-normal">Display Position</Label>
                <Select value={bannerPosition} onValueChange={(val) => setBannerPosition(val as BannerPosition)}>
                  <SelectTrigger className="text-xs h-9 font-normal">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HERO_SLIDER" className="text-xs font-normal">Hero Slider</SelectItem>
                    <SelectItem value="PROMO_BANNER" className="text-xs font-normal">Promo Banner</SelectItem>
                    <SelectItem value="CATEGORY_BANNER" className="text-xs font-normal">Category Header</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-normal">CTA Link</Label>
                <Input
                  value={bannerCtaLink}
                  onChange={(e) => setBannerCtaLink(e.target.value)}
                  placeholder="/products"
                  className="text-xs h-9 font-normal"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddBannerOpen(false)}
              disabled={isPending}
              className="text-xs font-normal"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleCreateBanner}
              disabled={isPending}
              className="text-xs font-normal cursor-pointer"
            >
              {isPending ? "Creating..." : "Save Banner"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Showroom Dialog */}
      <Dialog open={isAddShowroomOpen} onOpenChange={setIsAddShowroomOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-normal">
              Register Showroom
            </DialogTitle>
            <DialogDescription className="text-xs font-normal">
              Add boutique location
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label className="text-xs font-normal">Boutique Name</Label>
              <Input
                placeholder="FIFTH SENSE Atelier"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="text-xs h-9 font-normal"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-normal">District</Label>
                <Input
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="text-xs h-9 font-normal"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-normal">Thana / Area</Label>
                <Input
                  value={thana}
                  onChange={(e) => setThana(e.target.value)}
                  className="text-xs h-9 font-normal"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-normal">Full Address</Label>
              <Input
                placeholder="Address"
                value={fullAddress}
                onChange={(e) => setFullAddress(e.target.value)}
                className="text-xs h-9 font-normal"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-normal">Phone</Label>
                <Input
                  placeholder="01712345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="text-xs h-9 font-normal"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-normal">Opening Hours</Label>
                <Input
                  value={openingHours}
                  onChange={(e) => setOpeningHours(e.target.value)}
                  className="text-xs h-9 font-normal"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddShowroomOpen(false)}
              disabled={isPending}
              className="text-xs font-normal"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleCreateShowroom}
              disabled={isPending}
              className="text-xs font-normal cursor-pointer"
            >
              {isPending ? "Registering..." : "Save Showroom"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
