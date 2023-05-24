import { PerCollection, ValidCollectionCodename } from "../types/perCollection";

type MenuItem = Readonly<{
  url: string;
  title: string;
}>;

const perCollectionMenus = {
  healthtech: "header_navigation",
  healthtech_imaging: "header_navigation_imaging",
  healthtech_surgical: "header_navigation_surgical"
} as const satisfies PerCollection<string>;

export const getMenuCodename = (siteCodename: ValidCollectionCodename) => perCollectionMenus[siteCodename];

