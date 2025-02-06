'use client'
import { Bars3Icon, ChevronDownIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, useState } from "react";

import { perCollectionSiteName } from "../../../lib/constants/labels";
import {
  ResolutionContext,
  resolveReference,
  resolveUrlPath,
} from "../../../lib/routing";
import { siteCodename } from "../../../lib/utils/env";
import { StandaloneSmartLinkButton } from "../StandaloneSmartLinkButton";
import { Nav_NavigationItem } from "../../../models/content-types/Nav_navigationItem";
import { Article, Product, Solution, WSL_Page, WSL_WebSpotlightRoot } from "../../../models/content-types";
import { contentTypes } from "../../../models/environment";

type Link = Readonly<Nav_NavigationItem>;

type Props = Readonly<{
  item: Link;
}>;

type MenuListProps = Readonly<{
  items: Nav_NavigationItem[];
  activeMenu: string | number;
  smallMenuActive: boolean;
  handleClick: (menuId: string | number) => void;
}>;

type DropdownMenuProps = Readonly<{
  links: ReadonlyArray<Link>;
}>;

const isPage = (
  item: WSL_Page | WSL_WebSpotlightRoot | Product | Article | Solution
): item is WSL_Page => item.system.type === contentTypes.page.codename;

const isCurrentNavigationItemActive = (
  navigation: Nav_NavigationItem,
  pathname: string,
) => {
  const pathWithoutQuerystring = pathname.replace(/\?.*/, "");
  const pathSegments = pathWithoutQuerystring.split("/");
  const topLevelSegment = pathSegments[1];
  const pageLink = navigation.elements.reference__content__item_link.linkedItems[0];

  return (
    pageLink &&
    isPage(pageLink) &&
    pageLink.elements.slug.value === topLevelSegment
  );
};

const MenuList: FC<MenuListProps> = (props) => {
  const pathname = usePathname() ?? "";
  return (
    <ul
      className={`transition ${
        props.smallMenuActive ? "" : "opacity-0 md:opacity-100"
      } absolute w-full md:static flex flex-col md:flex md:gap-4 font-medium md:flex-row h-full`}
    >
      {props.items.map((link, i) => (
        <li
          key={i}
          className={`${
            isCurrentNavigationItemActive(link, pathname)
              ? ""
              : "border-l-transparent border-t-transparent"
          }
        border-gray-500 border-l-8 border-t-0 md:border-t-8 md:border-l-0 min-w-fit h-full w-full bg-mainBackgroundColor md:bg-transparent group grow`}
          onClick={() => props.handleClick(i)}
        >
          {link.elements.subitems.value.length > 0 ? (
            <div className="md:hover:bg-white h-full">
              <DropdownButton item={link} />
              <div // TODO: handle mobile menu behavior
                className="-translate-y-1/2 opacity-0 pointer-events-none md:group-hover:pointer-events-auto group-hover:opacity-100 group-hover:translate-y-0 absolute z-40 left-0 shadow-sm bg-white border-gray-200 w-full transition-all duration-200 ease-in-out"
              >
                <DropdownMenuItems links={link.elements.subitems.linkedItems} />
              </div>
            </div>
          ) : (
            <Link
              className="h-full flex items-center justify-between w-full py-2 px-4 font-medium text-white border-b border-gray-100 md:w-auto md:bg-transparent md:border-0 md:hover:bg-white md:group-hover:text-gray-900"
              href={resolveReference(link)}
              title={link.elements.reference__caption.value}
            >
              {link.elements.reference__label.value}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
};

const DropdownButton: FC<Props> = (props) => {
  return (
    <button
      className="md:group-hover:text-gray-900 h-full flex items-center justify-between w-full p-4 py-2 font-medium text-white border-b border-gray-100 md:w-auto md:bg-transparent md:border-0"
      title={props.item.elements.reference__caption.value}
    >
      {props.item.elements.reference__label.value}
      <ChevronDownIcon className="w-4 h-4 ml-1 mt-1" />
    </button>
  );
};

const DropdownMenuItems: FC<DropdownMenuProps> = (props) => {
  const pathname = usePathname() ?? "";

  return (
    <ul className="grid gap-2 max-w-screen-xl px-4 py-5 mx-auto text-gray-900 sm:grid-cols-2 md:grid-cols-3 md:px-6">
      {props.links.map((link) => (
        <li key={link.system.codename}>
          <Link
            href={resolveReference(link)}
            className={`${
              isCurrentNavigationItemActive(link, pathname)
                ? "border-l-gray-500 cursor-default "
                : "border-l-transparent hover:border-l-gray-500"
            }
          block p-3 bg-gray-200 border-l-8 h-full`}
          >
            <div className="font-semibold">
              {link.elements.reference__label.value}
            </div>
            <span className="text-sm text-gray-500">
              {link.elements.reference__caption.value}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export const Menu: FC<Props> = (props) => {
  const [activeMenu, setActiveMenu] = useState<string | number>(-1);
  const [smallMenuActive, setSmallMenuActive] = useState(false);

  const handleMenuClick = (menuId: string | number): void => {
    setActiveMenu(menuId === activeMenu ? -1 : menuId);
  };

  return (
    <div
      className="w-full fixed z-50 transition-all ease-in-out duration-200 bg-mainBackgroundColor"
    >
      <div className="flex justify-between items-center mx-auto max-w-screen-xl md:h-16 pr-4">
        <div className="w-screen h-full md:flex justify-between z-50 md:pr-24 xl:pr-12 2xl:pr-0">
          <div className="flex text-white h-full justify-between items-center px-8 py-4">
            <Link
              href={resolveUrlPath({
                type: "web_spotlight_root",
              } as ResolutionContext)}
              className="flex items-center"
            >
              <span className="pr-3">
                <Image
                  src="/logo.png"
                  alt="logo"
                  width={30}
                  height={30}
                />
              </span>
              <span className="font-bold">Ficto</span>
              <span>&nbsp;{perCollectionSiteName[siteCodename]}</span>
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
          <StandaloneSmartLinkButton itemId={props.item.system.id} />
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
};

Menu.displayName = "Menu";
