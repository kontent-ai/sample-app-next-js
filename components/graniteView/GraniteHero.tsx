import { ArrowRightIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import type { FC } from "react";
import { graniteHero } from "../../lib/constants/graniteView.ts";

export const GraniteHero: FC = () => (
  <section className="granite-grid px-6 py-16 md:py-24">
    <div className="mx-auto max-w-6xl">
      <div className="max-w-xl border border-granite-line bg-white px-8 py-10 md:px-10 md:py-12">
        <h1 className="m-0 max-w-md text-4xl font-bold leading-tight tracking-tight text-granite-navy md:text-5xl">
          {graniteHero.headline}
        </h1>
        <p className="mt-5 max-w-lg text-[15px] leading-7 text-granite-muted">{graniteHero.body}</p>
        <Link
          className="mt-8 inline-flex items-center gap-2 bg-granite-gold px-5 py-3 text-sm font-semibold text-white no-underline transition-colors hover:bg-granite-gold-hover"
          href={graniteHero.ctaHref}
        >
          {graniteHero.ctaLabel}
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </div>
  </section>
);
