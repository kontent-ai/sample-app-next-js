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
    />
    <div className="relative w-full h-full flex justify-center items-center">
      <div>
        {props.children}
      </div>
    </div>
  </figure>
);

HeroImage.displayName = "HeroImage";
