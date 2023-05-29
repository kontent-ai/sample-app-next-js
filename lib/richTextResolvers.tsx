import { Elements } from "@kontent-ai/delivery-sdk";
import { IPortableTextComponent, IPortableTextImage, IPortableTextInternalLink, IPortableTextTable } from "@kontent-ai/rich-text-resolver";
import { PortableText, PortableTextMarkComponentProps, PortableTextReactComponents, PortableTextTypeComponentProps } from "@portabletext/react";
import Image from "next/image";
import { RichTextComponent, isAcceptedComponentItem } from "../components/shared/richText/richTextComponent";
import { InternalLink } from "../components/shared/internalLinks/InternalLink";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";

export const createDefaultResolvers = (element: Elements.RichTextElement): Partial<PortableTextReactComponents> => ({
  types: {
    image: ({ value }: PortableTextTypeComponentProps<IPortableTextImage>) => {
      const asset = element.images.find(i => i.imageId === value.asset._ref);
      if (!asset) {
        throw new Error(`Asset ${value.asset._ref} not found.`);
      }

      return (
        <span className="flex justify-center">
          <Image
            src={value.asset.url}
            alt={asset.description ?? ""}
            width={asset.width ?? undefined}
            height={asset.height ?? undefined}
            className="rounded-3xl"
          />
        </span>
      );
    },
    table: ({ value }: PortableTextTypeComponentProps<IPortableTextTable>) => {
      return (
        <table>
          <tbody>
            {value.rows.map(r => (
              <tr key={r._key}>
                {r.cells.map(c => (
                  <td key={c._key}>
                    <PortableText value={c.content} components={createDefaultResolvers(element)} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )
    },
    component: ({ value }: PortableTextTypeComponentProps<IPortableTextComponent>) => {
      const componentItem = element.linkedItems.find(i => i.system.codename === value?.component._ref);
      if (!componentItem) {
        throw new Error("Component item not found, probably not enought depth requested.");
      }
      if (!isAcceptedComponentItem(componentItem)) {
        throw new Error(`Cannot render a component of type ${componentItem.system.type}, please make sure the app supports it.`);
      }

      return (
        <RichTextComponent item={componentItem} />
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
