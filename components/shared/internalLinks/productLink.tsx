import { FC, ReactNode } from "react"

type Props = Readonly<{
  children: ReactNode;
  itemCodename: string;
  urlSlug: string;
}>;

export const ProductLink: FC<Props> = props => {
  return (
    <a
      href={`/products/${props.urlSlug}`}
      className="text-red-300"
    >
      {props.children}
    </a>
  )
};
