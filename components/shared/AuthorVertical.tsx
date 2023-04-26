import { FC } from "react";
import { Author, contentTypes } from "../../models"
import Image from "next/image";

type Props = Readonly<{
  item: Author;
  className?: string;
}>;

export const AuthorVertical: FC<Props> = props => {
  const fullName = `${props.item.elements.firstName.value} ${props.item.elements.lastName.value}`;
  return (
    <figure
      className={`${props.className ?? ""} relative flex items-center justify-center rounded-full w-32 h-32 overflow-hidden`}
      data-kontent-item-id={props.item.system.id}
    >
      <Image
        src={props.item.elements.photograph.value[0]?.url ?? "missing author image url"}
        alt={`Avatar of author ${fullName}.`}
        fill
        className="object-cover"
      />
      <div className="relative flex flex-col items-center">
        <span className="flex gap-2">
          <span data-kontent-element-codename={contentTypes.author.elements.first_name.codename}>{props.item.elements.firstName.value}</span>
          <span data-kontent-element-codename={contentTypes.author.elements.last_name.codename}>{props.item.elements.lastName.value}</span>
        </span>
        <em data-kontent-element-codename={contentTypes.author.elements.occupation.codename}>({props.item.elements.occupation.value})</em>
      </div>
    </figure>
  );
}
