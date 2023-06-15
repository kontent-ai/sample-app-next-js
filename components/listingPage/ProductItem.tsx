import { FC } from "react";
import Image from "next/image"
import Link from "next/link";
import { StandaloneSmartLinkButton } from "../shared/StandaloneSmartLinkButton";

type Props = Readonly<{
  imageUrl: string;
  title: string;
  detailUrl: string;
  price: number | null;
  itemId?: string;
}>;

export const ProductItem: FC<Props> = props => {
  return (
  <Link href={props.detailUrl} className="no-underline p-0 m-0">
    <li className="min-w-full m-0 mr-12 ml-2 relative sm:mr-0 sm:ml-0 rounded-lg shadow hover:shadow-xl transition-shadow border border-gray-200 cursor-pointer min-h-full">
      <StandaloneSmartLinkButton itemId={props.itemId} />
      <h5 className="px-6 pt-2 text-center text-lg font-light  text-gray-900 no-underline ">{props.title}</h5>
      <figure className="w-full relative m-0 h-40">
        <Image
          src={props.imageUrl}
          alt={props.title}
          fill
          className="object-contain h-full m-0 p-0 rounded-t-lg"
        />
      </figure>

      {props.price && <p className="m-0 text-right text-xl tracking-tight font-normal p-2 top-4 ">{`${props.price} €`}</p>  }
    </li>
  </Link>
  );
}

ProductItem.displayName = "ListItem";