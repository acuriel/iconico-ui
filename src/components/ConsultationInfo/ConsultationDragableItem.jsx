import React from 'react';

import { Link } from "react-router-dom";
import { useDrag } from 'react-dnd'

import { ItemTypes } from '../../helpers/itemTypes'


export default function ConsultationDragableItem({consultation}){
  const [{isDragging, elementId}, drag] = useDrag({
    item: { type: ItemTypes.CONSULTATION, elementId: consultation._id},
    collect: monitor => ({ isDragging: !!monitor.isDragging()}),
  });

  return (
    <div>
      <Link ref={drag} to={"/admin/consulta/" + consultation._id}>{consultation.Tittle}</Link>
    </div>)
}
