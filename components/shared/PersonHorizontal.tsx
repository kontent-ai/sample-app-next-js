import Image from "next/image";
import { FC } from "react";

import { createElementSmartLink, createItemSmartLink } from "../../lib/utils/smartLinkUtils";
import { contentTypes,Person } from "../../models"

type Props = Readonly<{
  item: Person;
}>;

export const PersonHorizontal: FC<Props> = props => {
  const fullName = `${props.item.elements.firstName.value}${props.item.elements.lastName.value}`;
  return (
    <div
      className="flex items-center"
      {...createItemSmartLink(props.item.system.id)}
    >
      <figure
        className="relative rounded-full w-20 h-20 overflow-hidden"
        {...createElementSmartLink(contentTypes.person.elements.photograph.codename, true)}
      >
        <Image
          src={props.item.elements.photograph.value[0]?.url ?? "missing author image url"}
          alt={`Avatar of author ${fullName}.`}
          fill
          className="object-cover"
        />
      </figure>
      <div className="flex flex-col pl-4">
        <span>
          <span {...createElementSmartLink(contentTypes.person.elements.first_name.codename, true)}>{props.item.elements.firstName.value}</span>
          &nbsp;
          <span {...createElementSmartLink(contentTypes.person.elements.last_name.codename, true)}>{props.item.elements.lastName.value}</span>
        </span>
        <em {...createElementSmartLink(contentTypes.person.elements.occupation.codename, true)}>({props.item.elements.occupation.value})</em>
      </div>
    </div>
  );
}
