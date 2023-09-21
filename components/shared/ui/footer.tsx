import { FC } from "react";

import { mainColorBgClass } from "../../../lib/constants/colors";
import { siteCodename } from "../../../lib/utils/env";

type Props = Readonly<{
  className?: string;
}>;

export const Footer: FC<Props> = () => (
  <footer className={`${mainColorBgClass[siteCodename]} w-screen`}>
    <div className="flex items-center mx-auto max-w-screen-xl h-16 px-4 text-white">
      <p>Ficto Healthtech - Leading the way in medical advancements...</p>
    </div>
  </footer>
);
