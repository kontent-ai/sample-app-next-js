import { PerCollection, ValidCollectionCodename } from "../types/perCollection";

type MenuItem = Readonly<{
  url: string;
  title: string;
}>;

const perCollectionMenus = {
  healthtech: [
    {
      url: "/",
      title: "Home",
    },
    {
      url: "/about-us",
      title: "About us",
    },
  ],
  healthtech_imaging: [
    {
      url: "/",
      title: "Home",
    },
    {
      url: "/about-us",
      title: "About us",
    },
  ],
  healthtech_surgical: [
    {
      url: "/",
      title: "Home",
    },
    {
      url: "/articles",
      title: "Articles",
    },
    {
      url: "/products",
      title: "Products",
    },
    {
      url: "/about-us",
      title: "About us",
    },
  ],
} as const satisfies PerCollection<ReadonlyArray<MenuItem>>;

export const createDefaultMenu = (siteCodename: ValidCollectionCodename) => perCollectionMenus[siteCodename];

