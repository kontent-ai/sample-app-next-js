import { Elements } from "@kontent-ai/delivery-sdk";
import { IPortableTextImage } from "@kontent-ai/rich-text-resolver";
import { PortableTextReactComponents } from "@portabletext/react";
import Image from "next/image";

export const createDefaultResolvers = (element: Elements.RichTextElement): Partial<PortableTextReactComponents> => ({
  types: {
    image: ({ value }: { value: IPortableTextImage }) => {
      const asset = element.images.find(i => i.imageId === value.asset._ref);
      return (
        <Image
          src={value.asset.url}
          alt={asset?.description ?? ""}
          width={asset?.width ?? undefined}
          height={asset?.height ?? undefined}
        />
      );
    }
  }
})
