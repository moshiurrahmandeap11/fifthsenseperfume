import {
  Compass,
  Flame,
  Home,
  Mail,
  Sparkles,
  Flower2,
} from "lucide-react";

export interface INavLink {
  title: string;
  href: string;
  icon: typeof Home;
  badge?: string;
  description?: string;
}

export const STOREFRONT_NAV_LINKS: INavLink[] = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Catalog",
    href: "/products",
    icon: Compass,
    description: "Browse all artisanal perfumes & extraits",
  },
  {
    title: "Men",
    href: "/products?gender=MEN",
    icon: Sparkles,
    description: "Woody, smoky oud & leather elixirs",
  },
  {
    title: "Women",
    href: "/products?gender=WOMEN",
    icon: Flower2,
    description: "Grasse floral, vanilla & powdery extraits",
  },
  {
    title: "Winter Collection",
    href: "/products?collection=winter",
    icon: Flame,
    badge: "Hot",
    description: "Warm amber, spiced cognac & smoked woods",
  },
  {
    title: "Contact",
    href: "/contact",
    icon: Mail,
    description: "Bespoke perfume consultations & atelier",
  },
];
