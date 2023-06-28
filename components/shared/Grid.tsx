import React, { FC } from 'react'

import { mainColorBgClass } from '../../lib/constants/colors'
import { Block_Grid } from '../../models'
import { useSiteCodename } from './siteCodenameContext'

type Props = Readonly<{
  item: Block_Grid
}>

export const GridComponent: FC<Props> = props => {
  const siteCodename = useSiteCodename();

  return (
    <div className={`${mainColorBgClass[siteCodename]} w-screen relative left-1/2 right-1/2 [margin-left:-50vw]`}>
      <div className="grid mx-auto w-full max-w-screen-xl py-7 text-gray-900 sm:grid-cols-2 md:grid-cols-3">
        {props.item.elements.gridItems.linkedItems.map((link) => (
          <div
            className="p-4 flex flex-col text-center items-center"
            key={link.system.id}
          >
            <div className="font-bold text-3xl">{link.elements.title.value}</div>
            <div>{link.elements.subtitle.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}