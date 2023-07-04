import { FC, ReactNode } from "react";

type Props = Readonly<{
  children: ReactNode;
}>;

export const BuildError: FC<Props> = props => (
  <div className="bg-red-500 text-white">
    {props.children}
  </div>
)
