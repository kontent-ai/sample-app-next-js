import { FC } from "react";
import { Block_Callout } from "../../../models"
import { useSiteCodename } from "../siteCodenameContext";
import { mainColorBorderClass } from "../../../lib/constants/colors";
import { ExclamationTriangleIcon, InformationCircleIcon, LightBulbIcon } from "@heroicons/react/24/solid";
import { RichTextElement } from "../RichTextContent";

type Props = Readonly<{
  item: Block_Callout;
}>;

export const CalloutComponent: FC<Props> = props => {
  const siteCodename = useSiteCodename();

  return (
    <div className={`p-5 border-2 rounded-3xl ${mainColorBorderClass[siteCodename]}`}>
      <div className={`w-5 ${createIconColor(props.item)}`}>
        {renderTypeIcon(props.item)}
      </div>
      <RichTextElement element={props.item.elements.content} />
    </div>
  );
}

const renderTypeIcon = (callout: Block_Callout) => {
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

const createIconColor = (callout: Block_Callout) => {
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

const throwUnknownType = (callout: Block_Callout) => {
  throw new Error(`Can't render callout of type ${callout.elements.type.value[0]?.codename}. Please make sure the app supports all possible callout types.`);
}
