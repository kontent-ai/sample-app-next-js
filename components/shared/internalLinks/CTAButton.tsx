import Link from "next/link";
import React from "react";

import {
  mainColorButtonClass,
  mainColorHoverClass,
} from "../../../lib/constants/colors";
import { resolveReference } from "../../../lib/routing";
import { siteCodename } from "../../../lib/utils/env";
import { Action, Fact, Nav_NavigationItem } from "../../../models";

type Props = {
  reference: Fact | Action | Nav_NavigationItem;
};

export const CTAButton = (props: Props) => {
  const factUrl =
    props.reference.elements.referenceExternalUri.value ||
      props.reference.elements.referenceContentItemLink.linkedItems.length > 0
      ? resolveReference(props.reference)
      : null;
  return (
    <Link href={factUrl ?? ""}>
      <button
        className={`${mainColorButtonClass[siteCodename]} bottom-0 group left-0 ${mainColorHoverClass[siteCodename]} text-white font-bold mt-10 py-2 px-4 rounded`}
      >
        <span>{props.reference.elements.referenceLabel.value}</span>
      </button>
    </Link>
  );
};
