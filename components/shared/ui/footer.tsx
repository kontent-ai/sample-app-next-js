import { FC } from "react";

type Props = Readonly<{
  className?: string;
}>;

export const Footer: FC<Props> = props => (
  <footer className={`w-full grow-0 h-16 px-10 flex flex-auto shrink-0 justify-end items-center ${props.className ?? ""}`}>
    <p>Welltale cosmatics inc.</p>
  </footer>
)
