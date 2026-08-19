import { Inter } from "next/font/google";
import type { FC } from "react";
import type { FeaturedNotice } from "../../lib/types/compliance.ts";
import { GraniteFeaturedAlert } from "./GraniteFeaturedAlert.tsx";
import { GraniteFooter } from "./GraniteFooter.tsx";
import { GraniteHeader } from "./GraniteHeader.tsx";
import { GraniteHero } from "./GraniteHero.tsx";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

type Props = Readonly<{
  notices: ReadonlyArray<FeaturedNotice>;
}>;

export const GraniteHomepage: FC<Props> = ({ notices }) => (
  <div className={`${inter.className} w-full bg-white text-granite-navy`}>
    <GraniteHeader />
    <main>
      <GraniteHero />
      <section className="granite-dots px-6 py-16" id="featured-alert">
        {notices.length > 0 ? (
          <div className="mx-auto flex max-w-5xl flex-col gap-8">
            {notices.map((item) => (
              <GraniteFeaturedAlert item={item} key={item.system.id} />
            ))}
          </div>
        ) : (
          <p className="mx-auto max-w-5xl m-0 text-sm text-granite-muted">
            No risk alerts or regulatory notices were returned from Kontent.
          </p>
        )}
      </section>
    </main>
    <GraniteFooter />
  </div>
);

export default GraniteHomepage;
