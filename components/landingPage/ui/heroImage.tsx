import { FC, ReactNode } from "react";
import Image from 'next/image';
import { createItemSmartLink } from "../../../lib/utils/smartLinkUtils";

type Props = Readonly<{
  url: string;
  children: ReactNode;
  className?: string;
  itemId?: string;
}>;

export const HeroImage: FC<Props> = props => (
  <figure
    className={`relative m-0 w-full h-[32rem] ${props.className ?? ""}`}
    {...createItemSmartLink(props.itemId)}
  >
    <Image
      src={props.url}
      alt="Hero image"
      fill
      className="object-cover"
      priority
    />
    <div className="relative w-full h-full flex justify-start items-end">
      <div className="max-w-[60%] bg-white/70 p-10 rounded-tr-lg">
        {props.children}
      </div>
    </div>
  </figure>
);

HeroImage.displayName = "HeroImage";
