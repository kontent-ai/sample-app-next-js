import { FC } from "react";
import { Callout } from "../../../models"
import { useSiteCodename } from "../siteCodenameContext";
import { mainColorBorderClass } from "../../../lib/constants/colors";
import { transformToPortableText } from "@kontent-ai/rich-text-resolver/dist/cjs/src/transformers";
import { nodeParse } from "@kontent-ai/rich-text-resolver/dist/cjs/src/parser/node";
import { PortableText } from "@portabletext/react";
import { createDefaultResolvers } from "../../../lib/richTextResolvers";
import { ExclamationTriangleIcon, InformationCircleIcon, LightBulbIcon } from "@heroicons/react/24/solid";

type Props = Readonly<{
  item: Callout;
}>;

export const CalloutComponent: FC<Props> = props => {
  const siteCodename = useSiteCodename();
  const portableText = transformToPortableText(nodeParse(props.item.elements.content.value));

  return (
    <div className={`p-5 border-2 rounded-3xl ${mainColorBorderClass[siteCodename]}`}>
      <div className={`w-5 ${createIconColor(props.item)}`}>
        {renderTypeIcon(props.item)}
      </div>
      <PortableText value={portableText} components={createDefaultResolvers(props.item.elements.content)} />
    </div>
  );
}

const renderTypeIcon = (callout: Callout) => {
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

const createIconColor = (callout: Callout) => {
  switch (callout.elements.type.value[0]?.codename) {
    case OptionCodename.Warning:
      return "text-orange-400";
    case OptionCodename.Info:
      return "text-blue-400";
    case OptionCodename.Lightbulb:
      return "text-green-400";
    default:
      throwUnknownType(callout);
  }
};

enum OptionCodename {
  Warning = "warning",
  Info = "info",
  Lightbulb = "lightbulb",
}

const throwUnknownType = (callout: Callout) => {
  throw new Error(`Can't render callout of type ${callout.elements.type.value[0]?.codename}. Please make sure the app supports all possible callout types.`);
}
