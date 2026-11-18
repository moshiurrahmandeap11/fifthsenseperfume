import {
  Compass,
  Flame,
  Footprints,
  Home,
  Mail,
  Users,
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
    description: "Browse all premium footwear",
  },
  {
    title: "Men",
    href: "/products?gender=MEN",
    icon: Footprints,
    description: "Sneakers, boots, loafers & formal",
  },
  {
    title: "Women",
    href: "/products?gender=WOMEN",
    icon: Users,
    description: "Flats, heels, boots & sneakers",
  },
  {
    title: "Winter Collection",
    href: "/products?collection=winter",
    icon: Flame,
    badge: "Hot",
    description: "Insulated winter shoes & boots",
  },
  {
    title: "Contact",
    href: "/contact",
    icon: Mail,
    description: "Customer support & showroom outlets",
  },
];
