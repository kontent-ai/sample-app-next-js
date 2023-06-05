import React, { FC } from 'react'
import { Block_Grid } from '../../models'

type Props = Readonly<{
  item: Block_Grid
}>

export const GridComponent: FC<Props> = props => {
  return (
    <div className="grid bg-green-300 w-screen relative left-2/4 right-2/4 px-7 [margin-left:-50vw] py-7 mx-auto text-gray-900 dark:text-white sm:grid-cols-2 md:grid-cols-3 place-items-center">
      {props.item.elements.gridItems.linkedItems.map(link => (
        <div 
          className="place-items-center p-4"
          key={link.system.id}
        >
          <div className="font-bold text-3xl place-items-center">{link.elements.title.value}</div>
          <div className="place-items-center">{link.elements.subtitle.value}</div>
        </div>
      ))}
  </div>
  )
}