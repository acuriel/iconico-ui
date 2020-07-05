import React from "react";
import Button from '@material-ui/core/Button';
import {ItemTypes} from '../../helpers/itemTypes'
import { useDrop } from 'react-dnd'


export default function FolderElement({ title, handler, color, folder, noFolder, updateEvent, ...props }) {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemTypes.CONSULTATION,
    // drop: ({type, element}) => {addConsultationToFolder(folder ? folder.id : undefined, element, updateEvent)},
    drop: ({type, element}) => {
      element.moveToFolder(folder.id).then((res =>{
        if(handler){
          handler();
        }
      }));

    },
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
