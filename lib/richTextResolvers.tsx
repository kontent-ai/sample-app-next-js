import { Elements } from "@kontent-ai/delivery-sdk";
import { IPortableTextImage, IPortableTextTable } from "@kontent-ai/rich-text-resolver";
import { PortableText, PortableTextReactComponents } from "@portabletext/react";
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
    },
    table: ({ value }: { value: IPortableTextTable }) => {
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
  },
})
