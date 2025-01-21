import { FC } from "react";

import { createElementSmartLink, createItemSmartLink } from "../../lib/utils/smartLinkUtils";

type ItemId = Readonly<{
  itemId: string | undefined;
}>;

type ElementCodename = Readonly<{
  elementCodename: string;
}>;

type Props = (ItemId | ElementCodename)  & {
  isPreview?: boolean //TODO: when converted to app router change this to non-undefined type
};

export const StandaloneSmartLinkButton: FC<Props> = props => {
  if (!props.isPreview) {
    return null;
  }

  return (
    <div
      className="absolute right-0 top-0 w-12 h-12 m-0"
      {..."itemId" in props ? createItemSmartLink(props.itemId) : createElementSmartLink(props.elementCodename)}
    />
  );
};
