import type { FC } from "react";
import type { LP_WebsiteRoot } from "../../../models/content-types/index.ts";
import { Content } from "../../shared/Content.tsx";

type HomepageProps = {
  homepageData: LP_WebsiteRoot;
};

export const Homepage: FC<HomepageProps> = ({ homepageData }) => (
  <div>
    {homepageData.elements.content.linkedItems.map((item, index) => (
      <Content key={item.system.id} item={item} index={index} />
    ))}
  </div>
);

export default Homepage;
