"use client";

import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type FC, useState } from "react";
import { graniteBrandName, graniteNavItems } from "../../lib/constants/graniteView.ts";
import { GraniteLogo } from "./GraniteLogo.tsx";

const isCurrentPath = (href: string, pathname: string) => {
  if (href === "/") {
    return pathname === "/" || pathname === "";
  }

  return pathname === href;
};

export const GraniteHeader: FC = () => {
  const pathname = usePathname() ?? "";
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-granite-line bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:justify-start">
        <Link
          className="flex w-auto shrink-0 items-center gap-2 text-granite-navy no-underline lg:w-56"
          href="/"
        >
          <GraniteLogo className="h-8 w-8 text-granite-navy" />
          <span className="text-lg font-bold tracking-tight">{graniteBrandName}</span>
        </Link>
        <nav
          aria-label="Primary"
          className="hidden flex-1 items-center justify-center gap-7 lg:flex"
        >
          {graniteNavItems.map((item) => {
            const isActive = isCurrentPath(item.href, pathname);

            return (
              <Link
                aria-current={isActive ? "page" : undefined}
                className={`text-[15px] font-medium text-granite-navy no-underline ${
                  isActive
                    ? "border-b-[3px] border-granite-navy pb-1"
                    : "pb-1 hover:text-granite-muted"
                }`}
                href={item.href}
                key={item.label}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden w-56 shrink-0 lg:block" />
        <button
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Close the menu" : "Open the menu"}
          className="inline-flex items-center justify-center text-granite-navy lg:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          type="button"
        >
          {isMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>
      {isMenuOpen ? (
        <nav
          aria-label="Mobile"
          className="border-t border-granite-line bg-white px-6 py-3 lg:hidden"
        >
          <ul className="flex flex-col gap-3">
            {graniteNavItems.map((item) => (
              <li key={item.label}>
                <Link
                  className="block py-1 text-granite-navy no-underline"
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
};
