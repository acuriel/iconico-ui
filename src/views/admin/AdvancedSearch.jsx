import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { dateToString } from "../../helpers/utils";

import {apiService} from "../../services";
import GridItem from "components/Grid/GridItem";
import GridContainer from "components/Grid/GridContainer";
import CustomInput from "../../components/CustomInput/CustomInput";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
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
  // TODO get all external onnections in one endpoint

  const efClasses = useefStyles();

  const filteredData = ()=>{
    return allConsultations.filter(cons => 
      (title.length === 0 || secuencialStringSearch(title, cons.Tittle)) &&
      (member.length === 0 || cons.InternalMembers.some(m => m.UserName === member))
      )
  }

  const fetchData = async () => {
    const consReq = apiService.getAllConsultations();
    const imReq = apiService.getAllInternalMembers();
    const emReq = apiService.getAllExternalMembers();
    const [consRes, imRes, emRes] = await Promise.all([consReq, imReq, emReq]);
    setAllConsultations(consRes.data);
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
      <GridContainer>
        <GridItem xs={12} sm={6} md={3}>
          <CustomInput
            labelText="Titulo"
            id="title"
            value={title}
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              type: "text",
              required: true,
              onChange: e => {
                setTitle(e.target.value);
              }
            }}
          />
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <FormControl fullWidth className={efClasses.selectFormControl}>
            <InputLabel
              htmlFor="simple-select"
              className={efClasses.selectLabel}
            >
              Miembros Internos
            </InputLabel>
            <Select
              value={member}
              onChange={e => {
                setMember(e.target.value)
              }}
              MenuProps={{ className: efClasses.selectMenu }}
              classes={{ select: efClasses.select }}
            >
              <MenuItem
                key={0}
                value=""
                classes={{
                  root: efClasses.selectMenuItem,
                  selected: efClasses.selectMenuItemSelected
                }}
              >
                Todos
              </MenuItem>
              {allMembers.map((m, key) => (
                <MenuItem
                  key={key+1}
                  value={m}
                  classes={{
                    root: efClasses.selectMenuItem,
                    selected: efClasses.selectMenuItemSelected
                  }}
                >
                  {m}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <KeyboardDatePicker
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
            disableToolbar
            variant="inline"
            format="dd/MM/yyyy"
            margin="normal"
            id="date-picker-inline"
            label="Antes de"
            value={fromDate}
            onChange={(date) => {
              setFromDate(date);
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
            <TableCell>Título</TableCell>
            <TableCell align="right">Autor</TableCell>
            <TableCell align="right">Iniciada en</TableCell>
            <TableCell align="right">Estado</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData().map((consultation) => (
            <TableRow key={consultation._id}>
              <TableCell component="th" scope="row">
                {consultation.Tittle}
              </TableCell>
              <TableCell align="right">{consultation.Author.UserName}</TableCell>
              <TableCell align="right">{dateToString(new Date(consultation.IssuedOn))}</TableCell>
              <TableCell align="right">Estado</TableCell>
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
