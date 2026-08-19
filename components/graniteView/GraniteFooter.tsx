import Link from "next/link";
import type { FC } from "react";
import { graniteBrandName, graniteFooterLinks } from "../../lib/constants/graniteView.ts";

export const GraniteFooter: FC = () => (
  <footer className="bg-granite-navy text-white">
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="m-0 text-lg font-semibold">{graniteBrandName}</p>
        <p className="mt-2 m-0 text-sm text-slate-300">
          © {new Date().getFullYear()} {graniteBrandName}. All rights reserved.
        </p>
      </div>
      <nav aria-label="Footer">
        <ul className="m-0 flex list-none flex-wrap gap-x-5 gap-y-2 p-0 text-sm text-slate-200">
          {graniteFooterLinks.map((item) => (
            <li key={item.label}>
              <Link className="text-slate-200 no-underline hover:text-white" href={item.href}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  </footer>
);
