import React, { useState, useEffect, useContext } from "react";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { dateToString } from "../../helpers/utils";
import StoreContext from "stores/RootStore";
import HistoryStore from "stores/HistoryStore";

import GridItem from "components/Grid/GridItem";
import GridContainer from "components/Grid/GridContainer";
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

const secuencialStringSearch = (pattern, text) => {
  pattern = pattern.toLowerCase().replace(/\s/g, '');
  text = text.toLowerCase();
  let i=0, j=0;
  while(i < pattern.length){
    while(j < text.length && pattern[i] !== text[j]) j++;
    if(j === text.length) return false;
    i++;
    j++;
  }
  return true;
}


function History() {
  const [historyStore, setHistoryStore] = useState(new HistoryStore());
  const [title, setTitle] = useState("");
  const [consultationTitle, setConsultationTitle] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [member, setMember] = useState("");
  const [fromDate, setFromDate] = useState(null)
  const [toDate, setToDate] = useState(null)

  const {consultationStore} = useContext(StoreContext);

  const filterData = (truths)=>{
    return truths.filter(truth => {
      return (!title || title.length === 0 || secuencialStringSearch(title, truth.title)) &&
      (!consultationTitle || consultationTitle.length === 0 || secuencialStringSearch(consultationTitle, truth.consultationTitle)) &&
      (selectedTags.length === 0 || truth.tags.some(t => selectedTags.indexOf(t) >= 0)) &&
      (!member || member.length === 0 || truth.members.some(m => m === member)) &&
      (!fromDate || fromDate <= truth.consultationEnd ) &&
      (!toDate || toDate  >= truth.consultationStart)
    }
      )
  }

  return  (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
    <div>
      <GridContainer style={{marginBottom:"20px"}}>
        <GridItem xs={12} sm={6} md={4}>
          <TextField
            label="Título"
            style={{marginTop:"16px"}}
            autoFocus={true}
            fullWidth
            value={title}
            onChange={ e => setTitle(e.target.value)}
          />
        </GridItem>
        <GridItem xs={12} sm={6} md={4}>
          <TextField
            label="Título de Consulta"
            style={{marginTop:"16px"}}
            autoFocus={true}
            fullWidth
            value={consultationTitle}
            onChange={ e => setConsultationTitle(e.target.value)}
          />
        </GridItem>
        <GridItem xs={12} sm={6} md={4}>
          <Autocomplete
            style={ { marginTop:"16px" }}
            multiple
            options={historyStore.allTags}
            getOptionLabel={(option) => option}
            onChange={(_,v) => setSelectedTags(v)}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="Etiquetas"
                placeholder="Etiqueta"
              />
            )}
          />
        </GridItem>
        <GridItem xs={12} sm={6} md={4}>
          <Autocomplete
            style={{marginTop:"16px"}}
            id="combo-box-demo"
            options={consultationStore.getAllMembers}
            getOptionLabel={(option) => option.userName}
            onChange={(_, v) => setMember(v ? v.userName : '')}
            renderInput={(params) => <TextField {...params} label="Miembros"/>}
          />
        </GridItem>
        <GridItem xs={12} sm={6} md={4}>
          <KeyboardDatePicker
            style={{width:"100%"}}
            disableToolbar
            variant="inline"
            format="dd/MM/yyyy"
            margin="normal"
            id="date-picker-inline"
            label="Después de"
            value={fromDate}
            onChange={(date) => {
              setFromDate(date);
            }}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}/>
        </GridItem>
        <GridItem xs={12} sm={6} md={4}>
          <KeyboardDatePicker
            style={{width:"100%"}}
            disableToolbar
            variant="inline"
            format="dd/MM/yyyy"
            margin="normal"
            id="date-picker-inline"
            label="Antes de"
            value={toDate}
            onChange={(date) => {
              setToDate(date);
            }}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}/>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
        <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell style={{fontWeight:"bold"}}>Título</TableCell>
            <TableCell style={{fontWeight:"bold"}}>Etiquetas</TableCell>
            <TableCell align="right" style={{fontWeight:"bold"}}>Fechas</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filterData(historyStore.truthes).map((truth) =>  (
            <TableRow key={truth.id}>
              <TableCell component="th" scope="row">
                <Link> {truth.title}</Link>
              </TableCell>
              <TableCell align="right">{dateToString(new Date(truth.consultationStart))} - {dateToString(new Date(truth.consultationEnd))}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
        </GridItem>
      </GridContainer>
    </div>
    </MuiPickersUtilsProvider>
  );
}

export default observer(History);