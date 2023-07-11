import { Bars3Icon, ChevronDownIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { NextRouter, useRouter } from "next/router";
import { FC, useState } from "react";

import { mainColorBgClass } from "../../../lib/constants/colors";
import { createItemSmartLink } from "../../../lib/utils/smartLinkUtils";
import { Block_Navigation } from "../../../models";
import { useSiteCodename } from "../siteCodenameContext";

type Link = Readonly<Block_Navigation>;

type Props = Readonly<{
  item: Link;
}>

type MenuListProps = Readonly<{
  items: Block_Navigation[];
  activeMenu: string | number;
  smallMenuActive: boolean
  handleClick: (menuId: string | number) => void;
}>

type DropdownMenuProps = Readonly<{
  links: ReadonlyArray<Link>;
}>;

const isCurrentNavigationItemActive = (navigation: Block_Navigation, router: NextRouter) => {
  const pathWithoutQuerystring = router.asPath.replace(/\?.*/, '');
  const pathSegments = pathWithoutQuerystring.split("/");
  const topLevelSegment = pathSegments[1];
  return (navigation.elements.pageLink.linkedItems[0]?.elements.url.value === topLevelSegment);
};


const MenuList: FC<MenuListProps> = props => {
  const router = useRouter();
  const siteCodename = useSiteCodename();

  return (
    <ul className={`${props.smallMenuActive ? "flex" : "hidden"} flex-col md:flex md:gap-4 font-medium md:flex-row h-full`}>
      {props.items.map((link, i) => (
        <li
          key={i}
          className={`${isCurrentNavigationItemActive(link, router) ? "" : "border-l-transparent border-t-transparent"}
        border-gray-500 border-l-8 border-t-0 md:border-t-8 md:border-l-0 h-full ${mainColorBgClass[siteCodename]} group grow`}
          onClick={() => props.handleClick(i)}
        >
          {link.elements.subitems.value.length > 0 ? (
            <div className={`${i === props.activeMenu ? "bg-white " : ""} md:hover:bg-white h-full`}>
              <DropdownButton item={link} />
              <div
                className={`${i === props.activeMenu ? "block" : "hidden"} md:group-hover:block absolute z-50 left-0 shadow-sm bg-white border-gray-200 w-full`}
              >
                <DropdownMenuItems links={link.elements.subitems.linkedItems} />
              </div>
            </div>
          ) : (
            <Link
              {...link.elements.openInANewWindow.value[0] ? { rel: "noopener noreferrer", target: "_blank" } : {}}
              className="h-full flex items-center justify-between w-full py-2 pl-3 pr-4 font-medium text-gray-900 border-b border-gray-100 md:w-auto md:bg-transparent md:border-0 md:hover:bg-white"
              href={link.elements.externalLink.value ? link.elements.externalLink.value : "/" + link.elements.pageLink.linkedItems[0]?.elements.url.value}
            >
              {link.elements.label.value}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}

const DropdownButton: FC<Props> = props => {
  return (
    <button
      className="h-full flex items-center justify-between w-full p-4 py-2 font-medium text-gray-900 border-b border-gray-100 md:w-auto md:bg-transparent md:border-0"
    >
      {props.item.elements.label.value}
      <ChevronDownIcon className="w-4 h-4 ml-1 mt-1" />
    </button>
  )
}

const DropdownMenuItems: FC<DropdownMenuProps> = props => {
  const router = useRouter();

  return (
    <ul className="grid gap-2 max-w-screen-xl px-4 py-5 mx-auto text-gray-900 sm:grid-cols-2 md:grid-cols-3 md:px-6">
      {props.links.map(link => (
        <li key={link.system.codename}>
          <Link
            {...link.elements.openInANewWindow.value[0] ? { rel: "noopener noreferrer", target: "_blank" } : {}}
            href={link.elements.externalLink.value ? link.elements.externalLink.value : "/" + link.elements.pageLink.linkedItems[0]?.elements.url.value}
            className={`${isCurrentNavigationItemActive(link, router) ? "border-l-gray-500 cursor-default " : "border-l-transparent hover:border-l-gray-500"}
          block p-3 bg-gray-200 border-l-8 h-full`}
          >
            <div className="font-semibold">{link.elements.label.value}</div>
            <span className="text-sm text-gray-500">{link.elements.caption.value}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export const Menu: FC<Props> = props => {
  const siteCodename = useSiteCodename();
  const [activeMenu, setActiveMenu] = useState<string | number>(-1);
  const [smallMenuActive, setSmallMenuActive] = useState(false);

  const handleMenuClick = (menuId: string | number): void => (
    setActiveMenu(menuId === activeMenu ? -1 : menuId)
  )

  return (
    <div
      className={`w-full ${mainColorBgClass[siteCodename]} fixed z-50`}
      {...createItemSmartLink(props.item.system.id)}
    >
      <div className="flex justify-between items-center mx-auto max-w-screen-xl md:h-16 pr-4">
        <div className="w-screen h-full md:flex justify-between z-50 md:pr-24 xl:pr-12 2xl:pr-0">
          <div className="flex h-full justify-between items-center px-8 py-4">
            <Link
              href="/"
              className="flex items-center"
            >
              <span className="font-extrabold">Ficto</span>
              <span>Healthtech</span>
              {siteCodename === 'ficto_healthtech_surgical' && <span>&nbsp;Surgical</span>}
              {siteCodename === 'ficto_healthtech_imaging' && <span>&nbsp;Imaging</span>}
            </Link>
            <button
              type="button"
              className="md:hidden flex justify-center items-center"
              onClick={() => setSmallMenuActive(!smallMenuActive)}
              aria-label="Open the menu"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
          </div>
          <div>
            <MenuList
              smallMenuActive={smallMenuActive}
              items={props.item.elements.subitems.linkedItems}
              handleClick={handleMenuClick}
              activeMenu={activeMenu}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

Menu.displayName = "Menu";
