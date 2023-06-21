import Link from "next/link";
import { FC, useState } from "react";
import { mainColorBgClass } from "../../../lib/constants/colors";
import { useSiteCodename } from "../siteCodenameContext";
import { Block_Navigation } from "../../../models";
import { createItemSmartLink } from "../../../lib/utils/smartLinkUtils";
import { ChevronDownIcon, Bars3Icon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";

type Link = Readonly<Block_Navigation>;

type Props = Readonly<{
  item: Link;
}>

type MenuItemsProps = Readonly<{
  items: Block_Navigation[];
  activeMenu: string | number;
  handleClick: (menuId: string | number) => void;
}>

type DropdownMenuProps = Readonly<{
  links: ReadonlyArray<Link>;
}>;

const DropdownMenuItems: FC<DropdownMenuProps> = props => {
  return (
    <>
      {props.links.map(link => (
        <Link
          key={link.system.codename}
          {...link.elements.openInANewWindow.value[0] ? { rel: "noopener noreferrer", target: "_blank" } : {}}
          href={link.elements.externalLink.value ? link.elements.externalLink.value : "/" + link.elements.pageLink.linkedItems[0].elements.url.value}
          className="block p-3 rounded-lg hover:bg-gray-50"
        >
          <div className="font-semibold">{link.elements.label.value}</div>
          <span className="text-sm text-gray-500">{link.elements.caption.value}</span>
        </Link>
      ))}
    </>
  )
}

const DropdownButton: FC<Props> = props => {
  return (
    <button
      className={`h-full flex items-center justify-between w-full py-2 pl-3 pr-4 font-medium text-gray-900 border-b border-gray-100 md:w-auto md:bg-transparent md:border-0`}
    >
      {props.item.elements.label.value}
      <ChevronDownIcon className="w-4 h-4 ml-1 mt-1" />
    </button>
  )
}

const MenuItems: FC<MenuItemsProps> = props => {
  const siteCodename = useSiteCodename();
  const router = useRouter();

  console.log(router);

  return (
    <>
      {props.items.map((link, i) => (
        <li key={i} className={` ${"/" + link.elements.pageLink.linkedItems[0]?.elements.url.value === router.asPath ? "border-t-8" : ""}
         h-full ${mainColorBgClass[siteCodename]} group md:hover:bg-white grow`} onClick={() => props.handleClick(i)}>
          {link.elements.subitems.value.length > 0 ? (
            <div className={`${i === props.activeMenu ? "md:bg-white" : ""} h-full`}>
              <DropdownButton item={link} />
              <div
                className={`${i === props.activeMenu ? "block" : "hidden"} md:group-hover:block absolute z-50 left-0 shadow-sm bg-white border-gray-200 w-full`}
              >
                <div className="grid max-w-screen-xl px-4 py-5 mx-auto text-gray-900 sm:grid-cols-2 md:grid-cols-3 md:px-6">
                  <DropdownMenuItems links={link.elements.subitems.linkedItems} />
                </div>
              </div>
            </div>
          ) : (
            <Link
              {...link.elements.openInANewWindow.value[0] ? { rel: "noopener noreferrer", target: "_blank" } : {}}
              className={`h-full flex items-center justify-between w-full py-2 pl-3 pr-4 font-medium text-gray-900 border-b border-gray-100 md:w-auto md:bg-transparent md:border-0`}
              href={link.elements.externalLink.value ? link.elements.externalLink.value : "/" + link.elements.pageLink.linkedItems[0].elements.url.value}
            >
              {link.elements.label.value}
            </Link>
          )}
        </li>
      ))}
    </>
  );
}


export const Menu: FC<Props> = props => {
  const siteCodename = useSiteCodename();
  const [activeMenu, setActiveMenu] = useState<string | number>(-1);
  const [smallMenuActive, setSmallMenuActive] = useState(false);

  const handleMenuClick = (menuId: string | number) => {
    menuId === activeMenu ? setActiveMenu(-1) : setActiveMenu(menuId);
  }


  return (
    <div className={`w-screen ${mainColorBgClass[siteCodename]} fixed z-50`} {...createItemSmartLink(props.item.system.id)}>
      <div className="flex justify-between items-center mx-auto max-w-screen-xl md:h-16">
        <div className="w-screen h-full md:flex justify-between z-50">
          <div className="flex h-full justify-between items-center px-8 py-4">
            <Link href="/" className="flex items-center">
              <span className="font-extrabold">Ficto</span>
              <span>Healthtech</span>
              {siteCodename === 'ficto_healthtech_surgical' && <span>&nbsp;Surgical</span>}
              {siteCodename === 'ficto_healthtech_imaging' && <span>&nbsp;Imaging</span>}
            </Link>
            <button
              type="button"
              className="md:hidden flex justify-center items-center"
              onClick={() => setSmallMenuActive(!smallMenuActive)}
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
          </div>
          <div>
            <ul className={`${smallMenuActive ? "flex" : "hidden"} md:flex flex-col gap-4 font-medium md:flex-row h-full`}>
              <MenuItems items={props.item.elements.subitems.linkedItems} handleClick={handleMenuClick} activeMenu={activeMenu} />
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

Menu.displayName = "Menu";
