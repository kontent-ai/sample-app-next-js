import Image from "next/image"
import Link from "next/link";
import { FC } from "react";

import { formatDate } from "../../lib/utils/dateTime";
import { StandaloneSmartLinkButton } from "../shared/StandaloneSmartLinkButton";

type Props = Readonly<{
  imageUrl: string;
  title: string;
  detailUrl: string;
  description: string,
  publishingDate: string | null,
  itemId?: string;
}>;

export const ArticleItem: FC<Props> = props => (
  <li className="m-0 p-0 w-full h-full relative md:rounded-lg shadow hover:shadow-xl transition-shadow border border-gray-200 cursor-pointer">
    <Link
      href={props.detailUrl}
      className="no-underline group h-full flex flex-col"
    >
      <StandaloneSmartLinkButton itemId={props.itemId} />
      <figure className="w-full relative m-0 h-40 not-prose">
        <Image
          src={props.imageUrl}
          alt={props.title}
          fill
          sizes="(max-width: 635px) 100vw, (max-width: 1275px) 50vw, 25vw"
          className="object-cover h-full m-0 p-0 md:rounded-t-lg"
        />
        {props.publishingDate && (
        <div className="w-fit p-2 bg-gray-800 text-white opacity-90 font-normal absolute right-0 bottom-0">
          <p className="m-0 w-fit not-prose">{formatDate(props.publishingDate)}</p>
        </div>
      )}
      </figure>
    
      <div className="p-5 grow">
        <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 no-underline line-clamp-1 ">{props.title}</h5>
        <p className="mb-0 font-normal text-gray-700 line-clamp-6">{props.description}</p>
      </div>
      <button className="group-hover:bg-mainHoverColor bg-mainButtonColor block ml-auto w-fit mb-3 mr-4 font-semibold border text-white py-2 px-4 md:rounded">
        <span>Continue reading</span>
      </button>
    </Link>
  </li>
);

ArticleItem.displayName = "ListItem";
