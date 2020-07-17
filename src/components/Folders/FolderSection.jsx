import React, {useState, useEffect, useContext} from "react";
import StoreContext from "stores/RootStore";
import { observer } from "mobx-react";


import FolderElement from "./FolderElement";
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';

import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import FastForwardIcon from '@material-ui/icons/FastForward';
import FastRewindIcon from '@material-ui/icons/FastRewind';
import Add from '@material-ui/icons/Add';
import Close from '@material-ui/icons/Close';
import Check from '@material-ui/icons/Check';
import Folder from '@material-ui/icons/Folder';
import Star from '@material-ui/icons/Star';
import Delete from '@material-ui/icons/Delete';
import StarBorder from '@material-ui/icons/StarBorder';

function FolderSection({folderSelectedHandler, updateEvent, ...props }) {
  const [pageStepSize, setPageStepSize] = useState(8);
  const [pageSize, setPageSize] = useState(8);
  const [pagePosition, setPagePosition] = useState(0);
  const [addingFolder, setAddingFolder] = useState(false);
  const [startedToWrite, setStartedToWrite] = useState(false);

  const {consultationStore} = useContext(StoreContext)


  useEffect(() => {
    consultationStore.fetchMyFolders();
  }, [consultationStore])


  const addFolder = async () => {
    await consultationStore.addFolder()
    setAddingFolder(false)
    setStartedToWrite(false);
  };

  const handleKeyPress = (event) => {
    if(event.key === 'Enter' && !getError()){
      addFolder()
    }
  }

  const getError = () => {
    if(startedToWrite) {
      if(consultationStore.newFolder.name.length < 3)
        return "Debe tener al menos 3 letras";
      if(consultationStore.myFolders.some(f => f.name.toLowerCase() === consultationStore.newFolder.name.toLowerCase()))
        return "Ya existe dicha carpeta";
    }
    return undefined;
  }


  return (
    <div className="folder-section">
      <div className="add-folder">
        {addingFolder
          ? (
            <div>
              <TextField label="Nombre"
                onChange={e => {
                  consultationStore.newFolder.name = e.target.value;
                  setStartedToWrite(true);
                }}
                onKeyPress={handleKeyPress}
                error={getError()}
                helperText={getError()}
                autoFocus />
              <IconButton color="primary" title="Guardar"
                disabled={getError()}
                onClick={() => addFolder()} >
                <Check/>
              </IconButton>
              <IconButton color="secondary" title="Cancelar" onClick={() => {setAddingFolder(false); setStartedToWrite(false);}} >
                <Close />
              </IconButton>
            </div>
          )
          :(
            <IconButton color="primary" title="Crear carpeta" onClick={() => setAddingFolder(true)} >
              <Add />
            </IconButton>)
        }

      </div>
      <h3>Carpetas</h3>
      <div className='folder-controls'>
        <div className='flex-fav'>
          <h4 style={{marginRight:15}}>Favoritas</h4>
          <FolderElement key={0} title="Todas"
            handler={() => {
              consultationStore.setFolder(undefined);
            }}
            noFolder={true}
            updateEvent={updateEvent}
            color={consultationStore.selectedFolder ? "default" : "primary"} />
          {consultationStore.myFolders.filter(f => f.isPinned).map((f, i) =>
            <FolderElement key={i + 1}
              folder={f}
              handler={() => {
                consultationStore.setFolder(f)
              }}
              updateEvent={updateEvent}
              title={f.name}
              color={consultationStore.selectedFolder?.id === f.id ? "primary" : "default"}/>)}
        </div>
        <div className='flex-all'>
          <div>
            <Button variant="outlined" color="default" onClick={() => setPagePosition(0)} disabled={pagePosition === 0} >
              <FastRewindIcon />
            </Button>
            <Button variant="outlined" color="default" onClick={() => setPagePosition(Math.min(0, pagePosition-pageStepSize))} disabled={pagePosition === 0} >
              <KeyboardArrowLeftIcon />
            </Button>
          </div>
          <div className={"folder-list"}>
          {consultationStore.myFolders
            .filter(f => !f.isPinned)
            .slice(pagePosition, pagePosition + pageSize)
              .map((f, i)  => <FolderElement key={i + 1}
                folder={f}
                handler={() => {
                  consultationStore.setFolder(f);
                }}
                updateEvent={updateEvent}
                title={f.name}
                color={consultationStore.selectedFolder?.id === f.id ? "primary" : "default"}/>)}
          </div>
          <div>
            <Button variant="outlined" color="default"
              onClick={() => setPagePosition(pagePosition+pageStepSize)}
              disabled={pagePosition >= consultationStore.myFolders.filter(f => !f.isPinned).length - pageSize}
            >
              <KeyboardArrowRightIcon />
            </Button>
            <Button variant="outlined" color="default"
              onClick={() => setPagePosition(consultationStore.myFolders.length - pageSize)}
              disabled={pagePosition >= consultationStore.myFolders.filter(f => !f.isPinned).length - pageSize}
            >
              <FastForwardIcon />
            </Button>
          </div>
        </div>
      </div>
      <div className={"folder-title"}>
        <IconButton color="primary" title="Crear carpeta"
          onClick={() => consultationStore.selectedFolder.togglePinned()}
          disabled={!consultationStore.selectedFolder} >
          {!consultationStore.selectedFolder || consultationStore.selectedFolder.isPinned ? <Star/> : <StarBorder/>}
        </IconButton>
        <IconButton color="secondary" title="Eliminar Carpeta"
          onClick={() => {
            consultationStore.selectedFolder.remove().then(() => {
              consultationStore.fetchMyFolders();
              consultationStore.setFolder(undefined)
            });
          }}
          disabled={!consultationStore.selectedFolder} >
          <Delete/>
        </IconButton>
        <h3><Folder/> {consultationStore.selectedFolder? consultationStore.selectedFolder.name : "Todas"}</h3>
      </div>
    </div>
  );
};

export default observer(FolderSection);
