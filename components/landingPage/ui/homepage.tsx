import { FC } from "react"
import { WSL_WebSpotlightRoot } from "../../../models"
import { Content } from "../../shared/Content"

type HomepageProps = {
  homepageData: WSL_WebSpotlightRoot
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