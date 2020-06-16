import React, {useState, useEffect} from 'react';
import { observer } from "mobx-react";
import TextField from '@material-ui/core/TextField';
import Autocomplete, {createFilterOptions} from '@material-ui/lab/Autocomplete';
import Chip from '@material-ui/core/Chip';
import Button from "../../components/CustomButtons/Button";
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';

function Truth({truth}){
  const [editing, setEditing] = useState(!truth.id);
  const filter = createFilterOptions();

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
        <Autocomplete
          style={{marginTop:"20px"}}
          multiple
          options={[]}
          getOptionLabel={option => option}
          defaultValue={truth.tags}
          onChange={(_, v) => truth.tags = v}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);
            if (params.inputValue !== "") {
              filtered.push(params.inputValue);
            }
            return filtered;
          }}
          renderInput={params => (
            <TextField
              {...params}
              variant="standard"
              label="Multiple values"
              placeholder="Favorites"
            />
          )}
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
      <div className="tags">{truth.tags.map(tag => <Chip size="small" label={tag} icon={<LocalOfferIcon/>}/>)}</div>
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
      <h3>{truth.title !== "" ? truth.title : "Conclusiones de la consulta"}:</h3>
      {editing || !truth.created.get() ? editionForm : details}
    </div>
  )
}

export default observer(Truth);
