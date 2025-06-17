import { FC } from "react"
import { WSL_WebsiteRoot } from "../../../models/content-types"
import { Content } from "../../shared/Content"

type HomepageProps = {
  homepageData: WSL_WebsiteRoot
}

export const Homepage: FC<HomepageProps> = ({homepageData}) => (
  <div>
    {homepageData.elements.content.linkedItems.map((item,index) => (
      <Content
        key={item.system.id}
        item={item}
        index={index}
      />
    ))}
  </div>
)

export default Homepage;