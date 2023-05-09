import { FC } from "react";
import { Author, contentTypes } from "../../models"
import Image from "next/image";
import { createElementSmartLink, createItemSmartLink } from "../../lib/utils/smartLinkUtils";

type Props = Readonly<{
  item: Author;
  className?: string;
}>;

export const AuthorVertical: FC<Props> = props => {
  const fullName = `${props.item.elements.firstName.value} ${props.item.elements.lastName.value}`;
  return (
    <div
      className={`${props.className ?? ""} relative flex flex-col shrink-0 not-prose items-center overflow-hidden`}
      {...createItemSmartLink(props.item.system.id)}
    >
      <figure
        className="relative rounded-full w-28 h-28 overflow-hidden"
      >
        <Image
          src={props.item.elements.photograph.value[0]?.url ?? "missing author image url"}
          alt={`Avatar of author ${fullName}.`}
          fill
          className="object-cover"
        />
      </figure>
      <div className="relative flex flex-col items-center">
        <span className="flex gap-2">
          <span {...createElementSmartLink(contentTypes.author.elements.first_name.codename, true)}>{props.item.elements.firstName.value}</span>
          <span {...createElementSmartLink(contentTypes.author.elements.last_name.codename, true)}>{props.item.elements.lastName.value}</span>
        </span>
        <em
          className="text-sm truncate"
          {...createElementSmartLink(contentTypes.author.elements.occupation.codename, true)}
        >
          ({props.item.elements.occupation.value})
        </em>
      </div>
    </div>
  );
}
