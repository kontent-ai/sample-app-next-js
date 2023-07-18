import Image from 'next/image';
import { FC, ReactNode } from "react";

import { createItemSmartLink } from "../../../lib/utils/smartLinkUtils";

type Props = Readonly<{
  url: string;
  children: ReactNode;
  className?: string;
  itemId?: string;
}>;

export const HeroImage: FC<Props> = props => (
  <figure
    className={`relative m-0 w-full h-screen md:h-[36rem] ${props.className ?? ""}`}
    {...createItemSmartLink(props.itemId)}
  >
    <Image
      src={props.url}
      alt="Hero image"
      fill
      className="object-cover"
      sizes="(max-width: 1200px) 100vw, 80vw"
      priority
    />
    <div className="relative w-fit h-full flex flex-col items-center md:items-start justify-end pb-32 md:pb-12 px-6">
        {props.children}
    </div>
  </figure>
);

HeroImage.displayName = "HeroImage";
