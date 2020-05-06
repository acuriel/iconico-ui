import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { dateToString } from "../../helpers/utils";

import {apiService} from "../../services";
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

import efstyles from "assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.js";
const useefStyles = makeStyles(efstyles);

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


export default function AdvancedSearch() {
  const [title, setTitle] = useState("");
  const [member, setMember] = useState("");
  const [fromDate, setFromDate] = useState(null)
  const [toDate, setToDate] = useState(null)
  const [inProgressConsultations, setInProgressConsultations] = useState(true);
  const [finishedConsultations, setFinishedConsultations] = useState(true);
  const [incomingConsultations, setIncomingConsultations] = useState(true);

  const [allConsultations, setAllConsultations] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  const [allConnections, setAllConnections] = useState([]);

  const efClasses = useefStyles();

  const getState = (cons) => {
    if(cons.IsManuallyFinished) return "done";
    else if(new Date(cons.ExpiresOn) < Date.now()) return "blocked";
    else return "in-progress";
  }

  const STATUS_TEXT = {
    "done": "Terminada",
    "blocked": "Retrasada",
    "in-progress": "En progreso",
  }

  const chechDates = (date, cons) => {
    console.log(new Date(cons.IssuedOn) <= date);
    return !date || (new Date(cons.IssuedOn) <= date && date <= (cons.ManuallyFinishedOn || new Date(cons.ExpiresOn)))};

  const filteredData = ()=>{
    return allConsultations.filter(cons => {
      console.log( (cons.IsManuallyFinished ? cons.ManuallyFinishedOn : new Date(cons.ExpiresOn)));
      return (title.length === 0 || secuencialStringSearch(title, cons.Tittle)) &&
      (member.length === 0 || cons.InternalMembers.some(m => m.UserName === member) 
        || allConnections.some(cnx => cnx._idConsulta === cons._id && cnx.Receiver.UserName === member)) &&
      (!fromDate || fromDate <= (cons.IsManuallyFinished ? cons.ManuallyFinishedOn : new Date(cons.ExpiresOn))) && 
      (!toDate || toDate  >= new Date(cons.IssuedOn))
    }
      )
  }

  const fetchData = async () => {
    const consReq = apiService.getAllConsultations();
    const imReq = apiService.getAllInternalMembers();
    const emReq = apiService.getAllExternalMembers();
    const exReq = apiService.getAllExternalConnections();
    const [consRes, imRes, emRes, exRes] = await Promise.all([consReq, imReq, emReq, exReq]);
    setAllConsultations(consRes.data);
    setAllConnections(exRes.data);
    const iUsers = imRes.data.map(m => m.UserName);
    const eUsers = emRes.data.map(m => m.UserName);
    setAllMembers([...iUsers, ...eUsers])
  }

  useEffect(() => {
    fetchData();
  }, [])


  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
    <div>
      <GridContainer style={{marginBottom:"20px"}}>
        <GridItem xs={12} sm={6} md={3}>
          <TextField
            label="Título"
            style={{marginTop:"16px"}}
            autoFocus={true}
            fullWidth
            value={title}
            onChange={ e => setTitle(e.target.value)}
          />
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Autocomplete
            style={{marginTop:"16px"}}
            id="combo-box-demo"
            options={allMembers}
            getOptionLabel={(option) => option}
            onChange={(_, v) => setMember(v)}
            fullWidth
            renderInput={(params) => <TextField {...params} label="Miembros"/>}
          />
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
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
        <GridItem xs={12} sm={6} md={3}>
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
            <TableCell align="right" style={{fontWeight:"bold"}}>Autor</TableCell>
            <TableCell align="right" style={{fontWeight:"bold"}}>Inicio</TableCell>
            <TableCell align="right" style={{fontWeight:"bold"}}>Finalizada</TableCell>
            <TableCell align="right" style={{fontWeight:"bold"}}>Estado</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData().map((consultation) => (
            <TableRow key={consultation._id}>
              <TableCell component="th" scope="row">
                <Link to={"/admin/consulta/" + consultation._id}> {consultation.Tittle}</Link>
              </TableCell>
              <TableCell align="right">{consultation.Author.UserName}</TableCell>
              <TableCell align="right">{dateToString(new Date(consultation.IssuedOn))}</TableCell>
              <TableCell align="right">{consultation.IsManuallyFinished ? dateToString(new Date(consultation.ManuallyFinishedOn)) : "-"}</TableCell>
              <TableCell align="right"><span className={`status ${getState(consultation)}`}>{STATUS_TEXT[getState(consultation)]}</span></TableCell>
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
