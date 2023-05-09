import Link from "next/link";
import { FC } from "react";
import { mainColorBgClass } from "../../../lib/constants/colors";
import { useSiteCodename } from "../siteCodenameContext";

type Link = Readonly<{
  url: string;
  title: string;
}>;

type Props = Readonly<{
  links: ReadonlyArray<Link>;
}>;

export const Menu: FC<Props> = props => {
  const siteCodename = useSiteCodename();

  return (
    <div className={`flex flex-auto h-16 w-full ${mainColorBgClass[siteCodename]} justify-between shadow-md items-center px-10 grow-0 shrink-0`}>
      <div />
      <menu className="h-full grow-0 py-1 flex flex-auto shrink-0 justify-end items-center gap-x-5">
        {props.links.map(link => (
          <li
            key={link.title}
            className="h-full"
          >
            <Link
              className="h-full px-5 flex items-center cursor-pointer rounded hover:bg-white"
              href={link.url}
            >
              {link.title}
            </Link>
          </li>
        ))}
      </menu>
    </div>
  );
}

Menu.displayName = "Menu";
