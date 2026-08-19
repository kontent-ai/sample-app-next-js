import { ArrowRightIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import type { FC } from "react";
import {
  complianceElements,
  type FeaturedNotice,
  isRiskAlert,
} from "../../lib/types/compliance.ts";
import { formatShortDate } from "../../lib/utils/dateTime.ts";
import { createElementSmartLink, createItemSmartLink } from "../../lib/utils/smartLinkUtils.ts";
import { RichTextElement } from "../shared/richText/RichTextElement.tsx";

type Props = Readonly<{
  item: FeaturedNotice;
}>;

const getTaxonomyLabels = (item: FeaturedNotice) =>
  [
    ...item.elements[complianceElements.documentClass].value,
    ...item.elements[complianceElements.audience].value,
  ].map((term) => term.name);

export const GraniteFeaturedAlert: FC<Props> = ({ item }) => {
  const isPriorityAlert = isRiskAlert(item);
  const badgeLabel = isPriorityAlert ? "HIGH PRIORITY ALERT" : "REGULATORY NOTICE";
  const effectiveDate = item.elements[complianceElements.effectiveDate].value;
  const tags = getTaxonomyLabels(item);
  const isRestricted = item.elements[complianceElements.audience].value.some(
    (term) => term.codename === "institutional",
  );

  return (
    <article
      className="grid gap-8 border border-granite-line border-t-4 border-t-granite-gold bg-white px-8 py-10 md:grid-cols-[minmax(0,220px)_1fr] md:px-10"
      {...createItemSmartLink(item.system.id)}
    >
      <div className="flex flex-col gap-4">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-granite-cream px-3 py-1 text-[11px] font-semibold tracking-wide text-granite-navy uppercase">
          <ExclamationTriangleIcon className="h-3.5 w-3.5 text-amber-600" />
          {badgeLabel}
        </span>
        {effectiveDate ? (
          <p className="m-0 text-sm text-granite-muted">
            Effective Date:{" "}
            <span
              className="font-semibold text-granite-navy"
              {...createElementSmartLink(complianceElements.effectiveDate)}
            >
              {formatShortDate(effectiveDate)}
            </span>
          </p>
        ) : null}
        {tags.length > 0 ? (
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
            {tags.map((tag) => (
              <li
                className="rounded-sm bg-granite-tag px-2.5 py-1 text-[11px] font-semibold tracking-wide text-sky-900 uppercase"
                key={tag}
              >
                {tag}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <div>
        <h2
          className="m-0 text-2xl font-bold text-granite-navy"
          {...createElementSmartLink(complianceElements.title)}
        >
          {item.elements.title.value}
        </h2>
        <div
          className="mt-4 text-[15px] leading-7 text-granite-muted [&_p]:my-0"
          {...createElementSmartLink(complianceElements.body)}
        >
          <RichTextElement element={item.elements.body} isInsideTable={false} />
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <Link
            className="inline-flex items-center gap-2 text-sm font-semibold text-granite-navy no-underline hover:text-granite-gold"
            href="#"
          >
            Read Full Analysis
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </Link>
          {isRestricted ? (
            <p className="m-0 text-sm text-granite-muted italic">
              Restricted to Institutional Clients.
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
};

GraniteFeaturedAlert.displayName = "GraniteFeaturedAlert";
