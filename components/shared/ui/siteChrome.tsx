"use client";

import { usePathname } from "next/navigation";
import type { FC, ReactNode } from "react";
import { siteCodename } from "../../../lib/utils/env.ts";
import type { Nav_NavigationItem } from "../../../models/content-types/Nav_navigationItem.ts";
import { Footer } from "./footer.tsx";
import { Menu } from "./menu.tsx";

type Props = Readonly<{
  children: ReactNode;
  item: Nav_NavigationItem | null;
}>;

const isHomepagePath = (pathname: string) =>
  pathname === "/" ||
  pathname === "" ||
  /^\/[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}\/?$/i.test(pathname);

export const SiteChrome: FC<Props> = ({ children, item }) => {
  const pathname = usePathname() ?? "";
  const isHomepage = isHomepagePath(pathname);

  if (isHomepage) {
    return <div className="w-full">{children}</div>;
  }

  return (
    <div
      className="flex min-h-full flex-col items-center overflow-hidden"
      data-theme={siteCodename}
    >
      {item ? <Menu item={item} /> : null}
      <main className="grow">{children}</main>
      <Footer />
    </div>
  );
};
