import React, {useState, useEffect} from 'react';
import { observer } from "mobx-react";
import TextField from '@material-ui/core/TextField';
import Button from "../../components/CustomButtons/Button";


function Truth({truth}){
  const [adding, setAdding] = useState(true);
  useEffect(() => {
  }, [])
  return truth.id || adding ? (
    <div style={{width:"100%"}}>
      <h4>La consultado ha sido terminada y no contiene Verdades. Por favor, agregue una:</h4>
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
        onClick={() => truth.save()}
      >
        Guardar
      </Button>
    </div>) : <h4>No se han creado <b>Verdades</b></h4>
}

export default observer(Truth);
