import React, {useState, useEffect} from 'react';
import { observer } from "mobx-react";
import TextField from '@material-ui/core/TextField';
import Button from "../../components/CustomButtons/Button";
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';

function Truth({truth}){
  const [editing, setEditing] = useState(!truth.id);

  const editionForm =  (
    <div>
      <TextField
          style={{marginTop:"16px"}}
          label="Titulo"
          autoFocus={true}
          required
          fullWidth={true}
          value={truth.title}
          onChange={ e => {
            truth.title = e.target.value
          }}
        />
        <TextField
          style={{marginTop:"16px"}}
          label="Resumen"
          required
          multiline={true}
          fullWidth={true}
          rows={12}
          value={truth.summary}
          onChange={ e => {
            truth.summary = e.target.value
          }}
        />
        <Button
          style={{float:"right", marginTop:"20px"}}
          color="success"
          onClick={() => {
            setEditing(false);
            truth.save();
          }}
        >
          Guardar
        </Button>
    </div>
  )

  const details = (
    <div className="truth-details">
      <h5>Titulo</h5>
      <p>{truth.title}</p>
      <h5>Resumen</h5>
      <p>{truth.summary}</p>
    </div>
  )

  return (
    <div className="truth-panel">
      <IconButton
        style={{float:"right", marginTop:"-12px"}}
        onClick={() => setEditing(!editing)}
      >
        {editing ? <CloseIcon/> : <EditIcon/>}
      </IconButton>
      <h4>Conclusiones de la consulta:</h4>
      {editing || !truth.created.get() ? editionForm : details}
    </div>
  )
}

export default observer(Truth);
