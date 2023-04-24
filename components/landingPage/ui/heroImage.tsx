import { FC, ReactNode } from "react";
import Image from 'next/image';

type Props = Readonly<{
  url: string;
  children: ReactNode;
  className?: string;
}>;

export const HeroImage: FC<Props> = props => (
  <figure className={`relative w-full h-[32rem] ${props.className ?? ""}`}>
    <Image
      src={props.url}
      alt="Hero image"
      fill
      className="object-cover"
    />
    {props.children}
  </figure>
);

HeroImage.displayName = "HeroImage";
