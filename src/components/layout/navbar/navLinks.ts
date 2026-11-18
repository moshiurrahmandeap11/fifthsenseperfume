export interface INavLink {
  title: string;
  href: string;
  description?: string;
}

export const STOREFRONT_NAV_LINKS: INavLink[] = [
  {
    title: "Home",
    href: "/",
    description: "Fifth Sense Haute Parfumerie",
  },
  {
    title: "Catalog",
    href: "/products",
    description: "Browse all artisanal perfumes & extraits",
  },
  {
    title: "Men",
    href: "/products?gender=MEN",
    description: "Woody, smoky oud & leather elixirs",
  },
  {
    title: "Women",
    href: "/products?gender=WOMEN",
    description: "Grasse floral, vanilla & powdery extraits",
  },
  {
    title: "Winter Collection",
    href: "/products?collection=winter",
    description: "Warm amber, spiced cognac & smoked woods",
  },
  {
    title: "Contact",
    href: "/contact",
    description: "Bespoke perfume consultations & atelier",
  },
];
