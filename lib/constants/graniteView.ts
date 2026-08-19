export const graniteBrandName = "Granite View Group";

export const graniteNavItems = [
  { label: "Home", href: "/" },
  { label: "Markets", href: "#" },
  { label: "Risk Management", href: "#" },
  { label: "Payments", href: "#" },
  { label: "Asset Trading", href: "#" },
  { label: "About", href: "#" },
] as const;

export const graniteFooterLinks = [
  ...graniteNavItems.filter((item) => item.label !== "Home"),
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
] as const;

export const graniteHero = {
  headline: "Institutional-Grade Intelligence. Global Reach.",
  body: "Empowering institutional investors and corporate entities with rigorous, data-driven financial insights and strategic risk management solutions in an increasingly complex global market.",
  ctaLabel: "Discover Our Insights",
  ctaHref: "#featured-alert",
} as const;

export const graniteMetadata = {
  title: graniteBrandName,
  description: graniteHero.body,
} as const;
