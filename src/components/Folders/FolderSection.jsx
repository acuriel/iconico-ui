import React, {useState, useEffect} from "react";
import {apiService, authService} from "../../services";

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
import StarBorder from '@material-ui/icons/StarBorder';

export default function FolderSection({folderSelectedHandler, updateEvent, ...props }) {
  const [pageStepSize, setPageStepSize] = useState(8);
  const [pageSize, setPageSize] = useState(8);
  const [pagePosition, setPagePosition] = useState(0);
  const [addingFolder, setAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [folders, setFolders] = useState([]);
  const [reload, setReload] = useState(0);
  const [selectedFolder, setSelectedFolder] = useState(undefined)
  
  useEffect(() => {
    apiService.getAllFolders().then(res => {
      setFolders(res.data);
      if(selectedFolder){
        const folder = res.data.find(f => f._id === selectedFolder._id);
        if(folder) setSelectedFolder(folder);
      }
    })
  }, [reload])
  
  const setFolder = folder => {
    setSelectedFolder(folder);
    setReload(reload+1);
    folderSelectedHandler(folder);
  }

  const addFolder = () => {
    apiService.addNewFolder({FolderName:newFolderName}).then(res => {
      setReload(reload+1);
      setNewFolderName("");
      setAddingFolder(false)
    })};

  const handleKeyPress = (event) => {
    if(event.key === 'Enter'){
      addFolder()
    }
  }


  return (
    <div className="folder-section">
      <div className="add-folder">
        {addingFolder 
          ? (
            <div>
              <TextField label="Nombre" 
                onChange={e => setNewFolderName(e.target.value)} 
                onKeyPress={handleKeyPress}
                autoFocus />
              <IconButton color="primary" title="Guardar" 
                onClick={() => addFolder()} >
                <Check/>
              </IconButton>
              <IconButton color="secondary" title="Cancelar" onClick={() => setAddingFolder(false)} >
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
      <div className='flex-fav'>
        <h4 style={{marginRight:15}}>Favoritas</h4>
        <FolderElement key={0} title="Todas" handler={() => setFolder(undefined)} noFolder={true} updateEvent={updateEvent} color={selectedFolder ? "default" : "primary"} />
        {folders.filter(f => f.isPinned).map((f, i) => 
          <FolderElement key={i + 1} 
            folder={f} 
            handler={() => setFolder(f)} 
            updateEvent={updateEvent} 
            color={selectedFolder && selectedFolder._id === f._id ? "primary" : "default"}/>)}
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
        {folders
          .filter(f => !f.isPinned)
          .slice(pagePosition, pagePosition + pageSize)
            .map((f, i)  => <FolderElement key={i}  updateEvent={updateEvent}
                  folder={f} 
                  color={selectedFolder && selectedFolder._id === f._id ? "primary" : "default"} 
                  title={f.FolderName}
                  handler={() => setFolder(f)} />)}
        </div>
        <div>
          <Button variant="outlined" color="default" 
            onClick={() => setPagePosition(pagePosition+pageStepSize)} 
            disabled={pagePosition >= folders.filter(f => !f.isPinned).length - pageSize}
          >
            <KeyboardArrowRightIcon />
          </Button>
          <Button variant="outlined" color="default" 
            onClick={() => setPagePosition(folders.length - pageSize)} 
            disabled={pagePosition >= folders.filter(f => !f.isPinned).length - pageSize}
          >
            <FastForwardIcon />
          </Button>
        </div>
      </div>
      <div className={"folder-title"}>
        <IconButton color="primary" title="Crear carpeta" 
          onClick={() => {apiService.togglePinFolder(selectedFolder).then(_ => setReload(reload+1))}} 
          disabled={!selectedFolder} >
          {!selectedFolder || selectedFolder.isPinned ? <Star/> : <StarBorder/>}
        </IconButton>
        <h3><Folder/> {selectedFolder ? selectedFolder.FolderName : "Todas"}</h3>
      </div>
    </div>
  );
};
