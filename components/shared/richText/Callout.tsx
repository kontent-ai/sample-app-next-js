import {
  ExclamationTriangleIcon,
  InformationCircleIcon,
  LightBulbIcon,
} from "@heroicons/react/24/solid";
import { FC } from "react";

import {
  calloutTypeColor,
} from "../../../lib/constants/colors";
import { isCalloutType } from "../../../lib/types/calloutType";
import { RichTextElement } from "./RichTextElement";
import { Component_Callout } from "../../../models/content-types";
import { contentTypes } from "../../../models/environment";

type Props = Readonly<{
  item: Component_Callout;
}>;

export const CalloutComponent: FC<Props> = (props) => (
  <div
    className="p-5 border-2 rounded-3xl border-mainBorderColor"
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
  const { warning, info, lightbulb } = contentTypes.callout.elements.type.options;

  switch (callout.elements.type.value[0]?.codename) {
    case warning.codename:
      return <ExclamationTriangleIcon />;
    case info.codename:
      return <InformationCircleIcon />;
    case lightbulb.codename:
      return <LightBulbIcon />;
    default:
      throwUnknownType(callout);
  }
};

const createIconColor = (callout: Component_Callout) => {
  const calloutType = callout.elements.type.value[0]?.codename;

  if (isCalloutType(calloutType)) return calloutTypeColor[calloutType];

  throwUnknownType(callout);
};


const throwUnknownType = (callout: Component_Callout) => {
  throw new Error(
    `Can't render callout of type ${callout.elements.type.value[0]?.codename}. Please make sure the app supports all possible callout types.`
  );
};
