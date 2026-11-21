export interface ISubLink {
  title: string;
  href: string;
  description?: string;
}

export interface INavLink {
  title: string;
  href: string;
  hasDropdown?: boolean;
  sublinks?: ISubLink[];
}

export const STOREFRONT_NAV_LINKS: INavLink[] = [
  {
    title: "HOME",
    href: "/",
  },
  {
    title: "SHOP",
    href: "/products",
    hasDropdown: true,
    sublinks: [
      {
        title: "All Artisanal Fragrances",
        href: "/products",
        description: "Explore the complete Fifth Sense olfactory collection",
      },
      {
        title: "Men's Collection",
        href: "/products?gender=MEN",
        description: "Smoky birch, Cambodian oud & Tuscan leather",
      },
      {
        title: "Women's Collection",
        href: "/products?gender=WOMEN",
        description: "Grasse floral, white amber & velvety santal",
      },
      {
        title: "Winter Amber Elixirs",
        href: "/products?collection=winter",
        description: "Spiced cognac, aged rum & smoked woods",
      },
      {
        title: "Signature Extraits de Parfum",
        href: "/products?concentration=extrait",
        description: "High-concentration 35% pure perfume oils",
      },
    ],
  },
  {
    title: "SHOP ALL",
    href: "/products",
  },
  {
    title: "OUR STORY",
    href: "/contact#atelier",
  },
  {
    title: "CONTACT US",
    href: "/contact",
  },
  {
    title: "TRACK YOUR ORDER",
    href: "/customer/dashboard",
  },
];
