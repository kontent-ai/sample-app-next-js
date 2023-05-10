import { FC } from "react";
import { useSiteCodename } from "../siteCodenameContext";
import { mainColorBgClass } from "../../../lib/constants/colors";

type Props = Readonly<{
  className?: string;
}>;

export const Footer: FC<Props> = props => {
  const siteCodename = useSiteCodename();

  return (
    <footer className={`w-full grow-0 h-16 px-10 flex flex-auto shrink-0 justify-end items-center ${mainColorBgClass[siteCodename]} ${props.className ?? ""}`}>
      <p>Healthtech inc.</p>
    </footer>
  );
}
