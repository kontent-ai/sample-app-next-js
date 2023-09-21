import {
  ExclamationTriangleIcon,
  InformationCircleIcon,
  LightBulbIcon,
} from "@heroicons/react/24/solid";
import { FC } from "react";

import {
  calloutTypeColor,
  mainColorBorderClass,
} from "../../../lib/constants/colors";
import { siteCodename } from "../../../lib/utils/env";
import { Component_Callout } from "../../../models";
import { RichTextElement } from "./RichTextElement";

type Props = Readonly<{
  item: Component_Callout;
}>;

export const CalloutComponent: FC<Props> = (props) => (
  <div
    className={`p-5 border-2 rounded-3xl ${mainColorBorderClass[siteCodename]}`}
  >
    <div className={`w-5 ${createIconColor(props.item)}`}>
      {renderTypeIcon(props.item)}
    </div>
    <RichTextElement
      element={props.item.elements.content}
      isInsideTable={false}
    />
  </div>
);

const renderTypeIcon = (callout: Component_Callout) => {
  switch (callout.elements.type.value[0]?.codename) {
    case OptionCodename.Warning:
      return <ExclamationTriangleIcon />;
    case OptionCodename.Info:
      return <InformationCircleIcon />;
    case OptionCodename.Lightbulb:
      return <LightBulbIcon />;
    default:
      throwUnknownType(callout);
  }
};

const createIconColor = (callout: Component_Callout) => {
  const calloutType = callout.elements.type.value[0]?.codename as CalloutType;

  if (calloutType) return calloutTypeColor[calloutType];

  throwUnknownType(callout);
};

enum OptionCodename {
  Warning = "warning",
  Info = "info",
  Lightbulb = "lightbulb",
}

type CalloutType = "warning" | "info" | "lightbulb" | undefined;

const throwUnknownType = (callout: Component_Callout) => {
  throw new Error(
    `Can't render callout of type ${callout.elements.type.value[0]?.codename}. Please make sure the app supports all possible callout types.`
  );
};
