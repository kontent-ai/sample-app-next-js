import { FC } from "react";
import Image from "next/image"
import Link from "next/link";

type Props = Readonly<{
  imageUrl: string;
  title: string;
  detailUrl: string;
}>;

export const ListItem: FC<Props> = props => (
  <li className="w-64  rounded-xl shadow hover:shadow-xl transition-shadow border cursor-pointer">
    <Link
      href={props.detailUrl}
    >
      <figure className="w-full h-40 relative">
        <Image
          src={props.imageUrl}
          alt={props.title}
          fill
          className="object-contain"
        />
      </figure>
      <div className="border-t-2 rounded border-t-gray-100 mx-3 my-3" />
      <div className="w-full flex justify-center pt-4 pb-8">
        <b>{props.title}</b>
      </div>
    </Link>
  </li>
);

ListItem.displayName = "ListItem";
