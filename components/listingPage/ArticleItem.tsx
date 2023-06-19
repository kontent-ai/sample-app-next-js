import { FC } from "react";
import Image from "next/image"
import Link from "next/link";
import { StandaloneSmartLinkButton } from "../shared/StandaloneSmartLinkButton";
import { useSiteCodename } from "../shared/siteCodenameContext";
import { mainColorBgClass, mainColorTextClass } from "../../lib/constants/colors";

type Props = Readonly<{
  imageUrl: string;
  title: string;
  detailUrl: string;
  description: string,
  publisingDate: string | null,
  itemId?: string;
}>;

export const ArticleItem: FC<Props> = props => {
  const siteCodename = useSiteCodename()

  const formatDate = (date: string) => (new Date(date))
    .toLocaleDateString(
      'en-US',
      {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }
    )

  return (
    <li className="m-0 p-0 relative rounded-lg shadow hover:shadow-xl transition-shadow border border-gray-200 cursor-pointer">
      <Link href={props.detailUrl} className="no-underline">
        <StandaloneSmartLinkButton itemId={props.itemId} />
        <figure className="w-full relative m-0 h-40">
          <Image
            src={props.imageUrl}
            alt={props.title}
            fill
            className="object-cover h-full m-0 p-0 rounded-t-lg"
          />
        </figure>
        {props.publisingDate && <div className="w-fit p-2 bg-gray-800 text-white opacity-90 font-normal line-clamp-6 absolute right-0 translate-y-[-100%]">
          <p className="m-0 w-fit">{formatDate(props.publisingDate)}</p>
        </div>}
        <div className="p-5">
          <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 no-underline line-clamp-2 ">{props.title}</h5>
          <p className="mb-0 font-normal text-gray-700 line-clamp-6">{props.description}</p>
        </div>
        <button className={`${mainColorTextClass} block ml-auto w-fit mb-3 mr-4 font-semibold line-clamp-6 hover:bg-transparent border ${mainColorBgClass[siteCodename]} py-2 px-4 rounded`}>Continue reading</button>
      </Link>
    </li>
  );
}

ArticleItem.displayName = "ListItem";