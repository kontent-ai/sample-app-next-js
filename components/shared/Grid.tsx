import React, { FC } from 'react'
import { Block_Grid } from '../../models'

type Props = Readonly<{
  item: Block_Grid
}>

export const GridComponent: FC<Props> = props => {
  return (
    <div className="grid bg-green-300 w-screen relative left-1/2 right-1/2 px-7 [margin-left:-50vw] py-7 text-gray-900 sm:grid-cols-2 md:grid-cols-3">
      {props.item.elements.gridItems.linkedItems.map((link) => (
        <div className="p-4 flex flex-col text-center items-center" key={link.system.id}>
          <div className="font-bold text-3xl">{link.elements.title.value}</div>
          <div>{link.elements.subtitle.value}</div>
        </div>
      ))}
    </div>
  )
}