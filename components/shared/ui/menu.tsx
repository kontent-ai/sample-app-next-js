import Link from "next/link";
import { FC, useState } from "react";
import { mainColorBgClass } from "../../../lib/constants/colors";
import { useSiteCodename } from "../siteCodenameContext";
import { Navigation } from "../../../models";
import { createItemSmartLink } from "../../../lib/utils/smartLinkUtils";

type Link = Readonly<Navigation>;

type DropdownProps = Readonly<{
  links: ReadonlyArray<Link>;
}>;

type Props = Readonly<{
  item: Link;
}>

const MenuDropdown: FC<DropdownProps> = props => {
  return (
    <>
      {props.links.map(link => (
        <Link key={link.system.codename} {...link.elements.openInANewWindow.value ? { rel: "noopener noreferrer", target: "_blank" } : {}} href={link.elements.externalLink.value ? link.elements.externalLink.value : "/" + link.elements.pageLink.linkedItems[0].elements.url.value} className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
          <div className="font-semibold">{link.elements.label.value}</div>
          <span className="text-sm text-gray-500 dark:text-gray-400">{link.elements.caption.value}</span>
        </Link>
      ))}
    </>
  )
}

export const Menu: FC<Props> = props => {
  const siteCodename = useSiteCodename();
  const [isMenuActive, setIsMenuActive] = useState(false);

  return (
    <div
      className={`w-screen ${mainColorBgClass[siteCodename]} fixed z-50`}
      {...createItemSmartLink(props.item.system.id)}
    >
      <div className="flex justify-between items-center mx-auto max-w-screen-xl md:h-16">
        <div
          id="mega-menu-full"
          className="w-screen h-full md:flex justify-between md:order-1 z-50"
        >
          <div className="flex h-full justify-between items-center px-8 py-4">
            <Link href="/" className="flex items-center">
              <span className="font-extrabold">HealthTech</span>
            </Link>
            <button
              type="button"
              className="md:hidden justify-end"
              aria-controls="mega-menu-full"
              aria-expanded="false"
              onClick={() => setIsMenuActive(!isMenuActive)}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
          <div>
            <ul className={`${isMenuActive ? "flex" : "hidden"} md:flex flex-col font-medium md:flex-row md:mt-0 h-full`}>
              {props.item.elements.subitems.linkedItems.map((link) => (
                <li key={link.elements.caption.value} className="h-full px-5 bg-green-300 lg:bg-transparent lg:hover:bg-gray-50">
                  {link.elements.subitems.value.length > 0 ? (
                    <span className="group">
                      <button
                        id="mega-menu-full-dropdown-button"
                        data-collapse-toggle="mega-menu-full-dropdown"
                        className="h-full flex items-center justify-between w-full py-2 pl-3 pr-4 font-medium text-gray-900 border-b border-gray-100 md:w-auto md:bg-transparent md:border-0"
                      >
                        {link.elements.label.value}
                        <svg
                          className="w-5 h-5 ml-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </button>
                      <div
                        id="mega-menu-full-dropdown"
                        className={`hidden group-hover:block transition-all duration-300 absolute z-50 left-0 shadow-sm bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-600 w-full`}
                      >
                        <div className="grid max-w-screen-xl px-4 py-5 mx-auto text-gray-900 dark:text-white sm:grid-cols-2 md:grid-cols-3 md:px-6">
                          <MenuDropdown links={link.elements.subitems.linkedItems} />
                        </div>
                      </div>
                    </span>
                  ) : (
                    <Link
                      {...link.elements.openInANewWindow.value ? { rel: "noopener noreferrer", target: "_blank" } : {}}
                      className="h-full flex items-center justify-between w-full py-2 pl-3 pr-4 font-medium text-gray-900 border-b border-gray-100 md:w-auto md:bg-transparent md:border-0"
                      href={link.elements.externalLink.value ? link.elements.externalLink.value : "/" + link.elements.pageLink.linkedItems[0].elements.url.value}
                    >
                      {link.elements.label.value}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

Menu.displayName = "Menu";
