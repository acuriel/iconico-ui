import React from 'react';

import { Link } from "react-router-dom";
import { useDrag } from 'react-dnd'

import { ItemTypes } from '../../helpers/itemTypes'


export default function ConsultationDragableItem({consultation}){
  const [_, drag] = useDrag({
    item: { type: ItemTypes.CONSULTATION, elementId: consultation.id},
    collect: monitor => ({ isDragging: !!monitor.isDragging()}),
  });

  return (
    <div>
      <Link ref={drag} to={"/admin/consulta/" + consultation.id}>{consultation.title}</Link>
    </div>)
}
