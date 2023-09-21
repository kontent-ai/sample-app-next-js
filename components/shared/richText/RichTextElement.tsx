import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";
import { Elements } from "@kontent-ai/delivery-sdk";
import {
  IPortableTextComponent,
  IPortableTextImage,
  IPortableTextInternalLink,
  IPortableTextItem,
  IPortableTextTable,
  nodeParse,
  transformToPortableText,
} from "@kontent-ai/rich-text-resolver";
import {
  PortableText,
  PortableTextMarkComponentProps,
  PortableTextReactComponents,
  PortableTextTypeComponentProps,
} from "@portabletext/react";
import Image from "next/image";
import { FC } from "react";

import { sanitizeFirstChildText } from "../../../lib/anchors";
import { mainColorAnchor } from "../../../lib/constants/colors";
import { siteCodename } from "../../../lib/utils/env";
import {
  Action,
  Block_ContentChunk,
  Component_Callout,
  contentTypes,
  Fact,
} from "../../../models";
import { ContentChunk } from "../ContentChunk";
import { FactComponent } from "../Fact";
import { CTAButton } from "../internalLinks/CTAButton";
import { InternalLink } from "../internalLinks/InternalLink";
import { BuildError } from "../ui/BuildError";
import { CalloutComponent } from "./Callout";

type ElementProps = Readonly<{
  element: Elements.RichTextElement;
  isInsideTable: boolean;
}>;

export const createDefaultResolvers = (
  element: Elements.RichTextElement,
  isElementInsideTable: boolean = false,
  siteCodename: keyof typeof mainColorAnchor
): Partial<PortableTextReactComponents> => ({
  types: {
    image: ({ value }: PortableTextTypeComponentProps<IPortableTextImage>) => {
      const asset = element.images.find((i) => i.imageId === value.asset._ref);
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
        );
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
            {value.rows.map((r) => (
              <tr key={r._key}>
                {r.cells.map((c) => (
                  <td key={c._key}>
                    <RichTextValue
                      isInsideTable
                      value={c.content}
                      element={element}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    },
    component: ({
      value,
    }: PortableTextTypeComponentProps<IPortableTextComponent>) => {
      const componentItem = element.linkedItems.find(
        (i) => i.system.codename === value.component._ref
      );

      if (!componentItem) {
        throw new Error(
          "Component item not found, probably not enough depth requested."
        );
      }

      switch (componentItem.system.type) {
        case contentTypes.callout.codename:
          return <CalloutComponent item={componentItem as Component_Callout} />;
        case contentTypes.action.codename:
          return <CTAButton reference={componentItem as Action} />;
        case contentTypes.fact.codename:
          return (
            <FactComponent
              item={componentItem as Fact}
              isReversed={false}
            />
          );
        case contentTypes.content_chunk.codename:
          return <ContentChunk item={componentItem as Block_ContentChunk} />;
        default:
          return (
            <BuildError>
              Unsupported content type &quot;{componentItem.system.type}&quot;
            </BuildError>
          );
      }
    },
  },
  marks: {
    sub: (props) => <sub>{props.children}</sub>,
    sup: (props) => <sup>{props.children}</sup>,
    internalLink: ({
      value,
      children,
    }: PortableTextMarkComponentProps<IPortableTextInternalLink>) => {
      const link = element.links.find(
        (l) => l.linkId === value?.reference._ref
      );
      if (!link) {
        throw new Error(
          "Cannot find link reference in links. This should never happen."
        );
      }

      return <InternalLink link={link}>{children}</InternalLink>;
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
          {!!value["data-new-window"] && (
            <ArrowTopRightOnSquareIcon className="w-5 inline-block ml-1" />
          )}
        </a>
      );
    },
  },
  block: {
    // TODO don't resolve when block contains link type markdef
    h1: ({ value, children }) => (
      <h1
        className="scroll-mt-20 heading"
        id={sanitizeFirstChildText(value)}
      >
        <a
          className={mainColorAnchor[siteCodename]}
          href={`#${sanitizeFirstChildText(value)}`}
        >
          {children}
        </a>
      </h1>
    ),
    h2: ({ value, children }) => (
      <h2
        className="scroll-mt-20 heading"
        id={sanitizeFirstChildText(value)}
      >
        <a
          className={mainColorAnchor[siteCodename]}
          href={`#${sanitizeFirstChildText(value)}`}
        >
          {children}
        </a>
      </h2>
    ),
    h3: ({ value, children }) => (
      <h3
        className="scroll-mt-20 heading"
        id={sanitizeFirstChildText(value)}
      >
        <a
          className={mainColorAnchor[siteCodename]}
          href={`#${sanitizeFirstChildText(value)}`}
        >
          {children}
        </a>
      </h3>
    ),
    h4: ({ value, children }) => (
      <h4
        className="scroll-mt-20 heading"
        id={sanitizeFirstChildText(value)}
      >
        <a
          className={mainColorAnchor[siteCodename]}
          href={`#${sanitizeFirstChildText(value)}`}
        >
          {children}
        </a>
      </h4>
    ),
    h5: ({ value, children }) => (
      <h5
        className="scroll-mt-20 heading"
        id={sanitizeFirstChildText(value)}
      >
        <a
          className={mainColorAnchor[siteCodename]}
          href={`#${sanitizeFirstChildText(value)}`}
        >
          {children}
        </a>
      </h5>
    ),
    h6: ({ value, children }) => (
      <h6
        className="scroll-mt-20 heading"
        id={sanitizeFirstChildText(value)}
      >
        <a
          className={mainColorAnchor[siteCodename]}
          href={`#${sanitizeFirstChildText(value)}`}
        >
          {children}
        </a>
      </h6>
    ),
  },
});

export const RichTextElement: FC<ElementProps> = (props) => {
  const portableText = transformToPortableText(nodeParse(props.element.value));

  return (
    <PortableText
      value={portableText}
      components={createDefaultResolvers(props.element, false, siteCodename)}
    />
  );
};

type RichTextValueProps = Readonly<{
  element: Elements.RichTextElement;
  value: IPortableTextItem[];
  isInsideTable: boolean;
}>;

const RichTextValue: FC<RichTextValueProps> = (props) => (
  <PortableText
    value={props.value}
    components={createDefaultResolvers(
      props.element,
      props.isInsideTable,
      siteCodename
    )}
  />
);
