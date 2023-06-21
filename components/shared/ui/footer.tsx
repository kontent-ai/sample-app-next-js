import { FC } from "react";
import { useSiteCodename } from "../siteCodenameContext";
import { mainColorBgClass } from "../../../lib/constants/colors";

type Props = Readonly<{
  className?: string;
}>;

export const Footer: FC<Props> = props => {
  const siteCodename = useSiteCodename();

  return (
    <footer className={`${mainColorBgClass[siteCodename]} w-screen`}>
      <div className="flex items-center mx-auto max-w-screen-xl h-16 px-4">
        <p>Ficto Healthtech - Leading the way in medical advancements...</p>
      </div>
    </footer>
  );
}
