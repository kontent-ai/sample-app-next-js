import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";
import { Elements } from "@kontent-ai/delivery-sdk";
import { IPortableTextComponent, IPortableTextImage, IPortableTextInternalLink, IPortableTextTable } from "@kontent-ai/rich-text-resolver";
import { PortableText, PortableTextMarkComponentProps, PortableTextReactComponents, PortableTextTypeComponentProps } from "@portabletext/react";
import Image from "next/image";
import { ReactNode } from "react";

import { InternalLink } from "../components/shared/internalLinks/InternalLink";
import { isAcceptedComponentItem,RichTextComponent } from "../components/shared/richText/richTextComponent";
import { Block_ContentChunk } from "../models";

export const createDefaultResolvers = (element: Elements.RichTextElement, renderRichText: (item: Block_ContentChunk) => ReactNode, isElementInsideTable: boolean = false): Partial<PortableTextReactComponents> => ({
  types: {
    image: ({ value }: PortableTextTypeComponentProps<IPortableTextImage>) => {
      const asset = element.images.find(i => i.imageId === value.asset._ref);
      if (!asset) {
        throw new Error(`Asset ${value.asset._ref} not found.`);
      }

      if (isElementInsideTable) {
        return (
          <div className="w-28 h-14 relative not-prose">
            <Image
              src={value.asset.url}
              alt={asset.description ?? ""}
              fill
              className="object-contain"
            />
          </div>
        )
      }

      return (
        <span className="flex justify-center">
          <Image
            src={value.asset.url}
            alt={asset.description ?? ""}
            width={asset.width ?? undefined}
            height={asset.height ?? undefined}
          />
        </span>
      );
    },
    table: ({ value }: PortableTextTypeComponentProps<IPortableTextTable>) => {
      return (
        <table className="table-auto">
          <tbody>
            {value.rows.map(r => (
              <tr key={r._key}>
                {r.cells.map(c => (
                  <td key={c._key}>
                    <PortableText
                      value={c.content}
                      components={createDefaultResolvers(element, renderRichText, true)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )
    },
    component: ({ value }: PortableTextTypeComponentProps<IPortableTextComponent>) => {
      const componentItem = element.linkedItems.find(i => i.system.codename === value.component._ref);
      if (!componentItem) {
        throw new Error("Component item not found, probably not enought depth requested.");
      }
      if (!isAcceptedComponentItem(componentItem)) {
        throw new Error(`Cannot render a component of type ${componentItem.system.type}, please make sure the app supports it.`);
      }

      return (
        <RichTextComponent
          item={componentItem}
          renderRichText={renderRichText}
        />
      );
    },
  },
  marks: {
    sub: props => (
      <sub>
        {props.children}
      </sub>
    ),
    sup: props => (
      <sup>
        {props.children}
      </sup>
    ),
    internalLink: ({ value, children }: PortableTextMarkComponentProps<IPortableTextInternalLink>) => {
      const link = element.links.find(l => l.linkId === value?.reference._ref);
      if (!link) {
        throw new Error("Cannot find link reference in links. This should never happen.");
      }

      return (
        <InternalLink link={link}>
          {children}
        </InternalLink>
      );
    },
    link: ({ value, children }) => {
      const target = (value?.href || "").startsWith("http")
        ? "_blank"
        : undefined;
      return (
        <a
          href={value?.href}
          target={target}
          rel={value?.rel}
          title={value?.title}
        >
          {children}
          {!!value["data-new-window"] && <ArrowTopRightOnSquareIcon className="w-5 inline-block ml-1" />}
        </a>
      );
    },
  },
})
