import React from "react";
import Button from '@material-ui/core/Button';


export default function FolderElement({ title, handler, color, ...props }) {
  return (
    <div className="folder-element">
      <Button variant="outlined" color={color} onClick={handler}>{title}</Button>
    </div>
  );
};
