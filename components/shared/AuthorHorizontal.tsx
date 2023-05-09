import { FC } from "react";
import { Author, contentTypes } from "../../models"
import Image from "next/image";
import { createElementSmartLink, createItemSmartLink } from "../../lib/utils/smartLinkUtils";

type Props = Readonly<{
  item: Author;
}>;

export const AuthorHorizontal: FC<Props> = props => {
  const fullName = `${props.item.elements.firstName.value} ${props.item.elements.lastName.value}`;
  return (
    <div
      className="flex items-center"
      {...createItemSmartLink(props.item.system.id)}
    >
      <figure
        className="relative rounded-full w-20 h-20 overflow-hidden"
        {...createElementSmartLink(contentTypes.author.elements.photograph.codename)}
      >
        <Image
          src={props.item.elements.photograph.value[0]?.url ?? "missing author image url"}
          alt={`Avatar of author ${fullName}.`}
          fill
          className="object-cover"
        />
      </figure>
      <div className="flex flex-col">
        <span>
          <span {...createElementSmartLink(contentTypes.author.elements.first_name.codename)}>{props.item.elements.firstName.value}</span>
          <span {...createElementSmartLink(contentTypes.author.elements.last_name.codename)}>{props.item.elements.lastName.value}</span>
        </span>
        <em {...createElementSmartLink(contentTypes.author.elements.occupation.codename)}>({props.item.elements.occupation.value})</em>
      </div>
    </div>
  );
}
