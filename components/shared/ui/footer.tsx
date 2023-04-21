import { FC } from "react";

type Props = Readonly<{
  className?: string;
}>;

export const Footer: FC<Props> = props => (
  <footer className={`w-screen grow-0 h-16 bg-green-300 px-10 flex flex-auto justify-end items-center ${props.className ?? ""}`}>
    <p>Welltale cosmatics inc.</p>
  </footer>
)
