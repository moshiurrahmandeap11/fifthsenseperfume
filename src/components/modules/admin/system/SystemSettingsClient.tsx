"use client";

import { Badge } from "@/components/ui/badge";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Building2,
  CheckCircle2,
  Globe,
  ImageIcon,
  Plus,
  Save,
  Settings,
  Sparkles,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import React, { useState, useTransition } from "react";
import toast from "react-hot-toast";

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
  const [settings, setSettings] = useState<Partial<IPlatformSettings>>(
    initialSettings || {
      brandName: "FIFTH SENSE PERFUMES",
      supportPhone: "+880 1700-000000",
      whatsappNumber: "+880 1700-000000",
      announcementText: "Free artisanal discovery sample with every Extrait de Parfum order.",
    }
  );
  const [banners, setBanners] = useState<IBanner[]>(initialBanners);
  const [showrooms, setShowrooms] = useState<IShowroomLocation[]>(initialShowrooms);
  const [activeTab, setActiveTab] = useState("BRAND");
  const [isPending, startTransition] = useTransition();

  // Add Banner Modal
  const [isAddBannerOpen, setIsAddBannerOpen] = useState(false);
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerSubtitle, setBannerSubtitle] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [bannerPosition, setBannerPosition] = useState<BannerPosition>("HERO_SLIDER");
  const [bannerCtaLink, setBannerCtaLink] = useState("/products");

  // Add Showroom Modal
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
          supportPhone: settings.supportPhone || undefined,
          whatsappNumber: settings.whatsappNumber || undefined,
          announcementText: settings.announcementText || undefined,
        });

        toast.success("Storefront and brand settings saved successfully");
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
        toast.success("Fragrance banner created");
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

  const handleDeleteBanner = (id: string) => {
    if (!confirm("Are you sure you want to delete this promotional banner?")) return;

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
      toast.error("Please fill in atelier showroom name, address and phone");
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
        toast.success("Atelier showroom registered");
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
    <div className="space-y-6">
      {/* Top Banner Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-xs border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Brand Identity
            </CardTitle>
            <Sparkles className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold tracking-tight text-foreground truncate">
              {settings.brandName || "FIFTH SENSE"}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Haute Parfumerie &amp; Olfactory Atelier
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Active Hero Banners
            </CardTitle>
            <ImageIcon className="size-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {banners.length}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Visual campaigns &amp; collection launches
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Atelier Boutiques
            </CardTitle>
            <Building2 className="size-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {showrooms.length}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Physical olfactory lounges &amp; testing bars
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="h-9 mb-4">
          <TabsTrigger value="BRAND" className="text-xs cursor-pointer">
            Brand &amp; Support Info
          </TabsTrigger>
          <TabsTrigger value="BANNERS" className="text-xs cursor-pointer">
            Hero &amp; Promo Banners ({banners.length})
          </TabsTrigger>
          <TabsTrigger value="SHOWROOMS" className="text-xs cursor-pointer">
            Atelier Showrooms ({showrooms.length})
          </TabsTrigger>
        </TabsList>

        {/* Brand Tab */}
        <TabsContent value="BRAND" className="mt-0">
          <Card className="shadow-xs border-border/60">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-sm font-bold text-foreground">
                FIFTH SENSE Storefront &amp; Concierge Configuration
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Update luxury brand presentation, concierge telephone hotline, and top header ticker
              </p>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Brand Name</Label>
                  <Input
                    value={settings.brandName || ""}
                    onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
                    className="text-xs h-9 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Customer Concierge Hotline</Label>
                  <Input
                    value={settings.supportPhone || ""}
                    onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                    className="text-xs h-9"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Official WhatsApp Support</Label>
                  <Input
                    value={settings.whatsappNumber || ""}
                    onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                    className="text-xs h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Storefront Header Announcement Ticker</Label>
                  <Input
                    value={settings.announcementText || ""}
                    onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                    placeholder="e.g. Complimentary 2ml Discovery sample included with each flacon"
                    className="text-xs h-9"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  size="sm"
                  onClick={handleSaveSettings}
                  disabled={isPending}
                  className="text-xs cursor-pointer gap-1.5"
                >
                  <Save className="size-3.5" />
                  <span>{isPending ? "Saving..." : "Save Brand Settings"}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Banners Tab */}
        <TabsContent value="BANNERS" className="mt-0 space-y-4">
          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={() => setIsAddBannerOpen(true)}
              className="h-8 text-xs cursor-pointer gap-1.5"
            >
              <Plus className="size-3.5" />
              <span>Add Promotional Banner</span>
            </Button>
          </div>

          <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="text-xs font-semibold">Banner</TableHead>
                  <TableHead className="text-xs font-semibold">Title &amp; Subtitle</TableHead>
                  <TableHead className="text-xs font-semibold">Placement</TableHead>
                  <TableHead className="text-xs font-semibold">Call to Action Link</TableHead>
                  <TableHead className="text-xs font-semibold text-right">Delete</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {banners.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-36 text-center text-xs text-muted-foreground">
                      No banners configured yet. Add your hero visual slider slides.
                    </TableCell>
                  </TableRow>
                ) : (
                  banners.map((b) => (
                    <TableRow key={b.id} className="hover:bg-muted/20">
                      <TableCell>
                        <div className="relative size-12 rounded-md border overflow-hidden bg-muted">
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
                          <div className="font-semibold text-xs text-foreground">{b.title}</div>
                          {b.subtitle && (
                            <div className="text-[11px] text-muted-foreground line-clamp-1">
                              {b.subtitle}
                            </div>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline" className="text-[10px]">
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
                          className="size-7 p-0 cursor-pointer text-destructive hover:bg-destructive/10"
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
        </TabsContent>

        {/* Showrooms Tab */}
        <TabsContent value="SHOWROOMS" className="mt-0 space-y-4">
          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={() => setIsAddShowroomOpen(true)}
              className="h-8 text-xs cursor-pointer gap-1.5"
            >
              <Plus className="size-3.5" />
              <span>Add Boutique Location</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {showrooms.length === 0 ? (
              <div className="col-span-2 p-8 text-center text-xs text-muted-foreground border rounded-xl bg-card">
                No physical boutiques listed yet. Add your atelier testing lounges.
              </div>
            ) : (
              showrooms.map((room) => (
                <Card key={room.id} className="shadow-xs border-border/60">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="space-y-0.5">
                        <CardTitle className="text-sm font-bold text-foreground">
                          {room.name}
                        </CardTitle>
                        <div className="text-[11px] text-muted-foreground">
                          {room.thana}, {room.district}
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-300">
                        Open
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs">
                    <p className="text-muted-foreground">{room.fullAddress}</p>
                    <div className="flex items-center justify-between text-[11px] pt-1 border-t text-muted-foreground">
                      <span>Phone: {room.phoneNumber}</span>
                      <span>Hours: {room.openingHours}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Banner Dialog */}
      <Dialog open={isAddBannerOpen} onOpenChange={setIsAddBannerOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <ImageIcon className="size-4 text-primary" />
              Add Promotional Hero Slide
            </DialogTitle>
            <DialogDescription className="text-xs">
              Upload a luxury showcase banner for the storefront
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Banner Title <span className="text-destructive">*</span></Label>
              <Input
                placeholder="e.g. OUD ROYAL &bull; EXTRAIT DE PARFUM"
                value={bannerTitle}
                onChange={(e) => setBannerTitle(e.target.value)}
                className="text-xs h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Subtitle / Tagline</Label>
              <Input
                placeholder="e.g. Handcrafted in Grasse. Infused with 35% pure Cambodian Agarwood."
                value={bannerSubtitle}
                onChange={(e) => setBannerSubtitle(e.target.value)}
                className="text-xs h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Image URL <span className="text-destructive">*</span></Label>
              <Input
                placeholder="https://..."
                value={bannerImage}
                onChange={(e) => setBannerImage(e.target.value)}
                className="text-xs h-9"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Display Position</Label>
                <Select value={bannerPosition} onValueChange={(val) => setBannerPosition(val as BannerPosition)}>
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HERO_SLIDER">Hero Slider</SelectItem>
                    <SelectItem value="PROMO_BANNER">Promo Banner</SelectItem>
                    <SelectItem value="CATEGORY_BANNER">Category Header</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Call to Action Link</Label>
                <Input
                  value={bannerCtaLink}
                  onChange={(e) => setBannerCtaLink(e.target.value)}
                  placeholder="/products"
                  className="text-xs h-9"
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
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleCreateBanner}
              disabled={isPending}
              className="text-xs cursor-pointer"
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
            <DialogTitle className="flex items-center gap-2 text-base">
              <Building2 className="size-4 text-primary" />
              Register Atelier Showroom
            </DialogTitle>
            <DialogDescription className="text-xs">
              Add an olfactory boutique lounge location
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Atelier / Boutique Name <span className="text-destructive">*</span></Label>
              <Input
                placeholder="e.g. FIFTH SENSE Atelier Gulshan"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="text-xs h-9"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">District</Label>
                <Input
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="text-xs h-9"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Thana / Area</Label>
                <Input
                  value={thana}
                  onChange={(e) => setThana(e.target.value)}
                  className="text-xs h-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Full Address <span className="text-destructive">*</span></Label>
              <Input
                placeholder="e.g. Road 11, Block D, Banani / Gulshan 1, Dhaka"
                value={fullAddress}
                onChange={(e) => setFullAddress(e.target.value)}
                className="text-xs h-9"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Phone Number <span className="text-destructive">*</span></Label>
                <Input
                  placeholder="01712345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="text-xs h-9"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Opening Hours</Label>
                <Input
                  value={openingHours}
                  onChange={(e) => setOpeningHours(e.target.value)}
                  className="text-xs h-9"
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
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleCreateShowroom}
              disabled={isPending}
              className="text-xs cursor-pointer"
            >
              {isPending ? "Registering..." : "Save Showroom"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
