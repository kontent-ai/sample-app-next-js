import { FC, ReactNode } from "react";
import Image from 'next/image';

type Props = Readonly<{
  url: string;
  children: ReactNode;
  className?: string;
  itemId?: string;
}>;

export const HeroImage: FC<Props> = props => (
  <figure
    className={`relative w-full h-[32rem] ${props.className ?? ""}`}
    data-kontent-item-id={props.itemId}
  >
    <Image
      src={props.url}
      alt="Hero image"
      fill
      className="object-cover"
      priority
    />
    <div className="relative w-full h-full flex justify-start items-end">
      <div className="backdrop-contrast-100 bg-white/70 p-10 rounded-tr-lg backdrop-opacity-5">
        {props.children}
      </div>
    </div>
  </figure>
);

HeroImage.displayName = "HeroImage";
