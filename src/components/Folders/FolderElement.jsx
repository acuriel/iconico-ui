import React from "react";
import Button from '@material-ui/core/Button';
import {ItemTypes} from '../../helpers/itemTypes'
import { useDrop } from 'react-dnd'
import {apiService} from "../../services";

const addConsultationToFolder = (folderId, consultationId, handler) => {
  apiService.addConsultationToFolder(consultationId, folderId).then(res=>{
    console.log("added");
    handler(true)
  })
}

export default function FolderElement({ title, handler, color, folder, updateEvent, ...props }) {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemTypes.CONSULTATION,
    drop: ({type, elementId}) => {addConsultationToFolder(folder._id, elementId, updateEvent)},
    collect: mon => ({
      isOver: !!mon.isOver(),
      canDrop: !!mon.canDrop(),
      consultationId: mon.elementId
    }),
  })
  return (
    <div className="folder-element" ref={drop}>
      <Button variant="outlined" color={ isOver ? 'primary' : color} onClick={handler}>{folder?.FolderName??title}</Button>
    </div>
  );
};
